const { fetchBehaviorLogs, fetchBehaviorLogsByStudentId, insertNewBehaviorLog } = require("../models/behaviour-logs.models")


const getBehaviourLogs = async (req,res,next)=>{

    try {
        const data = await fetchBehaviorLogs()
        res.status(200).send(data)
    } catch (error) {
        console.log(error)
    }
    
}


const getBehaviorLogsByStudentId = async (req,res,next)=>{

    const {studentId} = req.params

    try {
        const data = await fetchBehaviorLogsByStudentId(studentId)
     
        res.status(200).send(data)
    } catch (error) {
       next(error)
    }
   


}

    const postNewBehaviorLog = async (req,res,next)=>{

        const newBehaviorLogObject = req.body

    

        try {
            const data = await insertNewBehaviorLog(newBehaviorLogObject)
            res.status(201).send(data)
        } catch (error) {
            next(error)
        }
    }

module.exports = {getBehaviourLogs,getBehaviorLogsByStudentId,postNewBehaviorLog}