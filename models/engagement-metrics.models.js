const { client, run } = require('../connection');

//model for participation rate visual
const fetchParticipationRate = async (academicYear,yearGroup) => {
 
     //store regex value against variable regex for the format YYYY/MM
    const regex = /^[0-9]{4}\/[0-9]{2}$/;

    //If academicYear is not undefined but fails the regex test, throw an error back to the server
    if (academicYear && regex.test(academicYear) === false) {
      throw {
        status: 400,
        msg: "academicYear must be of type string and in the correct format.",
      };
    }
  
    //if yearGroup is undefined and, once parsed, is not a number throw an error back to the server
    if (yearGroup && isNaN(parseInt(yearGroup))) {
      throw { status: 400, msg: "yearGroup must be of type integer." };
    }
    

    try {
         //ensure a connection to the mongo db client
        await run();
        //initialise filter for use in the mongo db query
        const filter = {};
        //If yearGroup or academicYear have been passed in the request query, append to the filter object
        if (yearGroup) filter.yearGroup = parseInt(yearGroup);
        if (academicYear) filter.academicYear = academicYear;

       //retrieve all logs which meet the filter criteria
        const totalLogsCount = await client.db('eduPath').collection('behavior_logs').find(filter).toArray()
        //add to the filter primaryCategory = 'Positive Behavior'
        filter.primaryCategory="Positive Behavior"

        //retrieve all logs which meet the filter criteria - but only those with a primary cat of 'Positive Behavior'
        const positiveLogsCount = await client.db('eduPath').collection('behavior_logs').find(filter).toArray()

        //calculate the participation rate
        const participationRate = Number(((positiveLogsCount.length / totalLogsCount.length) * 100).toFixed(2))

        //return the results in an object to the server
        return {
            academicYear:academicYear?academicYear:"All Academic Years",
            yearGroup:yearGroup?yearGroup:"All Year Groups",
            totalLogs: totalLogsCount.length,
            positiveLogs: positiveLogsCount.length,
            participationRate,
        };
    } catch (error) {
       throw error;
    }
};

const fetchTimeToResolution = async () => {
    try {
        //ensure a connection to the mongo db client
        await run();
        
        // execute mongo db query on behavior_logs collection where the status is 'Resolved'
        const logs = await client.db('eduPath').collection('behavior_logs').find({
            status: "Resolved",
        }).toArray();

        //iterate through the query results and calculate the total resolution rate
        const totalResolutionTime = logs.reduce((sum, log) => {
            const resolvedDate = new Date(log.dateResolved);
            const createdDate = new Date(log.date);
            const timeToResolve = (resolvedDate - createdDate) / (1000 * 60 * 60 * 24); // Days
            return sum + timeToResolve;
        }, 0);

        //calculate the average by dividing the total resolution rate by the number of records
        const averageTimeToResolution = Number((totalResolutionTime / logs.length).toFixed(2));

        //return the result in an object
        return {
            resolvedLogs: logs.length,
            averageTimeToResolution,
        };
    } catch (error) {
       throw error;
    }
};


module.exports = { fetchParticipationRate,fetchTimeToResolution };
