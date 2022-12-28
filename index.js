const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config();
const port = 4000 || process.env.PORT;

// middlewares
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);

app.get('/', (req, res) => {
    res.send('Root testing request with nodemon 3');
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p9scd9o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const tasksCollection = client.db("everyday-task").collection("tasks");



async function run() {
    try {
        app.post('/tasks', async (req, res) => {
            const result = await tasksCollection.insertOne(req.body);

            res.send(result);
        })

        app.get('/tasks', async (req, res) => {
            const query = {};
            const tasks = await tasksCollection.find(query).toArray();

            res.send(tasks);
        })
    }
    finally { }
}

run().catch(error => console.error(error));

app.listen(port, () => {
    console.log(`Everyday task server runnig on port ${port}`);
})