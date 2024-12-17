const { fetchKS1GradeCount, fetchKS2GradeCount, fetchKS1GradeCountYearOnYear, fetchKS2GradeCountYearOnYear } = require("../models/grade-distrubtion.models")

//controller for for KS1 grades visual
const getKS1GradeCount = async (req,res,next)=>{

    //destructure yearGroup and academicYear from the request query for variables to be used in the model
    const {academicYear,yearGroup} = req.query

    try {

        const data = await fetchKS1GradeCount(academicYear,yearGroup)
        res.status(200).send(data)
        
    } catch (error) {
        next(error)
    }


}

//controller for for KS2 grades visual
const getKS2GradeCount = async (req,res,next)=>{

     //destructure academicYear from the request query for variables to be used in the model
    const {academicYear} = req.query
   

    try {

        const data = await fetchKS2GradeCount(academicYear)
        res.status(200).send(data)
        
    } catch (error) {
        next(error)
    }


}

//controller for for KS1 grade count year on year visual
const getKS1GradeCountYearOnYear = async (req,res,next)=>{

    //destructure academicYear from the request query for variables to be used in the model
    const {yearGroup} = req.query

    try {

        const data = await fetchKS1GradeCountYearOnYear(yearGroup)
        res.status(200).send(data)
        
    } catch (error) {
        next(error)
    }


}

//controller for for KS2 grade count year on year visual
const getKS2GradeCountYearOnYear = async (req,res,next)=>{

        try {
          
        const data = await fetchKS2GradeCountYearOnYear()
        res.status(200).send(data)
        
    } catch (error) {
        next(error)
    }


}

module.exports = {getKS1GradeCount, getKS2GradeCount,getKS1GradeCountYearOnYear,getKS2GradeCountYearOnYear }

