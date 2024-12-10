const { client, run } = require('../connection');

const fetchParticipationRate = async (academicYear,yearGroup) => {
 
    const regex = /^[0-9]{4}\/[0-9]{2}$/;

    if (academicYear && regex.test(academicYear) === false) {
      throw {
        status: 400,
        msg: "academicYear must be of type string and in the correct format.",
      };
    }
  
    if (yearGroup && isNaN(parseInt(yearGroup))) {
      throw { status: 400, msg: "yearGroup must be of type integer." };
    }
    
    try {
        await run();
        const filter = {};
        if (yearGroup) filter.yearGroup = parseInt(yearGroup);
        if (academicYear) filter.academicYear = academicYear;

        // Total logs
        const totalLogsCount = await client.db('eduPath').collection('behavior_logs').find(filter).toArray()
        filter.primaryCategory="Positive Behavior"

        // Positive behavior logs (e.g., Leadership, Helping Others)
        const positiveLogsCount = await client.db('eduPath').collection('behavior_logs').find(filter).toArray()

        const participationRate = Number(((positiveLogsCount.length / totalLogsCount.length) * 100).toFixed(2))

        return {
            academicYear:academicYear?academicYear:"All Accademic Years",
            yearGroup:yearGroup?yearGroup:"All Year Groups",
            totalLogs: totalLogsCount.length,
            positiveLogs: positiveLogsCount.length,
            participationRate,
        };
    } catch (error) {
        console.error("Error in fetchParticipationRate:", error);
        throw error;
    }
};




module.exports = { fetchParticipationRate };
