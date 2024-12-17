const { client, run } = require("../connection");
const { getNextStudentId } = require("../utilities/getNextStudentId");
const { transformNewStudent } = require("../utilities/transformNewStudent");

//model to fetch all students
const fetchStudents = async () => {
  try {
    //ensure a connection to the mongo db client
    await run();
    //execute the mongo db query to fetch all students
    const records = await client
      .db("eduPath")
      .collection("students")
      .find()
      .toArray();
      //return the result to the server
    return records;
  } catch (error) {
    throw error;
  }
};

//model to fetch student by id
const fetchStudentById = async (studentId) => {

  //if student id, once parsed, is not a number throw an error back to the server
  if (isNaN(parseInt(studentId))) {
    throw { status: 400, msg: "Student Id is not of type number." };
  }

  try {
     //ensure a connection to the mongo db client
    await run();
    //execute mongo db query and store against record variable
    const record = await client
      .db("eduPath")
      .collection("students")
      .findOne({ studentId: parseInt(studentId) });

    // if no record found throw an error
    if (!record) {
      throw { status: 404, msg: "Student Id not found." };
    }

    //return record to the server
    return record;
  } catch (error) {
    throw error;
  }
};

//model to insert new student object into the students collection
const insertNewStudent = async (newStudentObj) => {

  try {

    //call the function checkNewStudentValidity passing in the newStudent Object
    checkNewStudentValidity(newStudentObj)
    //ensure a connection to the mongo db client
    await run();
    //pass newStudentObj into the function transforNewStudent
    const transformedStudent = transformNewStudent(newStudentObj);
    //retrieve the last used id from the studentCounters collection and store against the variable lastId
    const lastId = await getNextStudentId("studentId");

    //append the new student id and the trasnformed object into a new object
    const newStudent = { studentId: lastId, ...transformedStudent };

    //execute the mongo db insert query
    const result = await client
      .db("eduPath")
      .collection("students")
      .insertOne(newStudent);
    //return the result to the server
    return newStudent;
  } catch (error) {
      throw error;
  }
};

//model to update student
const editStudent = async (updatedStudentObj, studentId) => {
    try {
      //fetch student by id to ensure the student exists
      const existingStudent = await fetchStudentById(studentId);
      // transform the updated student object
      const transformedStudent = transformNewStudent(updatedStudentObj);
      //merge the existing student with the trasnformed student object against variable updatedStudent
      const updatedStudent = { ...existingStudent, ...transformedStudent };
  
      // run the updatedStudent object against the checkNewStudentValidity function
      checkNewStudentValidity(updatedStudent);
  
    //execute the mongo db query to update a student object and set the value to the updatedStudentObj
      const result = await client.db('eduPath').collection('students').updateOne(
        { studentId: parseInt(studentId) }, 
        { $set: updatedStudentObj } // 
      );
      
      //if the student id was not able to update throw an error
      if (result.matchedCount === 0) {
        throw { status: 404, msg: "Student not found or update failed." };
      }
  
      //return the result in an object to the server
      return { studentId: parseInt(studentId), ...updatedStudentObj };
    } catch (error) {
       throw error;
    }
  };
  

const checkNewStudentValidity = (newStudentObj)=>{

  //check that object keys exist and are of the correct data type for transformation later

    if (!newStudentObj.academicYear) {
        throw { status: 404, msg: "Object is missing an academicYear key." };
    }
    if (typeof newStudentObj.academicYear !== 'string' || newStudentObj.academicYear === '' || !/\d{4}\/\d{2}/.test(newStudentObj.academicYear)) {
        throw { status: 400, msg: "academicYear must be a non-empty string in the format YYYY/YY." };
    }
    if (!newStudentObj.firstName) {
        throw { status: 404, msg: "Object is missing a firstName key." };
    }
    if (typeof newStudentObj.firstName !== 'string' || newStudentObj.firstName === '') {
        throw { status: 400, msg: "firstName must be a non-empty string." };
    }
    if (!newStudentObj.lastName) {
        throw { status: 404, msg: "Object is missing a lastName key." };
    }
    if (typeof newStudentObj.lastName !== 'string' || newStudentObj.lastName === '') {
        throw { status: 400, msg: "lastName must be a non-empty string." };
    }
    if (!newStudentObj.dateOfBirth) {
        throw { status: 404, msg: "Object is missing a dateOfBirth key." };
    }
    if (typeof newStudentObj.dateOfBirth !== 'string' || (newStudentObj.dateOfBirth !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(newStudentObj.dateOfBirth))) {
        throw { status: 400, msg: "dateOfBirth must be a string in the format yyyy-mm-dd or an empty string." };
    }
    if (!newStudentObj.yearGroup) {
        throw { status: 404, msg: "Object is missing a yearGroup key." };
    }
    if (isNaN(parseInt(newStudentObj.yearGroup)) || parseInt(newStudentObj.yearGroup) < 1 || parseInt(newStudentObj.yearGroup) > 6) {
        throw { status: 400, msg: "yearGroup must be a number between 1 and 6." };
    }
    if (!newStudentObj.Class) {
        throw { status: 404, msg: "Object is missing a Class key." };
    }
    if (typeof newStudentObj.Class !== 'string' || !/^[1-6][AB]$/.test(newStudentObj.Class)) {
        throw { status: 400, msg: "Class must be a string matching 1A, 1B, ... 6A, 6B." };
    }
    if (!newStudentObj.keyStage) {
        throw { status: 404, msg: "Object is missing a keyStage key." };
    }
    if (typeof newStudentObj.keyStage !== 'string' || !['KS1', 'KS2'].includes(newStudentObj.keyStage)) {
        throw { status: 400, msg: "keyStage must be a string and either KS1 or KS2." };
    }
    if (!newStudentObj.phonicsCheckResult) {
        throw { status: 404, msg: "Object is missing a phonicsCheckResult key." };
    }
    if (typeof newStudentObj.phonicsCheckResult !== 'string' || (newStudentObj.phonicsCheckResult !== '' && !['BES', 'WES'].includes(newStudentObj.phonicsCheckResult))) {
        throw { status: 400, msg: "phonicsCheckResult must be a string and either BES, WES, or empty." };
    }
    
    if (!newStudentObj.parentContactName) {
        throw { status: 404, msg: "Object is missing a parentContactName key." };
    }
    if (typeof newStudentObj.parentContactName !== 'string' || newStudentObj.parentContactName === '') {
        throw { status: 400, msg: "parentContactName must be a non-empty string." };
    }
    if (!newStudentObj.parentContactEmail) {
        throw { status: 404, msg: "Object is missing a parentContactEmail key." };
    }
    if (typeof newStudentObj.parentContactEmail !== 'string') {
        throw { status: 400, msg: "parentContactEmail must be a string." };
    }
    if (!newStudentObj.parentContactPhone) {
        throw { status: 404, msg: "Object is missing a parentContactPhone key." };
    }
    if (typeof newStudentObj.parentContactPhone !== 'string') {
        throw { status: 400, msg: "parentContactPhone must be a string." };
    }
    return true;
}

module.exports = { fetchStudents, fetchStudentById, insertNewStudent,editStudent};
