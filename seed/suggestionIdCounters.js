const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://wgyves:HVEYvzBexln8zs8F@fetters.5d3ue.mongodb.net";
const dbName = "eduPath";

const client = new MongoClient(uri);

const seedCounters = async () => {
  try {
    await client.connect();
    const db = client.db(dbName);

    const countersCollection = db.collection('suggestionIdcounters');

    // Check if the counter for suggestionId already exists
    const existingCounter = await countersCollection.findOne({ _id: 'suggestionId' });
    if (!existingCounter) {
      // Seed the initial value for the suggestionId counter
      await countersCollection.insertOne({ _id: 'studentId', lastValue: 1147 });
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