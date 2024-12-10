const { fetchKS1GradeCount, fetchKS2GradeCount, fetchKS1GradeCountYearOnYear, fetchKS2GradeCountYearOnYear } = require("../models/grade-distrubtion.models")


const getKS1GradeCount = async (req,res,next)=>{

    const {academicYear,yearGroup} = req.query

    try {

        const data = await fetchKS1GradeCount(academicYear,yearGroup)
        res.status(200).send(data)
        
    } catch (error) {
        next(error)
    }


}

const getKS2GradeCount = async (req,res,next)=>{

    const {academicYear} = req.query
   

    try {

        const data = await fetchKS2GradeCount(academicYear)
        res.status(200).send(data)
        
    } catch (error) {
        next(error)
    }


}

const getKS1GradeCountYearOnYear = async (req,res,next)=>{

    const {yearGroup} = req.query

    try {

        const data = await fetchKS1GradeCountYearOnYear(yearGroup)
        res.status(200).send(data)
        
    } catch (error) {
        next(error)
    }


}


const getKS2GradeCountYearOnYear = async (req,res,next)=>{

        try {
          
        const data = await fetchKS2GradeCountYearOnYear()
        res.status(200).send(data)
        
    } catch (error) {
        next(error)
    }


}

module.exports = {getKS1GradeCount, getKS2GradeCount,getKS1GradeCountYearOnYear,getKS2GradeCountYearOnYear }

