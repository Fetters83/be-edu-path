# be-edu-path

# edu-path

## Description
A backend server application for managing educational metrics and logs.

## Features
- Includes controllers for behavioral and engagement metrics.
- Connects to MongoDB for data storage.
- Supports CSV data conversion and API testing.

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd be-edu-path-main

2. Install dependancies
 - npm install

3. Run the application:

- npm start

## Dependancies

express
mongodb
axios
cors
csvtojson
dotenv
jest
supertest

## Mongo DB

1. - Create a Mongo DB Atlas Account
2. - Run the command NPM run seed to populate the collections

## API Endpoints

### Students
- `GET /api/students` - Retrieve all students.
- `GET /api/students/:studentId` - Retrieve a specific student by ID.
- `POST /api/students` - Add a new student.

### Behavior Logs
- `GET /api/behavior-logs` - Retrieve all behavior logs.
- `GET /api/behavior-logs/:studentId` - Retrieve behavior logs for a student.
- `POST /api/behavior-logs` - Add a new behavior log.

### Suggestions
- `GET /api/suggestions` - Retrieve all suggestions.
- `GET /api/suggestions/:studentId` - Retrieve suggestions for a student.
- `POST /api/suggestions` - Add a new suggestion.

### Academic Metrics
- `GET /api/academicMetrics/averageAttendance` - Get average attendance.
- `GET /api/academicMetrics/studentLowestAttenders` - List students with lowest attendance.
- `GET /api/academicMetrics/gradeDistribution/ks1` - Grade distribution for Key Stage 1.
- `GET /api/academicMetrics/gradeDistribution/ks2` - Grade distribution for Key Stage 2.
- `GET /api/academicMetrics/gradeDistribution/ks1/yearOnYear` - KS1 year-on-year grade distribution.
- `GET /api/academicMetrics/gradeDistribution/ks2/yearOnYear` - KS2 year-on-year grade distribution.

### Behavioral Metrics
- `GET /api/behavioralMetrics/incidentRate` - Incident rate metrics.
- `GET /api/behavioralMetrics/ResolutionRate` - Behavioral resolution rate.
- `GET /api/behavioralMetrics/top5BehaviorIncidents` - Top 5 behavior incidents.

### Engagement Metrics
- `GET /api/engagementMetrics/participationRate` - Participation rate metrics.
- `GET /api/engagementMetrics/getTimeToResolution` - Time to resolution metrics.

### Categories and Severities
- `GET /api/primaryCategories` - Retrieve primary categories.
- `POST /api/primaryCategories` - Add a primary category.
- `GET /api/subCategories` - Retrieve subcategories.
- `POST /api/subCategories` - Add a subcategory.
- `GET /api/severities` - Retrieve severities.
- `POST /api/severities` - Add a severity.
