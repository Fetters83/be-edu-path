const { fetchSuggestions, fetchSuggestionsByStudentId, insertNewSuggestion, modifyFollowUpRequired } = require("../models/suggestions.models")


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



const postNewSuggestion = async (req, res, next) => {
  const newSuggestion = req.body;


  try {
    const data = await insertNewSuggestion(newSuggestion);
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

const updateFollowUpRequired = async (req, res, next) => {
    const { suggestionId } = req.params;
    const { followUpRequired } = req.body;

    try {
      if (!['Yes', 'No'].includes(followUpRequired)) {
        throw { status: 400, msg: 'followUpRequired must be either "Yes" or "No".' };
      }
  
      const result = await modifyFollowUpRequired(suggestionId, followUpRequired);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };


module.exports = {getSuggestions,getSuggestionsByStudentId,postNewSuggestion,updateFollowUpRequired}