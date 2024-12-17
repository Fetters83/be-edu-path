const { fetchBehaviorLogs, fetchBehaviorLogsByStudentId, insertNewBehaviorLog } = require("../models/behaviour-logs.models")

//controller for fetching ALL behavior logs from the behavior_logs collection
const getBehaviourLogs = async (req,res,next)=>{

    try {
        const data = await fetchBehaviorLogs()
        res.status(200).send(data)
    } catch (error) {
        console.log(error)
    }
    
}

//controller for fetching behavior logs by studentId from the behavior_logs collection
const getBehaviorLogsByStudentId = async (req,res,next)=>{

    const {studentId} = req.params

    try {
        const data = await fetchBehaviorLogsByStudentId(studentId)
     
        res.status(200).send(data)
    } catch (error) {
       next(error)
    }
   


}
//controller for posting a new behavior log to the behavior_logs collection
    const postNewBehaviorLog = async (req,res,next)=>{

        //destrcuture the the updated behavior log object from the request body to be inserted in to th behavior_logs collection
        const newBehaviorLogObject = req.body

    
        try {
            const data = await insertNewBehaviorLog(newBehaviorLogObject)
            res.status(201).send(data)
        } catch (error) {
            next(error)
        }
    }

module.exports = {getBehaviourLogs,getBehaviorLogsByStudentId,postNewBehaviorLog}