const express = require('express');
const app = express();

const cors = require('cors');
const { testController } = require('./controllers/test.controller');
const { getStudents, getStudentById } = require('./controllers/students.controller');
const { getBehaviourLogs, getBehaviorLogsByStudentId } = require('./controllers/behaviour-logs.controller');
const { getSuggestions, getSuggestionsByStudentId } = require('./controllers/suggestions.controllers');
const { getAverageAttendance, getLowestAttenders } = require('./controllers/average-attendance.controller');
const { getKS1GradeCount, getKS2GradeCount, getKS1GradeCountYearOnYear, getKS2GradeCountYearOnYear } = require('./controllers/grade-distribution.controller');
const { getIncidentRate, getResolutionRate, getTop5BehaviorIncidents } = require('./controllers/behavioral-metrics.controller');
const { getParticipationRate } = require('./controllers/engagement-metrics.controller');
app.use(cors())

app.get('/',testController)

app.get('/api/students',getStudents)
app.get('/api/students/:studentId',getStudentById)

app.get('/api/behavior-logs',getBehaviourLogs)
app.get('/api/behavior-logs/:studentId',getBehaviorLogsByStudentId)

app.get('/api/suggestions',getSuggestions)
app.get('/api/suggestions/:studentId',getSuggestionsByStudentId)

app.get('/api/accademicMetrics/averageAttendance',getAverageAttendance)
app.get('/api/accademicMetrics/studentLowestAttenders',getLowestAttenders)
app.get('/api/accademicMetrics/gradeDistribution/ks1',getKS1GradeCount)
app.get('/api/accademicMetrics/gradeDistribution/ks2',getKS2GradeCount)
app.get('/api/accademicMetrics/gradeDistribution/ks1/yearOnYear',getKS1GradeCountYearOnYear)
app.get('/api/accademicMetrics/gradeDistribution/ks2/yearOnYear',getKS2GradeCountYearOnYear)

app.get('/api/behavioralMetrics/incidentRate',getIncidentRate)
app.get('/api/behavioralMetrics/ResolutionRate',getResolutionRate)
app.get('/api/behavioralMetrics/top5BehaviorIncidents',getTop5BehaviorIncidents)
app.get('/api/engagementMetrics/participationRate',getParticipationRate)

app.use((error,req,res,next)=>{
    if(error.status && error.msg){
        res.status(error.status).send(error.msg)
    }
})

module.exports = app