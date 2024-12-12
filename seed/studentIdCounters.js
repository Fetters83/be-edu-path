const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = `mongodb+srv://wgyves:${process.env.PASSWORD}@fetters.5d3ue.mongodb.net`;
const dbName = "eduPath";

const client = new MongoClient(uri);


const seedCounters = async () => {
  try {
    await client.connect();
    const db = client.db(dbName);

    const countersCollection = db.collection('studentIdCounters');

  
    const existingCounter = await countersCollection.findOne({ _id: 'studentId' });
    if (!existingCounter) {
    
      await countersCollection.insertOne({ _id: 'studentId', lastValue: 1388 });
      console.log("Seeded studentId counter with initial value of 1388.");
    } else {
      console.log("studentId counter already exists:", existingCounter);
    }
  } catch (error) {
    console.error("Error seeding counters:", error);
  } finally {
    await client.close();
  }
};

seedCounters();
