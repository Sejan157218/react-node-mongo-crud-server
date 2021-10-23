const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 9000;

//middleware

app.use(cors());
app.use(express.json());

// mymongo1 
// 5ZaGdWmhoivqS5G2



const uri = "mongodb+srv://mymongo1:5ZaGdWmhoivqS5G2@cluster0.iw7ld.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("foodmaster");
        const users = database.collection("users");
        // create a document to insert
        //   const doc = {
        //     name: "sejan",
        //     email: "sejan@gmail.com",
        //   }
        //   const result = await users.insertOne(doc);
        //   console.log(`A document was inserted with the _id: ${result.insertedId}`);
        // } finally {
        //   await client.close();
        // }

        // const array = [{name:'sejan'}]

        // Get API
        app.get('/users', async (req, res) => {
            const cursor = users.find({});
            const results = await cursor.toArray();
            res.send(results);
        })

        // Get API with id
        app.get('/users/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await users.findOne(query)
            res.send(result)
        })
        // Post Api
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await users.insertOne(newUser)
            console.log(`added`, result);
            res.json(result)
        })

        // update post
        app.put('/users/:id', async(req,res)=>{
            const id = req.params.id;
            const filter = {_id:ObjectId(id)}
            const updateUser = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                 
                      name : updateUser.name,
                      email : updateUser.email
                
                },
              };
              const result = await users.updateOne(filter, updateDoc, options);
            res.json(result)
        })

        // delete post
        app.delete('/users/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)}
            // const result = await movies.deleteOne(query);
            const result = await users.deleteOne(query);
            console.log("delete id",result);
            res.json(result)
        })
    }
    finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('this is server site')
})


app.listen(port, () => {
    console.log('Running Server', port)
})