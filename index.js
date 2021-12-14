const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb');
const port = process.env.PORT || 8000
require('dotenv').config()


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.axy7a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect()
        const database = client.db('Gmhs')
        const noticeCollection = database.collection('notice')
        const resultCollection = database.collection('result')
        const newsCollection = database.collection('news')

        app.get('/notices', async (req,res)=>{
            const cursor = await noticeCollection.find({})
            const notices = await cursor.toArray()
            res.json(notices)
        })

        app.get('/news', async (req,res)=>{
            const cursor = await newsCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        })

        app.post('/notices', async (req,res)=>{
           const notice = req.body
           const result = await noticeCollection.insertOne(notice)
           
           res.json(result)
        })
        app.delete('/notices/:id', async (req,res)=>{
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const result = await noticeCollection.deleteOne(query)
            res.json(result)

        })

        app.post('/news', async (req,res)=>{
            const news = req.body
            const result = await newsCollection.insertOne(news)
            res.json(result)
        })

    }
    finally{
        // await client.close()

    }
}
run().catch(console.dir)











app.get('/', (req,res)=>{
    res.send('Admin Panel server running')
})

app.listen(port,()=>{
    console.log(`listening at port: ${port}`)
})