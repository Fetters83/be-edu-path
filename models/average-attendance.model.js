const { client, run } = require("../connection");


//Model for average attendance visual
const fetchAverageAttendance = async (yearGroup, keyStage, studentId) => {

  //if yearGroup is undefined and, once parsed, is not a number throw an error back to the server
  if (yearGroup && isNaN(parseInt(yearGroup))) {
    throw { status: 400, msg: "yearGroup must be of type integer." };
  }

  //if keyStage is undefined and, is not a string throw an error back to the server
  if (keyStage && typeof keyStage != "string") {
    throw { status: 400, msg: "keyStage must be of type string." };
  }

   //if studentId is undefined and, once parsed, is not a number throw an error back to the server
  if (studentId && isNaN(parseInt(studentId))) {
    throw { status: 400, msg: "Student Id is not of type number." };
  }

  //Initialise the an empty object for the filter to be used in the mongo db query
  let filter = {};

  try {
    await run();

    //If yearGroup, keyStage or studentId have been passed in the request query, append to the filter object
    if (yearGroup) {
      filter.yearGroup = parseInt(yearGroup);
    }

    if (keyStage) {
      filter.keyStage = keyStage;
    }

    if (studentId) {
      filter.studentId = parseInt(studentId);
    }

    //execute the mongo db query and assign to the variable records
    const records = await client
      .db("eduPath")
      .collection("students")
      .find(filter)
      .toArray();

     //if the no results are returned from mongo db throw an error 
    if (records.length === 0) {
      throw { status: 400, msg: "No student records found." };
    }

    //create new array collecting just the academicYear field using the stored query results
    const academicYearsArr = records.map((record) => record.academicYear);

    //if records with the field academicYear could be mapped to an array throw an error
    if (academicYearsArr.length === 0) {
      throw {
        status: 400,
        msg: "No student records found with academic year values.",
      };
    }
   
    //remove duplicate academicYears from the array and assign this to the variable academicYearUnique
    const academicYearUnique = new Set(academicYearsArr);
    //unload all the unique academicYears into a new array uniqueAcademicYearsArray
    const uniqueAcademicYearsArray = [...academicYearUnique];

    //iterate through all unique academic years - label each iteration as the variable year
    const averages = uniqueAcademicYearsArray.map((year) => {
      //on each iteration, if the academicYear passed in the request query matches the academic year in the iteration filter that record
      //assign to the variable fitleredRecords
      const filteredRecords = records.filter(
        (record) => record.academicYear === year
      );
      //iterate through all filtered records and sum up the values for all individual terms and assign to the variable attendanceValues
      const attendanceValues = filteredRecords.map(
        (record) =>
          (parseInt(record.attendance_autumnTerm) || 0) +
          (parseInt(record.attendance_springTerm) || 0) +
          (parseInt(record.attendance_summerTerm) || 0)
      );
      //iterate through the attendanceValue and to sum up the total attendance - assign to the averageAttendance vairable
      const averageAttendance = attendanceValues.reduce(
        (sum, value) => sum + value,
        0
      );
      //assign the average attendance result to the variable averageResult with 2 decimal places
      const averageResult = (averageAttendance / records.length).toFixed(2);
      //Return the result in the object which will be assigned to the first mapped variable averages
      return { academicYear: year, averageAttendance: Number(averageResult) };
    });

    //return to the server the result of the map
    return averages;
  } catch (error) {
    throw error;
  }
};

const fetchLowestAttenders = async (academicYear, yearGroup, Class, term) => {

  //store regex value against variable regex for the format YYYY/MM
  const regex = /^[0-9]{4}\/[0-9]{2}$/

  //If academicYear is not undefined but fails the regex test, throw an error back to the server
  if (academicYear && regex.test(academicYear)===false) {
      throw { status: 400, msg: "academicYear must be of type string and in the correct format." };
    }

  //if yearGroup is undefined and, once parsed, is not a number throw an error back to the server
  if (yearGroup && isNaN(parseInt(yearGroup))) {
    throw { status: 400, msg: "yearGroup must be of type integer." };
  }
  //if Class is undefined and, is not a string throw an error back to the server
  if (Class && typeof Class != "string") {
    throw { status: 400, msg: "Class must be of type string." };
  }
  //if term is undefined and, is not a string throw an error back to the server
  if (term && typeof term != "string") {
    throw { status: 400, msg: "term must be of type string." };
  }

 
  try {
    //ensure a connection to the mongo db client
    await run();

     //initialise filter for use in the mongo db query
      let filter = {};

     //If yearGroup, academicYear or Class have been passed in the request query, append to the filter object
    if (academicYear) {
      filter.academicYear = academicYear;
    }

    if (yearGroup) {
      filter.yearGroup = parseInt(yearGroup);
    }

    if (Class) {
      filter.Class = Class;
    }

   
    //If term has not been passed in the request query, perform query on all terms
    if (!term) {
      const records = await client
        .db("eduPath")
        .collection("students")
        .find(filter)
        .toArray();

      //  iterate through all records assigning each iteration to the variable record
      const averageAttendancePerStudent = records.map((record) => {
        //on each iteration assign the average attendance to the variable average to 2 decimal places
        let average = Number(
          (
            (parseInt(record.attendance_autumnTerm) +
              parseInt(record.attendance_springTerm) +
              parseInt(record.attendance_summerTerm)) /
            3
          ).toFixed(2)
        );
        //return an object out of the process on each iteration with the student id, name and average
        return {
          studentId: `${record.studentId}`,  
          student: `${record.firstName} ${record.lastName}`,
          average: average,
        };
      });

      //sort the array of objects into ascending order in terms of the average from the map
      averageAttendancePerStudent.sort((a, b) => a.average - b.average);
      //assign the first 5 objects in the array to the variable lowest5Attenders
      const lowest5Attenders = averageAttendancePerStudent.slice(0, 5);
      //return to the server the result in an object - appending the academicYear if defined and the lowest5Attenders
      return {
        AcademicYear: academicYear ? academicYear : "All Academic Years",
        lowest5Attenders,
      };

      //if term was passed as a request query perform the below operation
    } else {
      const records = await client
        .db("eduPath")
        .collection("students")
        .find(filter)
        .toArray();
 
        //iterate through all records
      const averageAttendancePerStudent = records.map((record) => {

        //assign the average of each record where the record matches the term to the variable average
        let average = Number(parseInt(record[term]));

         //return an object out of the process on each iteration with the student id, name and average
        return {
          studentId: `${record.studentId}`,  
          studentName: `${record.firstName} ${record.lastName}`,
          average: average,
        };
      });

      //sort the array of objects into ascending order in terms of the average from the map
      averageAttendancePerStudent.sort((a, b) => a.average - b.average);
        //assign the first 5 objects in the array to the variable lowest5Attenders
      const lowest5Attenders = averageAttendancePerStudent.slice(0, 5);
      //return an object out of the process on each iteration with the student id, name and average
       return {
        AcademicYear: academicYear ? academicYear : "All Academic Years",
        YearGroup: yearGroup ? yearGroup : "All Year Groups",
        ClassNumber: Class ? Class : "All Classes",
        Term: term ? term : "All terms",
        lowest5Attenders,
      };
    }
  } catch (error) {

    throw error;
  }
};

module.exports = { fetchAverageAttendance, fetchLowestAttenders };
