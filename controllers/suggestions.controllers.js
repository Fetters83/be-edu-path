const { fetchBehaviorLogsByStudentId } = require("../models/behaviour-logs.models")
const { fetchSuggestions, fetchSuggestionsByStudentId } = require("../models/suggestions.models")


const getSuggestions = async (req,res,next)=>{

    try {
        const data = await fetchSuggestions()
        res.status(200).send(data)
    } catch (error) {
        console.log(error)
    }
    
}

const getSuggestionsByStudentId = async (req,res,next)=>{

    const {studentId} = req.params

    try {
        const data = await fetchSuggestionsByStudentId(studentId)
     
        res.status(200).send(data)
    } catch (error) {
       next(error)
    }
   


}

module.exports = {getSuggestions,getSuggestionsByStudentId}