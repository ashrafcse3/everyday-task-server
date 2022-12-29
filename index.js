const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
const commentsCollection = client.db("everyday-task").collection("comments");



async function run() {
    try {
        app.post('/tasks', async (req, res) => {
            const result = await tasksCollection.insertOne(req.body);

            res.send(result);
        })

        app.get('/tasks', async (req, res) => {
            const query = {};
            const tasks = await (await tasksCollection.find(query).toArray()).reverse();

            res.send(tasks);
        })

        app.get('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const task = await tasksCollection.findOne(query);

            res.send(task);
        })

        app.get('/noncompletedtasks', async (req, res) => {
            const query = { task_completed: false };
            const tasks = await (await tasksCollection.find(query).toArray()).reverse();

            res.send(tasks);
        })

        app.get('/completedtasks', async (req, res) => {
            const query = { task_completed: true };
            const tasks = await (await tasksCollection.find(query).toArray()).reverse();

            res.send(tasks);
        })

        app.put('/maketaskcomplete/:id', async (req, res) => {
            const id = req.params.id;

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const taskCompleted = {
                $set: {
                    task_completed: true
                }
            }

            const result = await tasksCollection.updateOne(filter, taskCompleted, options);

            res.send(result);
        })

        app.put('/maketaskuncomplete/:id', async (req, res) => {
            const id = req.params.id;

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const taskNotCompleted = {
                $set: {
                    task_completed: false
                }
            }

            const result = await tasksCollection.updateOne(filter, taskNotCompleted, options);

            res.send(result);
        })

        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const body = req.body;

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateTask = {
                $set: body
            }

            const result = await tasksCollection.updateOne(filter, updateTask, options);

            res.send(result);
        })

        app.delete('/task/:id', (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = tasksCollection.deleteOne(query);

            res.send(result);
        })

        // task comment
        app.post('/comments', async (req, res) => {
            const result = await commentsCollection.insertOne(req.body);

            res.send(result);
        })

        app.get('/comments/:taskid', async (req, res) => {
            const taskId = req.params.taskid;
            const query = { task_id: taskId };
            const comments = await (await commentsCollection.find(query).toArray()).reverse();

            res.send(comments);
        })

        app.delete('/comments/:commentid', async (req, res) => {
            const commentId = req.params.commentid;
            const query = { _id: ObjectId(commentId) };

            const result = await commentsCollection.deleteOne(query);

            res.send(result);
        })
    }
    finally { }
}

run().catch(error => console.error(error));

app.listen(port, () => {
    console.log(`Everyday task server runnig on port ${port}`);
})