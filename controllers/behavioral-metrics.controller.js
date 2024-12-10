const { fetchIncidentRate, fetchResolutionRate } = require("../models/behavioral-metrics.models")

const getIncidentRate = async (req,res,next) =>{

    const {yearGroup,academicYear,primaryCategory,severity,status} = req.query

    try {
        
        const data = await fetchIncidentRate(yearGroup,academicYear,primaryCategory,severity,status)
        res.status(200).send(data)
    } catch (error) {
        next(error)
    }


}

const getResolutionRate = async(req,res,next) =>{

    const {academicYear,yearGroup} = req.query

    try {
        
        const data = await fetchResolutionRate(academicYear,yearGroup)
        res.status(200).send(data)

    } catch (error) {
        next(error)
    }


}

module.exports = {getIncidentRate,getResolutionRate}