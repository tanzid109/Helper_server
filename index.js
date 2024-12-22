const express = require('express')
const cors = require('cors')
require('dotenv').config()

const port = process.env.PORT || 5000
const app = express()

//middleware
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@movieportal.agm7k.mongodb.net/?retryWrites=true&w=majority&appName=MoviePortal`;

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
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const serviceCollection = client.db('Services-db').collection('services')

        app.post('/add-service', async (req, res) => {
            const serviceData = req.body
            const result = await serviceCollection.insertOne(serviceData)
            console.log(result);
            res.send(result)
        })
        //get all service
        app.get('/services', async (req, res) => {
            const result = await serviceCollection.find().toArray()
            res.send(result)
        })
        // get specific user data
        app.get('/services/:email', async (req, res) => {
            const email = req.params.email
            const query = { 'service_provider.email': email }
            const result = await serviceCollection.find(query).toArray();
            res.send(result);
        })
        //delete service
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await serviceCollection.deleteOne(query)
            res.send(result)
        })
        //fina a single service
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await serviceCollection.findOne(query)
            res.send(result)
        })
        //update a service
        app.put('/update-service/:id', async (req, res) => {
            const id = req.params.id
            const serviceData = req.body
            const updated = {
                $set: serviceData,
            }
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const result = await serviceCollection.updateOne(query, updated, options)
            console.log(result);
            res.send(result)
        })

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('what service do you need?')
})

app.listen(port, () => {
    console.log(`service is waiting at: ${port}`)
})