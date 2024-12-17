const { fetchSuggestions, fetchSuggestionsByStudentId, insertNewSuggestion, modifyFollowUpRequired } = require("../models/suggestions.models")


//controller for getting ALL suggestions from the suggestions collection
const getSuggestions = async (req,res,next)=>{

    try {
        const data = await fetchSuggestions()
        res.status(200).send(data)
    } catch (error) {
        console.log(error)
    }
    
}

//controller for getting suggestions by student id from the suggestions collection
const getSuggestionsByStudentId = async (req,res,next)=>{

    //destructure the student id from the request parameters to be used in the model
    const {studentId} = req.params

    try {
        const data = await fetchSuggestionsByStudentId(studentId)
     
        res.status(200).send(data)
    } catch (error) {
       next(error)
    }
   


}


//controller for posting a new suggestion object
const postNewSuggestion = async (req, res, next) => {

  //destructure the new suggestion object from the request body
  const newSuggestion = req.body;


  try {
    const data = await insertNewSuggestion(newSuggestion);
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

// controller for updating the follupRequired field in the suggestions collection (and updating the behavior_log collection resolved date and status)
const updateFollowUpRequired = async (req, res, next) => {

    //destructre the suggestionID value from the request parameters to be used in the model
    const { suggestionId } = req.params;
    //destrcture the followUpRequired information from the request body to be used in the model
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