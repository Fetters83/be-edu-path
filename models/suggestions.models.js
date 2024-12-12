const {client,run} = require('../connection');
const { getNextSuggestionId } = require('../utilities/getNextSuggestionId');
const { transformNewSuggestion } = require('../utilities/transformNewSuggestion');
const { fetchBehaviorLogs } = require('./behaviour-logs.models');

const { fetchStudentById } = require('./students.models');



const fetchSuggestions = async ()=>{

    try {
        await run();
        const records = await client.db('eduPath').collection('suggestions').find().toArray();
        return records
    } catch (error) {
        throw error;
    }
   
}

const fetchSuggestionsByStudentId = async (studentId)=>{

    
    if(isNaN(parseInt(studentId))){
       
        throw ({status:400,msg:"Student Id is not of type number."})
    }

    try {
        await run();
        const records = await client.db('eduPath').collection('suggestions').find({ studentId: parseInt(studentId) }).toArray()

        if (records.length===0) {
            throw { status: 404, msg: "No suggestions found for student." }; 
        }

        return record
    } catch (error) {
        throw error
    }
   
}


const insertNewSuggestion = async (newSuggestionObj) => {
    try {

   
      checkNewSuggestionValidity(newSuggestionObj);

      await fetchStudentById(newSuggestionObj.studentId);
   
      const behaviorLogs = await fetchBehaviorLogs();
 
      const behaviorLogExists = behaviorLogs.some(
        (log) => log.behaviorLogId === parseInt(newSuggestionObj.behaviorLogId, 10)
      );
      if (!behaviorLogExists) {
        throw { status: 404, msg: 'Behavior log not found.' };
      }
   
      const lastId = await getNextSuggestionId("suggestionId");
    
 
      const transformedSuggestion = transformNewSuggestion(newSuggestionObj);
   
    
      await run();
 
      const result = await client.db('eduPath').collection('suggestions').insertOne({suggestionId:lastId,...transformedSuggestion});
    
      return { msg: 'New suggestion successfully posted!', result };
    } catch (error) {
      throw error;
    }
  };

  function checkNewSuggestionValidity(newSuggestion) {
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


  const modifyFollowUpRequired = async (suggestionId, followUpRequired) => {
    try {
        await run();

      
        const suggestion = await client
            .db('eduPath')
            .collection('suggestions')
            .findOne({ suggestionId: parseInt(suggestionId, 10) });

        if (!suggestion) {
            throw { status: 404, msg: 'Suggestion not found.' };
        }

        const behaviorLogId = suggestion.behaviorLogId;

       
        const suggestionUpdateResult = await client.db('eduPath').collection('suggestions').findOneAndUpdate(
            { suggestionId: parseInt(suggestionId, 10) },
            {
                $set: { followUpRequired: followUpRequired === 'Yes' },
            },
            { returnDocument: 'after' } 
        );

     
        if (!suggestionUpdateResult) {
            throw { status: 404, msg: 'Failed to update suggestion.' };
        }

     
        let behaviorLogUpdateQuery = {};

        if (followUpRequired === 'No') {
            behaviorLogUpdateQuery = {
                $set: {
                    dateResolved: new Date().toISOString(), 
                    status: 'Resolved'
                }
            };
        } else if (followUpRequired === 'Yes') {
            behaviorLogUpdateQuery = {
                $set: { status: 'Pending', dateResolved: "" },
          
            };
        }
       

       
  
        const behaviorLogUpdateResult = await client.db('eduPath').collection('behavior_logs').findOneAndUpdate(
            { behaviorLogId: behaviorLogId },
            behaviorLogUpdateQuery,
            { returnDocument: 'after' }
        );

        if (!behaviorLogUpdateResult) {
            throw { status: 404, msg: 'Behavior log not found or failed to update.' };
        }

        return {
            suggestion: suggestionUpdateResult,
            behaviorLog: behaviorLogUpdateResult
        };
    } catch (error) {
      
        throw error;
    }
};

  
  

module.exports = {fetchSuggestions,fetchSuggestionsByStudentId, insertNewSuggestion,modifyFollowUpRequired}

