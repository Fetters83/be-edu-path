const { fetchStudents, fetchStudentById, insertNewStudent } = require("../models/students.models")


const getStudents = async (req,res,next)=>{

    try {
        const data = await fetchStudents()
     
        res.status(200).send(data)
    } catch (error) {
        console.log(error)
    }
   


}

const getStudentById = async (req,res,next)=>{

    const {studentId} = req.params

    try {
        const data = await fetchStudentById(studentId)
     
        res.status(200).send(data)
    } catch (error) {
       next(error)
    }
   
}
 const postNewStudent = async (req,res,next)=>{



const newStudentObj = req.body


   /* const {academicYear,
        	firstName,
            lastName,
            dateOfBirth,
            yearGroup,
            Class,
            keyStage,
            phonicsCheckResult,
            ks1ReadingScore,
            ks1ReadingGrade,
            ks1MathsScore,
            ks1MathsGrade,
            ks1GPSScore,
            ks1GPSGrade,
            readingScore,
            readingGrade,
            mathsScore,
            mathsGrade,
            gpsScore,
            gpsGrade,
            writingScore,
            writingGrade,
            scienceScore,
            scienceGrade,
            mtcScore,
            attendance_autumnTerm,
            attendance_springTerm,
            attendance_summerTerm,
            parentContactName,
            parentContactEmail,
            parentContactPhone
            } = req.body    */

            try {

                const data  = await insertNewStudent(newStudentObj)
                res.status(200).send(data)
              /*  const data  = await insertNewStudent(academicYear,
                firstName,
                lastName,
                dateOfBirth,
                yearGroup,
                Class,
                keyStage,
                phonicsCheckResult,
                ks1ReadingScore,
                ks1ReadingGrade,
                ks1MathsScore,
                ks1MathsGrade,
                ks1GPSScore,
                ks1GPSGrade,
                readingScore,
                readingGrade,
                mathsScore,
                mathsGrade,
                gpsScore,
                gpsGrade,
                writingScore,
                writingGrade,
                scienceScore,
                scienceGrade,
                mtcScore,
                attendance_autumnTerm,
                attendance_springTerm,
                attendance_summerTerm,
                parentContactName,
                parentContactEmail,
                parentContactPhone);
               res.status(200).send(data) */
                
            } catch (error) {
                next(error)
            }

}

module.exports = {getStudents,getStudentById,postNewStudent}