const express = require('express');
const AWS = require('aws-sdk');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });
const dynamo = new AWS.DynamoDB.DocumentClient();
const PRODUCTS_TABLE = 'ProductsTable';
const STATS_TABLE = 'ProductStats';

// Get Product Details
app.get('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const params = {
            TableName: PRODUCTS_TABLE,
            Key: { ProductId: id },
        };
        const result = await dynamo.get(params).promise();
        if (result.Item) {
            res.json(result.Item);
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching product');
    }
});

// Get Top Products Stats
app.get('/stats', async (req, res) => {
    try {
        const params = {
            TableName: STATS_TABLE,
        };
        const result = await dynamo.scan(params).promise();
        res.json(result.Items);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching stats');
    }
});

// Seed Data
app.post('/seed', async (req, res) => {
    try {
        const products = [
            { ProductId: 'prod-1', Name: 'Laptop', Price: 999 },
            { ProductId: 'prod-2', Name: 'Phone', Price: 599 },
            { ProductId: 'prod-3', Name: 'Headphones', Price: 199 },
            { ProductId: 'prod-4', Name: 'Monitor', Price: 299 },
            { ProductId: 'prod-5', Name: 'Keyboard', Price: 99 },
        ];

        for (const p of products) {
            await dynamo.put({
                TableName: PRODUCTS_TABLE,
                Item: p
            }).promise();
        }
        res.send('Seeded successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error seeding data');
    }
});

app.listen(port, () => {
    console.log(`Product service listening at http://localhost:${port}`);
});
