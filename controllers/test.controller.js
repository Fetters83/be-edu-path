const { testModel } = require("../models/test.model");


const testController = async (req,res) =>{

    try {
        const data = await testModel();
        res.status(200).send(data)
    } catch (error) {
        console.log(error)
    }
   
}

module.exports = {testController}