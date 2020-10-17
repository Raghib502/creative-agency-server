const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()

const app = express()

app.use(cors())
app.use(bodyParser.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tkjat.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
app.get('/', (req, res) => {
    res.send('Creative Agency Server is Working!')
})

client.connect(err => {
    const orderList = client.db("creativeAgency").collection("orders");
    const serviceList = client.db("creativeAgency").collection("services");
    const reviewList = client.db("creativeAgency").collection("review");
    const adminList = client.db("creativeAgency").collection("admin");

    app.post('/addService', (req, res) => {
        const service = req.body;
        serviceList.insertMany(service)
        .then(result => {
           // console.log(result.insertedCount);
            res.send(result.insertedCount)
        })
    })



    app.get('/allServices', (req, res) => {
        serviceList.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })


    app.post('/addOrder', (req, res) => {
        const order = req.body;
        console.log(order);
        orderList.insertOne(order)
        .then(result => {
        res.send(result)
      
    })
  })

  app.get('/allOrder', (req, res) => {
    orderList.find({email: req.query.email})
    .toArray((err, documents) => {
        res.send(documents)
    })
})

app.post('/addReview', (req, res) => {
    const review = req.body;
    console.log(review);
    reviewList.insertOne(review)
    .then(result => {
    res.send(result)
  
    })
 })
 app.get('/allOrderList', (req, res) => {
    orderList.find({})
    .toArray((err, documents) => {
        res.send(documents);
    })
  })
  app.delete('/deleteUser/:id', (req, res) => {
    userList.deleteOne({_id: ObjectId(req.params.id)})
    .then( result => {
      // console.log(result);
      res.send(result.deletedCount > 0);
    })
  })
  app.post('/addAdmin', (req, res) => {
    const admin = req.body;
    adminList.insertOne(admin)
    .then(result => {
        // console.log(result)
        res.send(result.insertedCount > 0)
    })
  });

  app.post('/getAdmin', (req, res) => {
    const email = req.body.email;
    adminList.find({email: email})
    .toArray((error, documents) => {
       res.send(documents.insertedCount> 0);

    })
  });
});



app.listen(process.env.PORT || 4000)