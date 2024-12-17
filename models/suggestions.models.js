const {client,run} = require('../connection');
const { getNextSuggestionId } = require('../utilities/getNextSuggestionId');
const { transformNewSuggestion } = require('../utilities/transformNewSuggestion');
const { fetchBehaviorLogs } = require('./behaviour-logs.models');

const { fetchStudentById } = require('./students.models');


//model to fetch all suggestions from the suggestions collection
const fetchSuggestions = async ()=>{

    try {
       //ensure a connection to the mongo db client
        await run();
        //execute mongo db query and store results against the variable records
        const records = await client.db('eduPath').collection('suggestions').find().toArray();
        //return the records to the server
        return records
    } catch (error) {
        throw error;
    }
   
}

//model to fetch suggestions by student id
const fetchSuggestionsByStudentId = async (studentId)=>{

     //if student id, once parsed, is not a number throw an error back to the server
    if(isNaN(parseInt(studentId))){
       
        throw ({status:400,msg:"Student Id is not of type number."})
    }

    try {
      //ensure a connection to the mongo db client
        await run();
        //execute mongo db query and store results against the variable records
        const records = await client.db('eduPath').collection('suggestions').find({ studentId: parseInt(studentId) }).toArray()
        //if no records are returned , throw an error to the server
        if (records.length===0) {
            throw { status: 404, msg: "No suggestions found for student." }; 
        }
        //return the results to the server
        return records
    } catch (error) {
        throw error
    }
   
}

//model for posting anew suggestion
const insertNewSuggestion = async (newSuggestionObj) => {
    try {

      //call checkNewSuggestionValidity with newSuggestionObj
      checkNewSuggestionValidity(newSuggestionObj);

      //ensure the student id in the request body object exists
      await fetchStudentById(newSuggestionObj.studentId);
      
      //fetch all behavuor logs
      const behaviorLogs = await fetchBehaviorLogs();
      
      //ensure he behavior log in the request body exists, if not throw an error to the server
      const behaviorLogExists = behaviorLogs.some(
        (log) => log.behaviorLogId === parseInt(newSuggestionObj.behaviorLogId, 10)
      );
      if (!behaviorLogExists) {
        throw { status: 404, msg: 'Behavior log not found.' };
      }
   
      //fetch the last used id from th collection suggestionIdCounters
      const lastId = await getNextSuggestionId("suggestionId");
    
      //transform the newSuggestionObj
      const transformedSuggestion = transformNewSuggestion(newSuggestionObj);
   
       //ensure a connection to the mongo db client
      await run();
 
      //execute the mongo db insert query and store the result agasint the variable result
      const result = await client.db('eduPath').collection('suggestions').insertOne({suggestionId:lastId,...transformedSuggestion});
    
      //return the result in an object to the server
      return { msg: 'New suggestion successfully posted!', result };
    } catch (error) {
      throw error;
    }
  };


  function checkNewSuggestionValidity(newSuggestion) {

    //ensure all keys are exist and are of the correcr data type

    if (!newSuggestion.studentId) {
      throw { status: 404, msg: 'Object is missing a studentId key.' };
    }
    if (typeof newSuggestion.studentId !== 'string' || newSuggestion.studentId.trim() === '') {
      throw { status: 400, msg: 'studentId must be a non-empty string.' };
    }
  
    if (!newSuggestion.academicYear) {
      throw { status: 404, msg: 'Object is missing an academicYear key.' };
    }
    if (typeof newSuggestion.academicYear !== 'string' || newSuggestion.academicYear.trim() === '') {
      throw { status: 400, msg: 'academicYear must be a non-empty string.' };
    }
  
    if (!newSuggestion.date) {
      throw { status: 404, msg: 'Object is missing a date key.' };
    }
    if (typeof newSuggestion.date !== 'string' || newSuggestion.date.trim() === '') {
      throw { status: 400, msg: 'date must be a non-empty string.' };
    }
  
    if (!newSuggestion.behaviorLogId) {
      throw { status: 404, msg: 'Object is missing a behaviorLogId key.' };
    }
    if (typeof newSuggestion.behaviorLogId !== 'string' || newSuggestion.behaviorLogId.trim() === '') {
      throw { status: 400, msg: 'behaviorLogId must be a non-empty string.' };
    }
  
    if (!newSuggestion.suggestion) {
      throw { status: 404, msg: 'Object is missing a suggestion key.' };
    }
    if (typeof newSuggestion.suggestion !== 'string' || newSuggestion.suggestion.trim() === '') {
      throw { status: 400, msg: 'suggestion must be a non-empty string.' };
    }
  
    if (!newSuggestion.followUpRequired) {
      throw { status: 404, msg: 'Object is missing a followUpRequired key.' };
    }
    if (newSuggestion.followUpRequired !== 'Yes' && newSuggestion.followUpRequired !== 'No') {
      throw { status: 400, msg: 'followUpRequired must be either "Yes" or "No".' };
    }
  
    return true;
  }

//model to modify follow up required in the suggestions collection and the date and status in the behavior_logs collection
  const modifyFollowUpRequired = async (suggestionId, followUpRequired) => {
    try {
      //ensure a connection to the mongo db client
        await run();

      //ensure suggestion id exists
        const suggestion = await client
            .db('eduPath')
            .collection('suggestions')
            .findOne({ suggestionId: parseInt(suggestionId, 10) });

        //if suggestion id does not exist throw    
        if (!suggestion) {
            throw { status: 404, msg: 'Suggestion not found.' };
        }
        //store the beahviorLogId against a variable
        const behaviorLogId = suggestion.behaviorLogId;

       //execute the mongo db insert operations
        const suggestionUpdateResult = await client.db('eduPath').collection('suggestions').findOneAndUpdate(
            { suggestionId: parseInt(suggestionId, 10) },
            //followUpRequired is transformed to a boolean  and false by default - so if the below actually true append 'Yes'
            {
                $set: { followUpRequired: followUpRequired === 'Yes' },
            },
            { returnDocument: 'after' } 
        );

        //if the update fails return an error
        if (!suggestionUpdateResult) {
            throw { status: 404, msg: 'Failed to update suggestion.' };
        }

     
        //initalise an empty behaviorLogUpdateQuery object
        let behaviorLogUpdateQuery = {};

        //if the followUpRequired field is No - set the behavior log date and status to 'Resolved'
        if (followUpRequired === 'No') {
            behaviorLogUpdateQuery = {
                $set: {
                    dateResolved: new Date().toISOString(), 
                    status: 'Resolved'
                }
            };
        //if the followUpRequired field is Yes - set the behavior log date to "" and status to 'Pending'
        } else if (followUpRequired === 'Yes') {
            behaviorLogUpdateQuery = {
                $set: { status: 'Pending', dateResolved: "" },
          
            };
        }
       

       
        //execute the mongo db insert query into the behavior_log collection
        const behaviorLogUpdateResult = await client.db('eduPath').collection('behavior_logs').findOneAndUpdate(
            { behaviorLogId: behaviorLogId },
            behaviorLogUpdateQuery,
            { returnDocument: 'after' }
        );
        //if the update fails return an error
        if (!behaviorLogUpdateResult) {
            throw { status: 404, msg: 'Behavior log not found or failed to update.' };
        }
        //return the both results to the server
        return {
            suggestion: suggestionUpdateResult,
            behaviorLog: behaviorLogUpdateResult
        };
    } catch (error) {
      
        throw error;
    }
};

  
  

module.exports = {fetchSuggestions,fetchSuggestionsByStudentId, insertNewSuggestion,modifyFollowUpRequired}

