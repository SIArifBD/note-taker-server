const express = require('express');
const app = express();
const cors = require("cors");
const port = 5000;

//get http://localhost:5000/notes
//post http://localhost:5000/note
//put and delete http://localhost:5000/note/627250fb7c7d7f247fd55e10
/**
 * {
    "userName": "Shakil",
    "dataText": "Cricketer"
    }
 */

//midleware
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://admin:6i0ycVmpKG5B4qPx@cluster0.f3frx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const notesCollection = client.db('notesTaker').collection('notes');

        //get api to read all notes
        app.get('/notes', async (req, res) => {
            const q = req.query;
            console.log(q);
            const cursor = notesCollection.find({})
            const result = await cursor.toArray();
            res.send(result);
        });

        //create notesTaker
        app.post('/note', async (req, res) => {
            const data = req.body;
            console.log("From post api", data);
            const result = await notesCollection.insertOne(data);
            res.send(result);
        });

        //update notesTaker
        app.put('/note/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            console.log('from update api', data);
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    userName: data.userName,
                    textData: data.textData
                },
            };
            const result = await notesCollection.updateOne(filter, updateDoc, option);
            // console.log('from put method', id);
            res.send(result);
        });

        //delete notesTaker
        app.delete('/note/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await notesCollection.deleteOne(filter);
            res.send(result);
        });
        console.log('connected to db');
    }
    finally {

    }
}
run().catch(console.dir);

// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     // client.close();
//     console.log('connected to db');
// });

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})