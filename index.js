const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.q3zjxg2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        await client.connect();
        const database = client.db('CraftifyBD')
        const productCollection = database.collection('products')
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id
            const cursor = await productCollection.findOne({ _id: new ObjectId(id) })
            res.send(cursor)
        })
        app.post('/products', async (req, res) => {
            const data = req.body
            const cursor = await productCollection.insertOne(data)
            res.send(cursor)
        })
        app.get('/userproducts/:id', async (req, res) => {
            const user = req.params.id
            const query = { "userEmail": user }
            const cursor = productCollection.find(query)
            const result = await cursor.toArray()
            res.send(result);
        })
        app.put('/userproducts/:id', async (req, res) => {
            const id = req.params.id
            const data = req.body
            const filter = { _id: new ObjectId(id) }
            const cursor = {
                $set: {
                    itemPhoto: data.itemPhoto,
                    itemName: data.itemName,
                    subCategory: data.subCategory,
                    price: data.price,
                    rating: data.rating,
                    customization: data.customization,
                    processingTime: data.processingTime,
                    stockStatus: data.stockStatus,
                    itemDescription: data.itemDescription,
                }
            }
            const options = {
                upsert: true
            }
            const result = await productCollection.updateOne(filter, cursor, options)
            res.send(result)
        })
        app.delete('/userproducts/:id', (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = productCollection.deleteOne(query)
            res.send(result)
        })
    } finally {
    }
}
app.listen(port, () => {
    console.log("Listening...");
})
run().catch(console.dir);
