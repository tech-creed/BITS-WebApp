const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Binary-Beast-01:Binary-Beast-01@cluster-01.tja3ztc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});