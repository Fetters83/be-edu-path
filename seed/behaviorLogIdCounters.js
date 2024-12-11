const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://wgyves:HVEYvzBexln8zs8F@fetters.5d3ue.mongodb.net";
const dbName = "eduPath";

const client = new MongoClient(uri);

const seedCounters = async () => {
  try {
    await client.connect();
    const db = client.db(dbName);

    const countersCollection = db.collection('behaviorLogIdCounters');

    // Check if the counter for behaviorLogId already exists
    const existingCounter = await countersCollection.findOne({ _id: 'behaviorLogId' });
    if (!existingCounter) {
      // Seed the initial value for the behaviorLogId counter
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