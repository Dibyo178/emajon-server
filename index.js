const express = require('express');
require('dotenv').config();
const bodyParser=require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const app = express()
const port = 5000

app.get('/', (req, res) => {
  res.send("hello from db it's working")
})


app.use(bodyParser.json());
app.use(cors());



const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.i7d38.mongodb.net:27017,cluster0-shard-00-01.i7d38.mongodb.net:27017,cluster0-shard-00-02.i7d38.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-123ytz-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true  });




client.connect(err => {
  const productCollection = client.db("emajon-store").collection("products");
  const ordersCollection = client.db("emajon-store").collection("orders");
  console.log('databasee connect');
   app.post('/addProduct',(req,res)=>{
     const allProduct=req.body;
    //  console.log(product);
    // productCollection.insertMany(allProduct)
    //image upload
    productCollection.insertOne(allProduct)
     .then(result=>{
       console.log(result.insertedCount);
       res.send(result.insertedCount)

     })

   })    


app.get('/products', (req, res) => {
  const search=req.query.search;
  // productCollection.find({name:{$regex:search} })
  productCollection.find({ })
  .toArray((err,document)=>{
    res.send(document);
  })
  
  
})
// app.get('/productt', (req, res) => {
//   const search=req.query.search;
//   productCollection.find({})
//   .toArray((err,document)=>{
//     res.send(document);
//   })
  
  
// })



app.get('/product/:key', (req, res) => {
  
  productCollection.find({key:req.params.key})
  .toArray((err,document)=>{
    res.send(document[0]);
  })
  
  
})
app.post('/productByKeys',(req,res)=>{
  const productKeys=req.body;
  productCollection.find({key:{$in:productKeys}})
  .toArray((err,document)=>{
    res.send(document);
  })
})

app.post('/addOrder',(req,res)=>{
  const order=req.body;
 ordersCollection.insertOne(order)
  .then(result=>{
 
    res.send(result.insertedCount>0)

  })

})    

 


});

app.listen(process.env.PORT || port);


