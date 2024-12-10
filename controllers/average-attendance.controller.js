const { fetchAverageAttendance, fetchLowestAttenders } = require("../models/average-attendance.model")


const getAverageAttendance = async (req,res,next)=>{

    const {yearGroup, keyStage, studentId} = req.query

 


    try {
        const data = await fetchAverageAttendance(yearGroup, keyStage, studentId)
       
        res.status(200).send({averageAttendance:data})
        
    } catch (error) {
        next(error)
    }
}

const getLowestAttenders = async (req,res,next)=>{
    
    const {academicYear,yearGroup,Class,term} = req.query

    try {
        const data = await fetchLowestAttenders(academicYear,yearGroup,Class,term)
       
        res.status(200).send(data)
        
    } catch (error) {
        next(error)
    }

   
}

module.exports = {getAverageAttendance,getLowestAttenders}