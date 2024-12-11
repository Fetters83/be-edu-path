const express = require('express');
const app = express();

const cors = require('cors');
const { testController } = require('./controllers/test.controller');
const { getStudents, getStudentById, postNewStudent } = require('./controllers/students.controller');
const { getBehaviourLogs, getBehaviorLogsByStudentId } = require('./controllers/behaviour-logs.controller');
const { getSuggestions, getSuggestionsByStudentId } = require('./controllers/suggestions.controllers');
const { getAverageAttendance, getLowestAttenders } = require('./controllers/average-attendance.controller');
const { getKS1GradeCount, getKS2GradeCount, getKS1GradeCountYearOnYear, getKS2GradeCountYearOnYear } = require('./controllers/grade-distribution.controller');
const { getIncidentRate, getResolutionRate, getTop5BehaviorIncidents } = require('./controllers/behavioral-metrics.controller');
const { getParticipationRate, getTimeToResolution } = require('./controllers/engagement-metrics.controller');
app.use(cors())
app.use(express.json());

app.get('/',testController)

app.get('/api/students',getStudents)
app.get('/api/students/:studentId',getStudentById)
app.post('/api/students',postNewStudent)

app.get('/api/behavior-logs',getBehaviourLogs)
app.get('/api/behavior-logs/:studentId',getBehaviorLogsByStudentId)

app.get('/api/suggestions',getSuggestions)
app.get('/api/suggestions/:studentId',getSuggestionsByStudentId)

app.get('/api/academicMetrics/averageAttendance',getAverageAttendance)
app.get('/api/academicMetrics/studentLowestAttenders',getLowestAttenders)
app.get('/api/academicMetrics/gradeDistribution/ks1',getKS1GradeCount)
app.get('/api/academicMetrics/gradeDistribution/ks2',getKS2GradeCount)
app.get('/api/academicMetrics/gradeDistribution/ks1/yearOnYear',getKS1GradeCountYearOnYear)
app.get('/api/academicMetrics/gradeDistribution/ks2/yearOnYear',getKS2GradeCountYearOnYear)

app.get('/api/behavioralMetrics/incidentRate',getIncidentRate)
app.get('/api/behavioralMetrics/ResolutionRate',getResolutionRate)
app.get('/api/behavioralMetrics/top5BehaviorIncidents',getTop5BehaviorIncidents)
app.get('/api/engagementMetrics/participationRate',getParticipationRate)
app.get('/api/engagementMetrics/getTimeToResolution',getTimeToResolution)


app.use((error,req,res,next)=>{
    if(error.status && error.msg){
        res.status(error.status).send(error.msg)
    }
})

module.exports = app