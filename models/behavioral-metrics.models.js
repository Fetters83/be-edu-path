const { client, run } = require("../connection");

const fetchIncidentRate = async (
  yearGroup,
  academicYear,
  primaryCategory,
  severity,
  status
) => {
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

  if (primaryCategory && typeof primaryCategory != "string") {
    throw { status: 400, msg: "primaryCategory must be of type string." };
  }

  if (severity && typeof severity != "string") {
    throw { status: 400, msg: "severity must be of type string." };
  }

  if (status && typeof status != "string") {
    throw { status: 400, msg: "status must be of type string." };
  }

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
    const records = await client
      .db("eduPath")
      .collection("behavior_logs")
      .aggregate([
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
      ])
      .toArray();

    return records;
  } catch (error) {
    console.error("Error in fetchIncidentRate:", error);
    throw error;
  }
};

const fetchResolutionRate = async (academicYear, yearGroup) => {
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

    const filter = { status: "Pending" };
    if (yearGroup) filter.yearGroup = parseInt(yearGroup);
    if (academicYear) filter.academicYear = academicYear;

    const allRecords = await client
      .db("eduPath")
      .collection("behavior_logs")
      .find()
      .toArray();
    const records = await client
      .db("eduPath")
      .collection("behavior_logs")
      .find(filter)
      .toArray();

    const resolutionRate = Number(
      ((records.length / allRecords.length) * 100).toFixed(2)
    );

    return {
      AcademicYear: academicYear ? academicYear : "All Academic Years",
      yearGroup: yearGroup ? yearGroup : "All Year Groups",
      resolutionRate,
    };
  } catch (error) {
    throw error;
  }
};

const fetchTop5BehaviorIncidents = async (academicYear, yearGroup) => {

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

    if(Class && typeof Class !='string'){
        throw { status: 400, msg: "Class must be of type integer." };
    }

    try {
        await run(); // Ensure the MongoDB client is connected

    // Build the filter object based on the query parameters
    const filter = {};
    if (yearGroup) filter.yearGroup = parseInt(yearGroup);
    if (academicYear) filter.academicYear = academicYear;

    
        
        const records = await client.db('eduPath').collection('behavior_logs').aggregate([

            { $match: filter }, // Apply the filter
            {
              $group: {
                _id: {
                  academicYear: "$accademicYear", // Adjust this field based on how your data stores term info
                  yearGroup: "$yearGroup",
                  subcategory: "$subcategory",
                },
                incidentCount: { $sum: 1 }, // Count the number of logs
              },
            },
            {
              $project: {
                academicYear: "$_id.academicYear",
                yearGroup: "$_id.yearGroup",
                subcategory: "$_id.subcategory",
                incidentCount: 1,
                _id: 0, // Exclude the internal MongoDB `_id` field
              },
            },
          ])
          .toArray();

          records.sort((b, a) => a.incidentCount - b.incidentCount);
          const results = records.slice(0,5)

          return {AcademicYear:academicYear?academicYear:"All Academic Years",
            yearGroup:yearGroup? yearGroup:"All Year Groups",
            Class:Class?Class:"All Classes",
            results}

       
    } catch (error) {
        throw error
    }


};
module.exports = {
  fetchIncidentRate,
  fetchResolutionRate,
  fetchTop5BehaviorIncidents,
};
