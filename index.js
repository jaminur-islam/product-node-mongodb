const express = require('express');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2uuip.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

const run = async() =>{
  try{
    await client.connect();
    const database = client.db('my-all-products');
    const productCollection = database.collection('products');
    const adminCollection = database.collection('my')
   
    // get my data
  app.get('/my/:email' , async(req , res) =>{

    console.log(req.params.email)

    const query = { email:  req.params.email };
    const products = await adminCollection.find(query).toArray()
    res.json(products); 
  })


   // post add api
   app.post('/add' , async(req , res)=>{
      const product = req.body
      const result = await adminCollection.insertOne(product);
      
      res.json(result);

   })

  // update api
   app.put('/products/:id' , async(req , res)=>{
       const id = req.params.id
       const data = req.body;
       const filter = {_id: ObjectId(id)}
       console.log(data , id)

       const doc = {

        $set:{
          name: data.name,
          price: data.price
        }
        
       }

       const result = await productCollection.updateOne(filter , doc)
       res.json(result);
   })

   // POST api
    app.post('/products' , async(req , res ) => {
      const product  = req.body;
      const result = await productCollection.insertOne(product);

      res.json(result);
    })

    //  GET SINGLE  api
    app.get('/products/:id' , async(req, res)=>{
      const id  = req.params.id;
      const query = {_id : ObjectId(id)};
      const product = await productCollection.findOne(query);
      res.json(product)
    })

   // DELETE api
   app.delete('/products/:id' , async(req , res)=>{
     const id = req.params.id
     const query = {_id: ObjectId(id)};
     const result = await productCollection.deleteOne(query);
     res.json(result)
   })

   // GET api
    app.get('/products' ,async(req , res)=>{
       const cursor = productCollection.find({});
       const products = await cursor.toArray();
       res.json(products);
    })

  
    
  }
  finally{
  //  client.close()
  }


}
run().catch(console.dir);


//  GET 
app.get('/' , (req, res)=>{
  res.send('the sarver was running')
})


 // PORT
 app.listen(port , ()=>{
  console.log(port);
})

