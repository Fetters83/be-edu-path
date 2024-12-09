const express = require('express');
const app = express();

const cors = require('cors');
const { testController } = require('./controllers/test.controller');
const { getStudents, getStudentById } = require('./controllers/students.controller');
const { getBehaviourLogs, getBehaviorLogsByStudentId } = require('./controllers/behaviour-logs.controller');
const { getSuggestions, getSuggestionsByStudentId } = require('./controllers/suggestions.controllers');
const { getAverageAttendance, getLowestAttenders } = require('./controllers/average-attendance.controller');
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



app.use((error,req,res,next)=>{
    if(error.status && error.msg){
        res.status(error.status).send(error.msg)
    }
})

module.exports = app