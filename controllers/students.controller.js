const { fetchStudents, fetchStudentById } = require("../models/students.models")


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

module.exports = {getStudents,getStudentById}