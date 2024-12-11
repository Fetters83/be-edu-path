const { fetchSeverities, insertNewSeverity } = require("../models/severities.models");


const getSeverities = async (req, res, next) => {
  try {
    const data = await fetchSeverities();
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};

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
