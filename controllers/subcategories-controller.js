const { fetchSubCategories, insertNewSubCategory } = require("../models/subcategories.models");

  
  const getSubCategories = async (req, res, next) => {
    try {
      const data = await fetchSubCategories();
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };
  
  const postNewSubCategory = async (req, res, next) => {
    try {
      const { subCategory, primaryCategory } = req.body;
      if (!subCategory || !primaryCategory) {
        return res.status(400).send({ msg: 'subCategory and primaryCategory are required' });
      }
      const result = await insertNewSubCategory(subCategory, primaryCategory);
      res.status(201).send(result);
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = { getSubCategories, postNewSubCategory };
  