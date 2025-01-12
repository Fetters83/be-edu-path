const { fetchPrimaryCategories, insertNewPrimaryCategory } = require("../models/primary-categories.models");

//controller for getting ALL primary categories from the primaryCategories collection
const getPrimaryCategories = async (req, res, next) => {
    try {
      const data = await fetchPrimaryCategories();
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

//controller for posting new Primary Category to the primaryCategories collection
  const postNewPrimaryCategory = async (req, res, next) => {
    try {
      const { primaryCategory } = req.body;
       if (!primaryCategory) {
        return res.status(400).send({ msg: 'primaryCategory is required' });
      }
      const result = await insertNewPrimaryCategory(primaryCategory);
      res.status(201).send(result);
    } catch (error) {
      next(error);
    }
  };


  module.exports = { getPrimaryCategories, postNewPrimaryCategory };