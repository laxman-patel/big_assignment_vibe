const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'audit-service',
    brokers: [process.env.KAFKA_BROKER],
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: process.env.KAFKA_API_KEY,
        password: process.env.KAFKA_API_SECRET,
    },
});

const consumer = kafka.consumer({ groupId: 'audit-group' });

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'aggregated-results', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString(),
            });
            // In a real app, write to DB or persistent log
        },
    });
};

run().catch(console.error);
