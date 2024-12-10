const {client,run} = require('../connection')

const fetchIncidentRate = async(yearGroup,academicYear,primaryCategory,severity,status)=>{

    try {
        await run(); // Ensure the MongoDB client is connected

        // Build the filter object based on the query parameters
        const filter = {};
        if (yearGroup) filter.yearGroup = parseInt(yearGroup);
        if (academicYear) filter.academicYear = academicYear;
        if (primaryCategory) filter.primaryCategory = primaryCategory;
        if (severity) filter.severity = severity;
        if (status) filter.status = status;

        console.log("Filter being applied:", filter);

        // Use aggregation to calculate incident rates
        const records = await client.db('eduPath').collection('behavior_logs').aggregate([
            { $match: filter }, // Apply the filter
            {
                $group: {
                    _id: {
                        academicYear: "$academicYear", // Adjust this field based on how your data stores term info
                        yearGroup: "$yearGroup",
                        severity: "$severity",
                        primaryCategory: "$primaryCategory",
                    },
                    incidentCount: { $sum: 1 }, // Count the number of logs
                },
            },
            {
                $project: {
                    academicYear: "$_id.academicYear",
                    yearGroup: "$_id.yearGroup",
                    severity: "$_id.severity",
                    primaryCategory: "$_id.primaryCategory",
                    incidentCount: 1,
                    _id: 0, // Exclude the internal MongoDB `_id` field
                },
            },
        ]).toArray();

        return records;
    } catch (error) {
        console.error("Error in fetchIncidentRate:", error);
        throw error;
    }

}

module.exports = {fetchIncidentRate}