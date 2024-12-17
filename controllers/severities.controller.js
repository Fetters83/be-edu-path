const { fetchSeverities, insertNewSeverity } = require("../models/severities.models");

//controller for getting ALL severities from the severities collection
const getSeverities = async (req, res, next) => {
  try {
    const data = await fetchSeverities();
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};

//controller for posting new severity to the severities collection
const postNewSeverity = async (req, res, next) => {
  try {
    const { severityCode } = req.body;
    if (!severityCode) {
      return res.status(400).send({ msg: 'severityCode is required' });
    }
    const result = await insertNewSeverity(severityCode);
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSeverities, postNewSeverity };
