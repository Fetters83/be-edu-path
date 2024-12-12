const {client,run} = require('../connection');

const getNextStudentId = async (sequenceName) => {
    try {

        await run();
      const result = await client.db('eduPath').collection('studentIdCounters').findOneAndUpdate(
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

  module.exports = {getNextStudentId}