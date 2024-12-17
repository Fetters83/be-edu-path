const { client, run } = require("../connection");

const fetchIncidentRate = async (
  yearGroup,
  academicYear,
  primaryCategory,
  severity,
  status
) => {
  /store regex value against variable regex for the format YYYY/MM
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
//if Primary Category is undefined and, is not a string throw an error back to the server
  if (primaryCategory && typeof primaryCategory != "string") {
    throw { status: 400, msg: "primaryCategory must be of type string." };
  }

  //if severity is undefined and, is not a string throw an error back to the server
  if (severity && typeof severity != "string") {
    throw { status: 400, msg: "severity must be of type string." };
  }
//if status is undefined and, is not a string throw an error back to the server
  if (status && typeof status != "string") {
    throw { status: 400, msg: "status must be of type string." };
  }

  try {
    await run(); 

    //initialise filter for use in the mongo db query
    const filter = {};
    //If yearGroup, academicYear Primary Category, severity or status have been passed in the request query, append to the filter object
    if (yearGroup) filter.yearGroup = parseInt(yearGroup);
    if (academicYear) filter.academicYear = academicYear;
    if (primaryCategory) filter.primaryCategory = primaryCategory;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;

   

    // Use mongo db's aggregation function to calculate the incident rates
    const records = await client
      .db("eduPath")
      .collection("behavior_logs")
      .aggregate([
        //apply the filter
        { $match: filter }, 
        {
          //Group the result based on the below parameters
          $group: {
            _id: {
              academicYear: "$academicYear", 
              yearGroup: "$yearGroup",
              severity: "$severity",
              primaryCategory: "$primaryCategory",
            },
            //Use the sum function increment the number of records
            incidentCount: { $sum: 1 }, 
          },
        },
        {
          //display/return the below object 
          $project: {
            academicYear: "$_id.academicYear",
            yearGroup: "$_id.yearGroup",
            severity: "$_id.severity",
            primaryCategory: "$_id.primaryCategory",
            incidentCount: 1,
            _id: 0, 
          },
        },
      ])
      .toArray();

      //return the records to the server
    return records;

  } catch (error) {
     throw error;
  }
};

const fetchResolutionRate = async (academicYear, yearGroup) => {
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
    const filter = { status: "Pending" };
    //If yearGroup or academicYear have been passed in the request query, append to the filter object
    if (yearGroup) filter.yearGroup = parseInt(yearGroup);
    if (academicYear) filter.academicYear = academicYear;

    //get all behavior logs from the behavior_logs collection
    const allRecords = await client
      .db("eduPath")
      .collection("behavior_logs")
      .find()
      .toArray();
       //get all behavior logs from the behavior_logs collection appying the filter
    const records = await client
      .db("eduPath")
      .collection("behavior_logs")
      .find(filter)
      .toArray();

      //calculate the resolution rate by dividing the number of all records against the number of records that are pending
    const resolutionRate = Number(
      ((records.length / allRecords.length) * 100).toFixed(2)
    );
    //return the result to the server
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
    let filter = {};
    //If yearGroup or Class have been passed in the request query, append to the filter object
    if (yearGroup) filter.yearGroup = parseInt(yearGroup);
    if (academicYear) filter.academicYear = academicYear;
 
    
       // Use mongo db's aggregation function to calculate the incident rates
        const records = await client.db('eduPath').collection('behavior_logs').aggregate([
            //apply the filter
            { $match: filter}, 
            {
              //Group the result based on the below parameters
              $group: {
                _id: {
                  academicYear: "$academicYear", 
                  yearGroup: "$yearGroup",
                  subcategory: "$subcategory",
                },
                //Use the sum function increment the number of records
                incidentCount: { $sum: 1 }, 
              },
            },
            {
               //display/return the below object 
              $project: {
                academicYear: "$_id.academicYear",
                yearGroup: "$_id.yearGroup",
                subcategory: "$_id.subcategory",
                incidentCount: 1,
                _id: 0, 
              },
            },
          ])
          .toArray();

          //sort the results into ascending order
          records.sort((b, a) => a.incidentCount - b.incidentCount);
          //assign the first 5 results to the results variable
          const results = records.slice(0,5)

           //return the result to the server
          return {AcademicYear:academicYear?academicYear:"All Academic Years",
            yearGroup:yearGroup? yearGroup:"All Year Groups",
            results}

       
    } catch (error) {
      console.log(error)
        throw error
    }


};
module.exports = {
  fetchIncidentRate,
  fetchResolutionRate,
  fetchTop5BehaviorIncidents,
};
