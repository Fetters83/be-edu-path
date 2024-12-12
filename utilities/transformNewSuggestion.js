function transformNewSuggestion(newSuggestion) {
    const transformedSuggestion = { ...newSuggestion };
  
    if (transformedSuggestion.studentId) {
      transformedSuggestion.studentId = parseInt(transformedSuggestion.studentId, 10);
    }
  
    if (transformedSuggestion.date) {
      transformedSuggestion.date = new Date(transformedSuggestion.date);
    }
  
    if (transformedSuggestion.behaviorLogId) {
      transformedSuggestion.behaviorLogId = parseInt(transformedSuggestion.behaviorLogId, 10);
    }
  
    if (transformedSuggestion.followUpRequired) {
        
        if(transformedSuggestion.followUpRequired === 'Yes'){
            transformedSuggestion.followUpRequired =true
        } else {
            transformedSuggestion.followUpRequired =false
        }
     
    }
  
    return transformedSuggestion;
  }
  
  module.exports = {transformNewSuggestion };
  