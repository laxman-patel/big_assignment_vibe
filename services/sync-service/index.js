const { Kafka } = require('kafkajs');
const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });
const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'ProductStats';

const kafka = new Kafka({
    clientId: 'sync-service',
    brokers: [process.env.KAFKA_BROKER],
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: process.env.KAFKA_API_KEY,
        password: process.env.KAFKA_API_SECRET,
    },
});

const consumer = kafka.consumer({ groupId: 'sync-group' });

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'aggregated-results', fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const data = JSON.parse(message.value.toString());
                // Data format from Flink: { window_start, window_end, productId, click_count }

                console.log(`Updating stats for ${data.productId}: +${data.click_count}`);

                await dynamo.update({
                    TableName: TABLE_NAME,
                    Key: { ProductId: data.productId },
                    UpdateExpression: 'ADD ClickCount :inc',
                    ExpressionAttributeValues: {
                        ':inc': data.click_count
                    }
                }).promise();

            } catch (e) {
                console.error('Error processing message:', e);
            }
        },
    });
};

run().catch(console.error);
