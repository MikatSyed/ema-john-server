const express = require('express')
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const port = 6700

const app = express()
app.use(bodyParser.json())
app.use(cors())

const uri = 'mongodb+srv://emaJohnNew:emaJohn111@cluster0.du7xt.mongodb.net/emaJohnStore?retryWrites=true&w=majority';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



client.connect(err => {
  // console.log(err);
  const productCollection = client.db("emaJohnStore").collection("products");
  const orderCollection = client.db("emaJohnStore").collection("orders");
  
  console.log("connected successfully");


  app.post('/addProduct',(req,res)=>{
      const products = req.body;
      console.log(products);
      productCollection.insertOne(products)
      .then(result => {
        console.log(result.insertedCount)
        res.send(result.insertedCount)
      })
  })

  app.post('/addOrder',(req,res)=>{
    const order = req.body;
    console.log(order);
   orderCollection.insertOne(order)
    .then(result => {
      // console.log(result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })





  app.get('/products',(req, res) => {
    const search = req.query.search;
    productCollection.find({name:{$regex: search}})
    .toArray((err,documents) => {
       res.send(documents)
    })
  })

  app.get('/product/:key',(req, res) => {
    productCollection.find({key: req.params.key})
    .toArray((err,document) => {
       res.send(document[0])
    })
  })

  app.post('/productsByKeys',(req, res) => {
    const productKeys = req.body;
    productCollection.find({key: {$in: productKeys }})
    .toArray((err,document) => {
       res.send(document)
    })
  })

});





app.get('/', (req, res) => {
  res.send('Hello I am Working Hurry!')
})

app.listen(port)