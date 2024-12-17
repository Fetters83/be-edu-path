const {client,run} = require('../connection');

const getNextStudentId = async (sequenceName) => {
    try {
      //ensure connectin to mongo db client
        await run();
         //using the sequence studentId (id name) - increment the value by 1 and return
      const result = await client.db('eduPath').collection('studentIdCounters').findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { lastValue: 1 } },
        { returnDocument: 'after', upsert: true } 
      );
  
      //return the result
      return result.lastValue;
    } catch (error) {
    
      throw error;
    }
  };

  module.exports = {getNextStudentId}