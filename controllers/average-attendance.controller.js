const { fetchAverageAttendance, fetchLowestAttenders } = require("../models/average-attendance.model")

//controller for average attendance visual
const getAverageAttendance = async (req,res,next)=>{

    //destrucuture yearGroup, keyStage and studentId from request query for variables to be used in the model
    const {yearGroup, keyStage, studentId} = req.query

    try {
        const data = await fetchAverageAttendance(yearGroup, keyStage, studentId)
       
        res.status(200).send({averageAttendance:data})
        
    } catch (error) {   
        next(error)
    }
}

//controller for lowest attenders visual
const getLowestAttenders = async (req,res,next)=>{
    
    //destrucutre academicYear, yearGroup, Class and term from request query for variables to be used in the model
    const {academicYear,yearGroup,Class,term} = req.query

    try {
        const data = await fetchLowestAttenders(academicYear,yearGroup,Class,term)
       
        res.status(200).send(data)
        
    } catch (error) {
        next(error)
    }

   
}

module.exports = {getAverageAttendance,getLowestAttenders}