const { fetchParticipationRate, fetchTimeToResolution } = require("../models/engagement-metrics.models");

//controller for participation rate visual
const getParticipationRate = async (req, res, next) => {

  
    //destrucuture yearGroup and academicYear from the request query for variables to be used in the model
    const {academicYear,yearGroup} = req.query

    try {
        const data = await fetchParticipationRate(academicYear,yearGroup);
        res.status(200).send(data);
    } catch (error) {
        next(error);
    }
};

//controller for average resolution time visual
const getTimeToResolution = async (req, res, next) => {
    try {
        const data = await fetchTimeToResolution();
        res.status(200).send(data);
    } catch (error) {
        next(error);
    }
};



module.exports = { getParticipationRate,getTimeToResolution};