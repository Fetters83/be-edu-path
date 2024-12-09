const {client,run} = require('../connection')


const fetchStudents = async ()=>{

    try {
        await run();
        const records = await client.db('eduPath').collection('students').find().toArray();
        return records
    } catch (error) {
        throw error;
    }
   
}

const fetchStudentById = async (studentId)=>{

    
    if(isNaN(parseInt(studentId))){
       
        throw ({status:400,msg:"Student Id is not of type number."})
    }

    try {
        await run();
        const record = await client.db('eduPath').collection('students').findOne({ studentId: parseInt(studentId) })

        if (!record) {
            throw { status: 404, msg: "Student Id not found." }; 
        }

        return record
    } catch (error) {
        throw error
    }
   
}

module.exports = {fetchStudents,fetchStudentById}