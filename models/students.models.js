const { client, run } = require("../connection");
const { getNextStudentId } = require("../utilities/getNextStudentId");
const { transformNewStudent } = require("../utilities/transformNewStudent");

const fetchStudents = async () => {
  try {
    await run();
    const records = await client
      .db("eduPath")
      .collection("students")
      .find()
      .toArray();
    return records;
  } catch (error) {
    throw error;
  }
};

const fetchStudentById = async (studentId) => {
  if (isNaN(parseInt(studentId))) {
    throw { status: 400, msg: "Student Id is not of type number." };
  }

  try {
    await run();
    const record = await client
      .db("eduPath")
      .collection("students")
      .findOne({ studentId: parseInt(studentId) });

    if (!record) {
      throw { status: 404, msg: "Student Id not found." };
    }

    return record;
  } catch (error) {
    throw error;
  }
};

const insertNewStudent = async (newStudentObj) => {

  try {

    checkNewStudentValidity(newStudentObj)
    await run();
    const transformedStudent = transformNewStudent(newStudentObj);
    const lastId = await getNextStudentId("studentId");

    const newStudent = { studentId: lastId, ...transformedStudent };

    const result = await client
      .db("eduPath")
      .collection("students")
      .insertOne(newStudent);
    console.log("New Student successfully posted!: ", result);
    return newStudent;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const checkNewStudentValidity = (newStudentObj)=>{

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

module.exports = { fetchStudents, fetchStudentById, insertNewStudent };
