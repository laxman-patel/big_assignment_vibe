from pyflink.datastream import StreamExecutionEnvironment
from pyflink.table import StreamTableEnvironment, EnvironmentSettings

import os

def log_processing():
    kafka_bootstrap = os.environ.get('KAFKA_BOOTSTRAP_SERVERS', 'pkc-xxxx.us-east-1.aws.confluent.cloud:9092')
    env = StreamExecutionEnvironment.get_execution_environment()
    env.set_parallelism(1)
    settings = EnvironmentSettings.new_instance().in_streaming_mode().build()
    t_env = StreamTableEnvironment.create(env, environment_settings=settings)

    # Define source table (Kafka raw-clicks)
    t_env.execute_sql("""
        CREATE TABLE raw_clicks (
            productId STRING,
            userId STRING,
            ts TIMESTAMP(3),
            WATERMARK FOR ts AS ts - INTERVAL '5' SECOND
        ) WITH (
            'connector' = 'kafka',
            'topic' = 'raw-clicks',
            'properties.bootstrap.servers' = '{kafka_bootstrap}',
            'properties.group.id' = 'flink-group',
            'scan.startup.mode' = 'latest-offset',
            'format' = 'json'
        )
    """)

    # Define sink table (Kafka aggregated-results)
    t_env.execute_sql(f"""
        CREATE TABLE aggregated_results (
            window_start TIMESTAMP(3),
            window_end TIMESTAMP(3),
            productId STRING,
            click_count BIGINT
        ) WITH (
            'connector' = 'kafka',
            'topic' = 'aggregated-results',
            'properties.bootstrap.servers' = '{kafka_bootstrap}',
            'format' = 'json'
        )
    """)

    # Execute query
    t_env.execute_sql("""
        INSERT INTO aggregated_results
        SELECT
            window_start,
            window_end,
            productId,
            COUNT(userId) as click_count
        FROM TABLE(
            TUMBLE(TABLE raw_clicks, DESCRIPTOR(ts), INTERVAL '1' MINUTE)
        )
        GROUP BY window_start, window_end, productId
    """)

if __name__ == '__main__':
    log_processing()
