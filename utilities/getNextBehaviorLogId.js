const {client,run} = require('../connection');

const getNextBehaviorLogId = async (sequenceName) => {
    try {

      //ensure connectin to mongo db client
        await run();
      //using the sequence behaviorLogId (id name) - increment the value by 1 and return
      const result = await client.db('eduPath').collection('behaviorLogIdCounters').findOneAndUpdate(
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

  module.exports = {getNextBehaviorLogId}