const express = require('express');
const cors = require('cors');
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

async function run() {
    try {
        app.post('/tasks', async (req, res) => {
            console.log(req);
        })
    }
    finally { }
}

run().catch(error => console.error(error));

app.listen(port, () => {
    console.log(`Everyday task server runnig on port ${port}`);
})