const { client, run } = require("../connection");

const fetchAverageAttendance = async (yearGroup, keyStage, studentId) => {
  if (yearGroup && isNaN(parseInt(yearGroup))) {
    throw { status: 400, msg: "yearGroup must be of type integer." };
  }

  if (keyStage && typeof keyStage != "string") {
    throw { status: 400, msg: "keyStage must be of type string." };
  }

  if (studentId && isNaN(parseInt(studentId))) {
    throw { status: 400, msg: "Student Id is not of type number." };
  }

  let filter = {};

  try {
    await run();

    if (yearGroup) {
      filter.yearGroup = parseInt(yearGroup);
    }

    if (keyStage) {
      filter.keyStage = keyStage;
    }

    if (studentId) {
      filter.studentId = parseInt(studentId);
    }

    const records = await client
      .db("eduPath")
      .collection("students")
      .find(filter)
      .toArray();

    if (records.length === 0) {
      throw { status: 400, msg: "No student records found." };
    }

    const accademicYearsArr = records.map((record) => record.accademicYear);

    if (accademicYearsArr.length === 0) {
      throw {
        status: 400,
        msg: "No student records found with accademic year values.",
      };
    }
    //create unique values with set
    const accademicYearUnique = new Set(accademicYearsArr);
    const uniqueAccademicYearsArray = [...accademicYearUnique];

    const averages = uniqueAccademicYearsArray.map((year) => {
      const filteredRecords = records.filter(
        (record) => record.accademicYear === year
      );
      const attendanceValues = filteredRecords.map(
        (record) =>
          (parseInt(record.attendance_autumnTerm) || 0) +
          (parseInt(record.attendance_springTerm) || 0) +
          (parseInt(record.attendance_summerTerm) || 0)
      );
      const averageAttendance = attendanceValues.reduce(
        (sum, value) => sum + value,
        0
      );
      const averageResult = (averageAttendance / records.length).toFixed(2);
      return { academicYear: year, averageAttendance: Number(averageResult) };
    });

    return averages;
  } catch (error) {
    throw error;
  }
};

const fetchLowestAttenders = async (accademicYear, yearGroup, Class, term) => {
  if (accademicYear && typeof accademicYear != "string") {
    throw { status: 400, msg: "accademicYear must be of type string." };
  }

  if (yearGroup && isNaN(parseInt(yearGroup))) {
    throw { status: 400, msg: "yearGroup must be of type integer." };
  }

  if (Class && typeof Class != "string") {
    throw { status: 400, msg: "Class must be of type string." };
  }

  if (term && typeof term != "string") {
    throw { status: 400, msg: "term must be of type string." };
  }

  let filter = {};
  try {
    await run();

    if (accademicYear) {
      filter.accademicYear = accademicYear;
    }

    if (yearGroup) {
      filter.yearGroup = parseInt(yearGroup);
    }

    if (Class) {
      filter.Class = Class;
    }

   

    if (!term) {
      const records = await client
        .db("eduPath")
        .collection("students")
        .find(filter)
        .toArray();

      const averageAttendancePerStudent = records.map((record) => {
        let average = Number(
          (
            (parseInt(record.attendance_autumnTerm) +
              parseInt(record.attendance_springTerm) +
              parseInt(record.attendance_summerTerm)) /
            3
          ).toFixed(2)
        );
        return {
          studentId: `${record.studentId}`,  
          student: `${record.firstName} ${record.lastName}`,
          average: average,
        };
      });
      averageAttendancePerStudent.sort((a, b) => a.average - b.average);
      const lowest5Attenders = averageAttendancePerStudent.slice(0, 5);

      return {
        AcademicYear: accademicYear ? accademicYear : "All Academic Years",
        lowest5Attenders,
      };
    } else {
      const records = await client
        .db("eduPath")
        .collection("students")
        .find(filter)
        .toArray();
 
      const averageAttendancePerStudent = records.map((record) => {
        let average = Number(parseInt(record[term]));
        
        return {
          studentId: `${record.studentId}`,  
          studentName: `${record.firstName} ${record.lastName}`,
          average: average,
        };
      });

      averageAttendancePerStudent.sort((a, b) => a.average - b.average);
      const lowest5Attenders = averageAttendancePerStudent.slice(0, 5);

      console.log({
        AcademicYear: accademicYear ? accademicYear : "All Academic Years",
        YearGroup: yearGroup ? yearGroup : "All Year Groups",
        ClassNumber: Class ? Class : "All Classes",
        Term: term ? term : "All terms",
        lowest5Attenders,
      })

      return {
        AcademicYear: accademicYear ? accademicYear : "All Academic Years",
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
