const { fetchStudents, fetchStudentById, insertNewStudent, editStudent } = require("../models/students.models")

//controller to get ALL student objects from the students collection
const getStudents = async (req,res,next)=>{

    try {
        const data = await fetchStudents()
     
        res.status(200).send(data)
    } catch (error) {
        console.log(error)
    }
   


}

//controller to get student object by id from the students collection
const getStudentById = async (req,res,next)=>{

    //destructure the studentId from the request parameters
    const {studentId} = req.params

    try {
        const data = await fetchStudentById(studentId)
     
        res.status(200).send(data)
    } catch (error) {
       next(error)
    }
   
}

//controller to post a new student to the students collection
 const postNewStudent = async (req,res,next)=>{

//destructure new student object from the request body to be used in the model
const newStudentObj = req.body

            try {

                const data  = await insertNewStudent(newStudentObj)
                res.status(200).send(data)
                            
            } catch (error) {
                next(error)
            }

}

//controller to update/patch a student object in the students collection
const updateStudent = async(req,res,next)=>{

    //destructure updated student object from the request body
    const updatedStudentObj = req.body
     //destructure the studentId from the request parameters
    const {studentId} = req.params

    try {

        const data = await editStudent(updatedStudentObj,studentId)
        res.status(200).send(data)
        
    } catch (error) {
        next(error)
    }
}

module.exports = {getStudents,getStudentById,postNewStudent,updateStudent}