const {client,run} = require('../connection');

const getNextBehaviorLogId = async (sequenceName) => {
    try {

        await run();
      const result = await client.db('eduPath').collection('behaviorLogIdCounters').findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { lastValue: 1 } },
        { returnDocument: 'after', upsert: true } 
      );
      console.log(result)
      return result.lastValue;
    } catch (error) {
      console.error("Error generating next sequence:", error);
      throw error;
    }
  };

  module.exports = {getNextBehaviorLogId}