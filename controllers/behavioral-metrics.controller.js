const { fetchIncidentRate, fetchResolutionRate, fetchTop5BehaviorIncidents } = require("../models/behavioral-metrics.models")

//controller for incident rate visual
const getIncidentRate = async (req,res,next) =>{

      //destrucuture yearGroup, academicYear, primaryCategory,severity and status from request query for variables to be used in the model
    const {yearGroup,academicYear,primaryCategory,severity,status} = req.query

    try {
        
        const data = await fetchIncidentRate(yearGroup,academicYear,primaryCategory,severity,status)
        res.status(200).send(data)
    } catch (error) {
        next(error)
    }


}

//controller for resolution rate visual
const getResolutionRate = async(req,res,next) =>{

    //destrucuture yearGroup and academicYear from the request query for variables to be used in the model
    const {academicYear,yearGroup} = req.query

    try {
        
        const data = await fetchResolutionRate(academicYear,yearGroup)
        res.status(200).send(data)

    } catch (error) {
        next(error)
    }


}

//controller for top 5 behavior incidents
const getTop5BehaviorIncidents= async(req,res,next) =>{

       //destrucuture yearGroup and academicYear from the request query for variables to be used in the model
    const {academicYear,yearGroup} = req.query

    try {
        
        const data = await fetchTop5BehaviorIncidents(academicYear,yearGroup)
        res.status(200).send(data)
    } catch (error) {
        next(error)
    }

}

module.exports = {getIncidentRate,getResolutionRate,getTop5BehaviorIncidents}