const checkNewStudentValidity = (newStudent)=>{

    const studentObj = Object.keys(newStudent)

    if (student==='yearGroup' && typeof newStudent[student] !='number') return false;
    
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

}