const { client, run } = require('../connection');
const { fetchPrimaryCategories } = require('./primary-categories.models');

//model to fetch all sub categories from the sub categories collection
const fetchSubCategories = async () => {
  try {
     //ensure a connection to the mongo db client
    await run();

    //execute mongo db query and store the results against the variable records
    const records =  await client.db('eduPath').collection('subCategories').find().toArray();
    //return the result
    return records
  } catch (error) {
    throw error;
  }
};

//model to insert a new sub category
const insertNewSubCategory = async (subCategory, primaryCategory) => {
  try {
     //ensure a connection to the mongo db client
    await run();

    //run query to fetch all primary categories
    const primaryCategories = await fetchPrimaryCategories()
    //run query to fetch all sub cateogories categories
    const subCategories = await fetchSubCategories()
    //return true if the primary category exists using some method
    const primaryCatExists = primaryCategories.some(cat => cat.primaryCategory === primaryCategory)
    //if the primary category does not exist, throw an error to the server
    if(!primaryCatExists) throw({status:404,msg:'Primary Category does not exist.'})
   //return true if the subcategory exists using some method
    const subCatExists = subCategories.some(subCat => subCat.subCategory === subCategory)
    // if the sub category exists, throw an error to the server
    if(subCatExists) throw({status:404,msg:'Sub-Category already exists!.'})
    
    //execute the mongo db insert query and store the result against the variable result  
    const result = await client.db('eduPath').collection('subCategories').insertOne({
            subCategory,
            primaryCategory,
          });
    //return the result in an object to the server    
    return {subCategory:"New Sub Category succesully posted!",result}
  } catch (error) {
    throw error;
  }
};

module.exports = { fetchSubCategories, insertNewSubCategory };
