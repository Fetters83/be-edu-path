const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = `mongodb+srv://wgyves:${process.env.PASSWORD}@fetters.5d3ue.mongodb.net`;
const dbName = "eduPath";

const client = new MongoClient(uri);

const seedCounters = async () => {
  try {
    await client.connect();
    const db = client.db(dbName);

    const countersCollection = db.collection('suggestionIdCounters');

  
    const existingCounter = await countersCollection.findOne({ _id: 'suggestionId' });
    if (!existingCounter) {

      await countersCollection.insertOne({ _id: 'suggestionId', lastValue: 1147 });
      console.log("Seeded suggestionId counter with initial value of 1147.");
    } else {
      console.log("suggestionId counter already exists:", existingCounter);
    }
  } catch (error) {
    console.error("Error seeding counters:", error);
  } finally {
    await client.close();
  }
};

seedCounters();