const { client, run } = require('../connection');

const fetchSeverities = async () => {
  try {
    await run();
    return await client.db('eduPath').collection('severities').find().toArray();
  } catch (error) {
    throw error;
  }
};

const insertNewSeverity = async (severityCode) => {
  try {

    if(typeof severityCode != 'string'){
        throw({status:404,msg:'Severity code must be of type string'})
    }

    const severities = await fetchSeverities()
    const severityExists = severities.some(severities=>severities.severityCode===severityCode)

    if(severityExists) throw({status:404,msg:'Severity Code already exists!'})
    
    await run();
    const result = await client.db('eduPath').collection('severities').insertOne({ severityCode });
    return {severityCode:"New Severity Code successfully posted!",result};
  } catch (error) {
    throw error;
  }
};

module.exports = { fetchSeverities, insertNewSeverity };
