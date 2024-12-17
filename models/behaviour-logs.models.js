const {client,run} = require('../connection');
const { getNextBehaviorLogId } = require('../utilities/getNextBehaviorLogId');
const { transformNewBehaviorLog } = require('../utilities/transformNewBehaviorLog');
const { fetchPrimaryCategories } = require('./primary-categories.models');
const { fetchSeverities } = require('./severities.models');
const { fetchStudentById } = require('./students.models');
const { fetchSubCategories } = require('./subcategories.models');


//Model for fetching all behavior logs from the behavior_logs collections
const fetchBehaviorLogs = async ()=>{

    try {
        //ensure a connection to the mongo db client
        await run();
        //perform mongo db operation
        const records = await client.db('eduPath').collection('behavior_logs').find().toArray();
        return records
    } catch (error) {
        throw error;
    }
   
}

//model for fetchiing behavior logs by student id
const fetchBehaviorLogsByStudentId = async (studentId)=>{

    //if studentId, once parsed, is not a number throw an error back to the server
    if(isNaN(parseInt(studentId))){
       
        throw ({status:400,msg:"Student Id is not of type number."})
    }

    try {
        //ensure a connection to the mongo db client
        await run();

        //execute mongo db query
        const record = await client.db('eduPath').collection('behavior_logs').find({ studentId: parseInt(studentId) }).toArray()

        //if no records found throw an error
        if (record.length===0) {
            throw { status: 404, msg: "No behavior logs found for student." }; 
        }

        return record
    } catch (error) {
        throw error
    }
   
}

//model for inserting a new beahvior object
const insertNewBehaviorLog = async (newBehaviorLogObj) =>{

        try {

         //pass ne beahvior object to the function checkNewBehaviorLogValidity    
        checkNewBehaviorLogValidity(newBehaviorLogObj)
        //transform the new object property values to the correct data types
        const transformedBehaviorLog = transformNewBehaviorLog(newBehaviorLogObj)
        //retrieve the last id used using the function getNextBehaviorLogId and store against the variable lastId
        const lastId = await getNextBehaviorLogId("behaviorLogId");
        
        //call fetchStudentById to ensure the student exists
        await fetchStudentById(newBehaviorLogObj.studentId)
        
        //fetch all primary categories
        const primaryCategories = await fetchPrimaryCategories();
        //check that the primary category passed in the request body exists by cross checking the result from above
        const primaryCatExists = primaryCategories.some(cat => cat.primaryCategory === newBehaviorLogObj.primaryCategory)
        //if the primary category passed in the req body does not exists throw an error
        if(!primaryCatExists) throw({status:404,msg:'Primary Category does not exist.'})
        
         //fetch all sub categories   
        const subCategories = await fetchSubCategories()
        //check that the sub category passed in the request body exists by cross checking the result from above
        const subCatExists = subCategories.some(subCat => subCat.subCategory === newBehaviorLogObj.subcategory)
        //if the sub category passed in the req body does not exists throw an error
        if(!subCatExists) throw({status:404,msg:'Sub Category does not exist.'})
       
         //fetch all severities      
        const severities = await fetchSeverities()
         //check that the seeverity code passed in the request body exists by cross checking the result from above
        if(!severities) throw({status:404,msg:'Severity Code does not exist.'})
        
    
        //append the last Id and the transformed behavior log object into a new object variable     
        const newBehaviorLog = { behaviorLogId: lastId, ...transformedBehaviorLog };
        //perform the mongo db insert ooperation
        const result = await client.db('eduPath').collection('behavior_logs').insertOne(newBehaviorLog)
        //return the posted obect to the server
        return {newBehaviorLog:"New Behavior Log succesully posted!",result}


    } catch (error) {
        throw error        
    }
}


function checkNewBehaviorLogValidity(newBehaviorLog) {

   //check studentId key exists, if not throw an error
    if (!newBehaviorLog.studentId) {
        throw { status: 404, msg: "Object is missing a studentId key." };
    }

    //check student Id is of type string and not null, if not throw an error
    if (typeof newBehaviorLog.studentId !== 'string' || newBehaviorLog.studentId === null) {
        throw { status: 400, msg: "studentId must be a string and cannot be null." };
    }
    //check yearGroup key exists, if not throw an error
    if (!newBehaviorLog.yearGroup) {
        throw { status: 404, msg: "Object is missing a yearGroup key." };
    }

    //check yearGroup key is of type number and not null, otherwise throw an error
    if (typeof newBehaviorLog.yearGroup !== 'number' || newBehaviorLog.yearGroup === null) {
        throw { status: 400, msg: "yearGroup must be a number and cannot be null." };
    }
    //check academicYear key exists, if not throw an error
    if (!newBehaviorLog.academicYear) {
        throw { status: 404, msg: "Object is missing an academicYear key." };
    }
    //check academicYear is of type string and not null, if not throw an error
    if (typeof newBehaviorLog.academicYear !== 'string' || newBehaviorLog.academicYear === '' || !/\d{4}\/\d{2}/.test(newBehaviorLog.academicYear)) {
        throw { status: 400, msg: "academicYear must be a non-empty string in the format YYYY/YY." };
    }
    //check date key exists, if not throw an error
    if (!newBehaviorLog.date) {
        throw { status: 404, msg: "Object is missing a date key." };
    }
    //check date is of type string and not null, if not throw an error
    if (typeof newBehaviorLog.date !== 'string' || newBehaviorLog.date === '' || !/^\d{4}-\d{2}-\d{2}$/.test(newBehaviorLog.date)) {
        throw { status: 400, msg: "date must be a string in the format yyyy-mm-dd and cannot be empty." };
    }
    //check primary category key exists, if not throw an error
    if (!newBehaviorLog.primaryCategory) {
        throw { status: 404, msg: "Object is missing a primaryCategory key." };
    }
    //check primary category is of type string and not null, if not throw an error
    if (typeof newBehaviorLog.primaryCategory !== 'string' || newBehaviorLog.primaryCategory === '') {
        throw { status: 400, msg: "primaryCategory must be a non-empty string." };
    }
    //check sub category key exists, if not throw an error
    if (!newBehaviorLog.subcategory) {
        throw { status: 404, msg: "Object is missing a subcategory key." };
    }
     //check sub category is of type string and not null, if not throw an error
    if (typeof newBehaviorLog.subcategory !== 'string' || newBehaviorLog.subcategory === '') {
        throw { status: 400, msg: "subcategory must be a non-empty string." };
    }
    //check severity key exists, if not throw an error
    if (!newBehaviorLog.severity) {
        throw { status: 404, msg: "Object is missing a severity key." };
    }
     //check severity is of type string and not null, if not throw an error
    if (typeof newBehaviorLog.severity !== 'string' || newBehaviorLog.severity === '') {
        throw { status: 400, msg: "severity must be a non-empty string." };
    }
     //check details key exists, if not throw an error
    if (!newBehaviorLog.details) {
        throw { status: 404, msg: "Object is missing a details key." };
    }
    //check details is of type string and not null, if not throw an error
    if (typeof newBehaviorLog.details !== 'string' || newBehaviorLog.details === '') {
        throw { status: 400, msg: "details must be a non-empty string." };
    }
    //check status key exists, if not throw an error
    if (!Object.prototype.hasOwnProperty.call(newBehaviorLog, "status")) {
        throw { status: 404, msg: "Object is missing a status key." };
      }
      //check that the status value is either "", Pending or Resolved otherwise throw an error
      if (
        newBehaviorLog.status !== "" &&
        newBehaviorLog.status !== "Pending" &&
        newBehaviorLog.status !== "Resolved"
      ) {
        throw { status: 400, msg: "status must be empty, 'Pending', or 'Resolved'." };
      }
    //check dateResolved key exists, if not throw an error
      if (!Object.prototype.hasOwnProperty.call(newBehaviorLog, "dateResolved")) {
        throw { status: 404, msg: "Object is missing a dateResolved key." };
      }
      //that dateResolved ket is of type string, otherwise throw an error
      if (typeof newBehaviorLog.dateResolved !== "string") {
        throw { status: 400, msg: "dateResolved must be a string." };
      }

    return true; 
}

module.exports = {fetchBehaviorLogs,fetchBehaviorLogsByStudentId,insertNewBehaviorLog}
