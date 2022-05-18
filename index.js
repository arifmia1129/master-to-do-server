const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uuaft.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("MasterToDo").collection("task");

        app.post("/task", async (req, res) => {
            const doc = req.body;
            const result = await taskCollection.insertOne(doc);
            res.send(result);
        })

        app.get("/task/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const tasks = await taskCollection.find(query).toArray();
            res.send(tasks);
        })
        app.put("/task/:id", async (req, res) => {
            const id = req.params.id;
            const completeStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: completeStatus
            }
            const result = await taskCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Hello from master to do server.")
})

app.listen(port, () => {
    console.log(`Master To Do listening on port ${port}`);
})