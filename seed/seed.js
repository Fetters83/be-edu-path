const { MongoClient } = require("mongodb");
const csvtojson = require("csvtojson");

// MongoDB connection details
const uri = `mongodb+srv://wgyves:${process.env.PASSWORD}@fetters.5d3ue.mongodb.net`;
const dbName = "eduPath";

// Path to the data folder
const dataPath = "/home/bill/edu-path/be-edu-path/data";

// Define the files and their corresponding collections
const files = [
  { file: `${dataPath}/studentsCollection.csv`, collection: "students" },
  { file: `${dataPath}/behaviorCollection.csv`, collection: "behavior_logs" },
  { file: `${dataPath}/suggestionsCollection.csv`, collection: "suggestions" },
];

const client = new MongoClient(uri);

const dropCollection = async (db, collection) => {
  try {
    console.log(`Dropping collection: ${collection}`);
    await db.collection(collection).drop();
    console.log(`Successfully dropped collection: ${collection}`);
  } catch (error) {
    if (error.message.includes("ns not found")) {
      console.log(`Collection ${collection} does not exist, skipping.`);
    } else {
      throw error;
    }
  }
};

const importFile = async (db, file, collection) => {
  try {
    console.log(`Importing ${file} into ${collection} collection...`);
    
    // Convert CSV to JSON and transform fields
    const jsonArray = await csvtojson({
      checkType: true, // Automatically detect numbers and booleans
    }).fromFile(file);

    const transformedData = jsonArray.map((record) => {
      // Transform specific fields
      if (record.studentId) record.studentId = parseInt(record.studentId, 10);
      if (record.yearGroup) record.yearGroup = parseInt(record.yearGroup, 10);
      if (record.attendance) record.attendance = parseFloat(record.attendance);
      if (record.dateCreated) record.dateCreated = new Date(record.dateCreated);
      if (record.dateResolved) record.dateResolved = new Date(record.dateResolved);
      if (record.followUpRequired) record.followUpRequired = record.followUpRequired === "true";

      // Return the transformed record
      return record;
    });

    await db.collection(collection).insertMany(transformedData);
    console.log(`Successfully imported ${file} into ${collection}!`);
  } catch (error) {
    console.error(`Error importing ${file}:`, error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db(dbName);

    // Process each file and collection
    for (const { file, collection } of files) {
      await dropCollection(db, collection); // Drop the collection
      await importFile(db, file, collection); // Import the file
    }

    console.log("Database seeding completed!");
  } catch (error) {
    console.error("Error during database seeding:", error);
  } finally {
    await client.close();
  }
};

// Execute the seed process
seedDatabase();