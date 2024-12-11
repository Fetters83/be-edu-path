const {client,run} = require('../connection');
const { getNextBehaviorLogId } = require('../utilities/getNextBehaviorLogId');
const { transformNewBehaviorLog } = require('../utilities/transformNewBehaviorLog');
const { fetchPrimaryCategories } = require('./primary-categories.models');
const { fetchSeverities } = require('./severities.models');
const { fetchStudentById } = require('./students.models');
const { fetchSubCategories } = require('./subcategories.models');



const fetchBehaviorLogs = async ()=>{

    try {
        await run();
        const records = await client.db('eduPath').collection('behavior_logs').find().toArray();
        return records
    } catch (error) {
        throw error;
    }
   
}

const fetchBehaviorLogsByStudentId = async (studentId)=>{

    
    if(isNaN(parseInt(studentId))){
       
        throw ({status:400,msg:"Student Id is not of type number."})
    }

    try {
        await run();
        const record = await client.db('eduPath').collection('behavior_logs').find({ studentId: parseInt(studentId) }).toArray()

        if (record.length===0) {
            throw { status: 404, msg: "No behavior logs found for student." }; 
        }

        return record
    } catch (error) {
        throw error
    }
   
}

const insertNewBehaviorLog = async (newBehaviorLogObj) =>{

        try {

        checkNewBehaviorLogValidity(newBehaviorLogObj)
        const transformedBehaviorLog = transformNewBehaviorLog(newBehaviorLogObj)
        const lastId = await getNextBehaviorLogId("behaviorLogId");

        await fetchStudentById(newBehaviorLogObj.studentId)
        
        const primaryCategories = await fetchPrimaryCategories();
        const primaryCatExists = primaryCategories.some(cat => cat.primaryCategory === newBehaviorLogObj.primaryCategory)
        if(!primaryCatExists) throw({status:404,msg:'Primary Category does not exist.'})
        
        const subCategories = await fetchSubCategories()
        const subCatExists = subCategories.some(subCat => subCat.subCategory === newBehaviorLogObj.subcategory)
        if(!subCatExists) throw({status:404,msg:'Sub Category does not exist.'})
       
        const severities = await fetchSeverities()
        if(!severities) throw({status:404,msg:'Severity Code does not exist.'})
        
       /*  if(newBehaviorLogObj.status !='' || newBehaviorLogObj.status !="Pending" || newBehaviorLogObj.status !="Resolved"){
            throw({status:404,msg:'Status does not exist!'})
        }   */       


        const newBehaviorLog = { behaviorLogId: lastId, ...transformedBehaviorLog };
        const result = await client.db('eduPath').collection('behavior_logs').insertOne(newBehaviorLog)
        return {newBehaviorLog:"New Behavior Log succesully posted!",result}


    } catch (error) {
        throw error        
    }
}


function checkNewBehaviorLogValidity(newBehaviorLog) {

   
    if (!newBehaviorLog.studentId) {
        throw { status: 404, msg: "Object is missing a studentId key." };
    }
    if (typeof newBehaviorLog.studentId !== 'string' || newBehaviorLog.studentId === null) {
        throw { status: 400, msg: "studentId must be a string and cannot be null." };
    }

    if (!newBehaviorLog.yearGroup) {
        throw { status: 404, msg: "Object is missing a yearGroup key." };
    }
    if (typeof newBehaviorLog.yearGroup !== 'number' || newBehaviorLog.yearGroup === null) {
        throw { status: 400, msg: "yearGroup must be a number and cannot be null." };
    }

    if (!newBehaviorLog.academicYear) {
        throw { status: 404, msg: "Object is missing an academicYear key." };
    }
    if (typeof newBehaviorLog.academicYear !== 'string' || newBehaviorLog.academicYear === '' || !/\d{4}\/\d{2}/.test(newBehaviorLog.academicYear)) {
        throw { status: 400, msg: "academicYear must be a non-empty string in the format YYYY/YY." };
    }

    if (!newBehaviorLog.date) {
        throw { status: 404, msg: "Object is missing a date key." };
    }
    if (typeof newBehaviorLog.date !== 'string' || newBehaviorLog.date === '' || !/^\d{4}-\d{2}-\d{2}$/.test(newBehaviorLog.date)) {
        throw { status: 400, msg: "date must be a string in the format yyyy-mm-dd and cannot be empty." };
    }

    if (!newBehaviorLog.primaryCategory) {
        throw { status: 404, msg: "Object is missing a primaryCategory key." };
    }
    if (typeof newBehaviorLog.primaryCategory !== 'string' || newBehaviorLog.primaryCategory === '') {
        throw { status: 400, msg: "primaryCategory must be a non-empty string." };
    }

    if (!newBehaviorLog.subcategory) {
        throw { status: 404, msg: "Object is missing a subcategory key." };
    }
    if (typeof newBehaviorLog.subcategory !== 'string' || newBehaviorLog.subcategory === '') {
        throw { status: 400, msg: "subcategory must be a non-empty string." };
    }

    if (!newBehaviorLog.severity) {
        throw { status: 404, msg: "Object is missing a severity key." };
    }
    if (typeof newBehaviorLog.severity !== 'string' || newBehaviorLog.severity === '') {
        throw { status: 400, msg: "severity must be a non-empty string." };
    }

    if (!newBehaviorLog.details) {
        throw { status: 404, msg: "Object is missing a details key." };
    }
    if (typeof newBehaviorLog.details !== 'string' || newBehaviorLog.details === '') {
        throw { status: 400, msg: "details must be a non-empty string." };
    }

    if (!Object.prototype.hasOwnProperty.call(newBehaviorLog, "status")) {
        throw { status: 404, msg: "Object is missing a status key." };
      }
      if (
        newBehaviorLog.status !== "" &&
        newBehaviorLog.status !== "Pending" &&
        newBehaviorLog.status !== "Resolved"
      ) {
        throw { status: 400, msg: "status must be empty, 'Pending', or 'Resolved'." };
      }

      if (!Object.prototype.hasOwnProperty.call(newBehaviorLog, "dateResolved")) {
        throw { status: 404, msg: "Object is missing a dateResolved key." };
      }
      if (typeof newBehaviorLog.dateResolved !== "string") {
        throw { status: 400, msg: "dateResolved must be a string." };
      }

    return true; 
}

module.exports = {fetchBehaviorLogs,fetchBehaviorLogsByStudentId,insertNewBehaviorLog}
