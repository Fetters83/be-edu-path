const { client, run } = require('../connection');


//model to fetch all severity codes
const fetchSeverities = async () => {
  try {
    //ensure a connection to the mongo db client
    await run();

    //execute mongo db query and store against variable records
    const records =  await client.db('eduPath').collection('severities').find().toArray();
    //return records result
    return records
  } catch (error) {
    throw error;
  }
};

//model to insert new severity code
const insertNewSeverity = async (severityCode) => {
  try {

    //check if severity code passed from the request body is a string, if not throw an error
    if(typeof severityCode != 'string'){
        throw({status:404,msg:'Severity code must be of type string'})
    }

    //fetch all existing severity codes
    const severities = await fetchSeverities()
    //return true if the servity code exists in the collection
    const severityExists = severities.some(severities=>severities.severityCode===severityCode)
    //if severity code exists throw an error
    if(severityExists) throw({status:404,msg:'Severity Code already exists!'})
    
    //ensure a connection to the mongo db client
    await run();
    //execute insert operation for the new severity and store result against the variable result
    const result = await client.db('eduPath').collection('severities').insertOne({ severityCode });
    //return the result inside an object
    return {severityCode:"New Severity Code successfully posted!",result};
  } catch (error) {
    throw error;
  }
};

module.exports = { fetchSeverities, insertNewSeverity };
