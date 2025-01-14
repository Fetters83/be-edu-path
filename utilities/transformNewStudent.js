const transformNewStudent = (newStudent)=>{

     //iterate through all newStudentObj keys
    const studentObj = Object.keys(newStudent)
  
     //transform the below values from string to the correct data types
    studentObj.forEach((student)=>{

        if (student==='yearGroup') newStudent[student] = parseInt(newStudent[student], 10);
        if (student==='ks1ReadingScore' && newStudent[student]>0 ) newStudent[student] = parseInt(newStudent[student], 10);
        if (student==='ks1MathsScore' && newStudent[student]>0 ) newStudent[student] = parseInt(newStudent[student], 10);
        if (student==='ks1GPSScore' && newStudent[student]>0 ) newStudent[student] = parseInt(newStudent[student], 10);
        if (student==='readingScore' && newStudent[student]>0 ) newStudent[student] = parseInt(newStudent[student], 10);
        if (student==='mathsScore' && newStudent[student]>0 ) newStudent[student] = parseInt(newStudent[student], 10);
        if (student==='gpsScore' && newStudent[student]>0 ) newStudent[student] = parseInt(newStudent[student], 10);
        if (student==='writingScore' && newStudent[student]>0 ) newStudent[student] = parseInt(newStudent[student], 10);
        if (student==='scienceScore' && newStudent[student]>0 ) newStudent[student] = parseInt(newStudent[student], 10);
        if (student==='mtcScore' && newStudent[student]>0 ) newStudent[student] = parseInt(newStudent[student], 10);   
        if (student==='attendance_autumnTerm' && newStudent[student]>0) newStudent[student]= parseFloat(newStudent[student]);
        if (student==='attendance_springTerm' && newStudent[student]>0) newStudent[student]= parseFloat(newStudent[student]);
        if (student==='attendance_summerTerm' && newStudent[student]>0) newStudent[student]= parseFloat(newStudent[student]);
        if (student==='date') newStudent[student] = new Date(newStudent[student])
        if (student==='dateResolved') newStudent[student] = new Date(newStudent[student])
        if (student==='followUpRequired') newStudent[student] = "true";
        if (student==='parentContactPhone') newStudent[student] = String(newStudent[student])

        
    })

    //return the transformed object
    return newStudent
}

module.exports = {transformNewStudent}