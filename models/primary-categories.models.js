const { client, run } = require('../connection');

const fetchPrimaryCategories = async () => {

    
  try {
    await run();
    return await client.db('eduPath').collection('primaryCategories').find().toArray();
  } catch (error) {
    throw error;
  }
};

const insertNewPrimaryCategory = async (primaryCategory) => {

    if(typeof primaryCategory !='string'){
        throw({status:400,msg:'Primary Cateogry must of type string.'})
    }
  try {
    await run();
    const result = await client.db('eduPath').collection('primaryCategories').insertOne({ primaryCategory });
    return {primaryCategory:"New Primary Category posted!",result};
  } catch (error) {
    throw error;
  }
};

module.exports = { fetchPrimaryCategories, insertNewPrimaryCategory };