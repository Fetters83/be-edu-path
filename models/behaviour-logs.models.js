const {client,run} = require('../connection')



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

module.exports = {fetchBehaviorLogs,fetchBehaviorLogsByStudentId}
