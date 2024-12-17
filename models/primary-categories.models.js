const { client, run } = require('../connection');


//model to fetch all primary categories
const fetchPrimaryCategories = async () => {

    
  try {
    //ensure a connection to the mongo db client
    await run();
    //return the mongo db query result
    return await client.db('eduPath').collection('primaryCategories').find().toArray();
  } catch (error) {
    throw error;
  }
};

//model to insert a new Primary Category
const insertNewPrimaryCategory = async (primaryCategory) => {
  //if the praimery category from the request body is not a string throw an error
    if(typeof primaryCategory !='string'){
        throw({status:400,msg:'Primary Cateogry must of type string.'})
    }
  try {
    //ensure a connection to the mongo db client
    await run();
    //execute the mongo db insert operation and store the result against the variable result
    const result = await client.db('eduPath').collection('primaryCategories').insertOne({ primaryCategory });
    //return the result in an object to the server
    return {primaryCategory:"New Primary Category posted!",result};
  } catch (error) {
    throw error;
  }
};

module.exports = { fetchPrimaryCategories, insertNewPrimaryCategory };