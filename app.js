const express = require('express');
const app = express();

const cors = require('cors');

const { getStudents, getStudentById, postNewStudent, updateStudent } = require('./controllers/students.controller');
const { getBehaviourLogs, getBehaviorLogsByStudentId, postNewBehaviorLog } = require('./controllers/behaviour-logs.controller');
const { getSuggestions, getSuggestionsByStudentId, postNewSuggestion, updateFollowUpRequired } = require('./controllers/suggestions.controllers');
const { getAverageAttendance, getLowestAttenders } = require('./controllers/average-attendance.controller');
const { getKS1GradeCount, getKS2GradeCount, getKS1GradeCountYearOnYear, getKS2GradeCountYearOnYear } = require('./controllers/grade-distribution.controller');
const { getIncidentRate, getResolutionRate, getTop5BehaviorIncidents } = require('./controllers/behavioral-metrics.controller');
const { getParticipationRate, getTimeToResolution } = require('./controllers/engagement-metrics.controller');
const { getPrimaryCategories, postNewPrimaryCategory } = require('./controllers/primary-categories.controller');
const { getSubCategories, postNewSubCategory } = require('./controllers/subcategories-controller');
const { getSeverities, postNewSeverity } = require('./controllers/severities.controller');
app.use(cors())
app.use(express.json());



app.get('/api/students',getStudents)
app.get('/api/students/:studentId',getStudentById)
app.post('/api/students',postNewStudent)
app.patch('/api/students/:studentId',updateStudent)

app.get('/api/behavior-logs',getBehaviourLogs)
app.get('/api/behavior-logs/:studentId',getBehaviorLogsByStudentId)
app.post('/api/behavior-logs',postNewBehaviorLog)

app.get('/api/suggestions',getSuggestions)
app.get('/api/suggestions/:studentId',getSuggestionsByStudentId)
app.post('/api/suggestions/',postNewSuggestion) 
app.patch('/api/suggestions/:suggestionId', updateFollowUpRequired);

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


app.get('/api/primaryCategories',getPrimaryCategories)
app.post('/api/primaryCategories',postNewPrimaryCategory)

app.get('/api/subCategories',getSubCategories)
app.post('/api/subCategories',postNewSubCategory)

app.get('/api/severities',getSeverities)
app.post('/api/severities',postNewSeverity)

app.use((error,req,res,next)=>{
    if(error.status && error.msg){
        res.status(error.status).send(error.msg)
    }
    next(error)
})
app.all('*',(req,res,next)=>{
    res.status(500).send({msg:'endpoint not found'})
})
module.exports = app