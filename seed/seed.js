const { exec } = require("child_process");

// MongoDB connection details
const uri = "mongodb+srv://wgyves:HVEYvzBexln8zs8F@fetters.5d3ue.mongodb.net";
const dbName = "eduPath";

// Path to the data folder
const dataPath = "/home/bill/edu-path/data";

// Define the files and their corresponding collections
const files = [
  { file: `${dataPath}/studentsCollection.csv`, collection: "students" },
  { file: `${dataPath}/behaviorCollection.csv`, collection: "behavior_logs" },
  { file: `${dataPath}/suggestionsCollection.csv`, collection: "suggestions" },
];

// Function to import a single file
const importFile = ({ file, collection }) => {
  const command = `
    mongoimport --uri "${uri}" \
    --db ${dbName} --collection ${collection} --type csv \
    --file ${file} --headerline
  `;

  console.log(`Importing ${file} into ${collection} collection...`);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error importing ${file}: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`Successfully imported ${file} into ${collection}!`);
  });
};

// Iterate over each file and import it
files.forEach(importFile);

