const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = `mongodb+srv://wgyves:${process.env.PASSWORD}@fetters.5d3ue.mongodb.net`;
const dbName = "eduPath";

const client = new MongoClient(uri);

const seedCounters = async () => {
  try {
    await client.connect();
    const db = client.db(dbName);

    const countersCollection = db.collection('behaviorLogIdCounters');


    const existingCounter = await countersCollection.findOne({ _id: 'behaviorLogId' });
    if (!existingCounter) {

      await countersCollection.insertOne({ _id: 'behaviorLogId', lastValue: 1351 });
      console.log("Seeded behaviorLogId counter with initial value of 1351.");
    } else {
      console.log("behaviorLogId counter already exists:", existingCounter);
    }
  } catch (error) {
    console.error("Error seeding counters:", error);
  } finally {
    await client.close();
  }
};

seedCounters();