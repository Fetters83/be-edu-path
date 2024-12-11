const { fetchStudents, fetchStudentById, insertNewStudent, editStudent } = require("../models/students.models")


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

            try {

                const data  = await insertNewStudent(newStudentObj)
                res.status(200).send(data)
                            
            } catch (error) {
                next(error)
            }

}

const updateStudent = async(req,res,next)=>{

    const updatedStudentObj = req.body
    const {studentId} = req.params

    try {

        const data = await editStudent(updatedStudentObj,studentId)
        res.status(200).send(data)
        
    } catch (error) {
        next(error)
    }
}

module.exports = {getStudents,getStudentById,postNewStudent,updateStudent}