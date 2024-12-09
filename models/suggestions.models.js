const {client,run} = require('../connection')



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

module.exports = {fetchSuggestions,fetchSuggestionsByStudentId}

