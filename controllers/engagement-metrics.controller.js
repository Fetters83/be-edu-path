const { fetchParticipationRate } = require("../models/engagement-metrics.models");


const getParticipationRate = async (req, res, next) => {

  

    const {academicYear,yearGroup} = req.query

    try {
        const data = await fetchParticipationRate(academicYear,yearGroup);
        res.status(200).send(data);
    } catch (error) {
        next(error);
    }
};

module.exports = { getParticipationRate };