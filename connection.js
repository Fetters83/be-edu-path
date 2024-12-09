const { MongoClient, ServerApiVersion } = require('mongodb');


const uri = `mongodb+srv://wgyves:${process.env.PASSWORD}@fetters.5d3ue.mongodb.net/?retryWrites=true&w=majority&appName=fetters`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    if (!client.isConnected) {
      await client.connect();
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
  }
}

module.exports = { client, run };
