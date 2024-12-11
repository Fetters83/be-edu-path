const { client, run } = require('../connection');
const { fetchPrimaryCategories } = require('./primary-categories.models');

const fetchSubCategories = async () => {
  try {
    await run();
    return await client.db('eduPath').collection('subCategories').find().toArray();
  } catch (error) {
    throw error;
  }
};

const insertNewSubCategory = async (subCategory, primaryCategory) => {
  try {
    await run();

    const primaryCategories = await fetchPrimaryCategories()
    const subCategories = await fetchSubCategories()
    const primaryCatExists = primaryCategories.some(cat => cat.primaryCategory === primaryCategory)
    
    if(!primaryCatExists) throw({status:404,msg:'Primary Category does not exist.'})
    
    const subCatExists = subCategories.some(subCat => subCat.subCategory === subCategory)
    
    if(subCatExists) throw({status:404,msg:'Sub-Category already exists!.'})
    
    const result = await client.db('eduPath').collection('subCategories').insertOne({
            subCategory,
            primaryCategory,
          });
        
    return {subCategory:"New Sub Category succesully posted!",result}
  } catch (error) {
    throw error;
  }
};

module.exports = { fetchSubCategories, insertNewSubCategory };
