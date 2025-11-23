const express = require('express');
const { Kafka } = require('kafkajs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const kafka = new Kafka({
  clientId: 'ingest-service',
  brokers: [process.env.KAFKA_BROKER],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_API_KEY,
    password: process.env.KAFKA_API_SECRET,
  },
});

const producer = kafka.producer();

app.post('/click', async (req, res) => {
  try {
    const { productId, userId } = req.body;
    await producer.send({
      topic: 'raw-clicks',
      messages: [
        { value: JSON.stringify({ productId, userId, timestamp: Date.now() }) },
      ],
    });
    res.status(200).send('Click recorded');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error recording click');
  }
});

const run = async () => {
  await producer.connect();
  app.listen(port, () => {
    console.log(`Ingest service listening at http://localhost:${port}`);
  });
};

run().catch(console.error);
