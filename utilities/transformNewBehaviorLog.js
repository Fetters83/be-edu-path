const transformNewBehaviorLog = (newBehaviorLog)=>{

    //iterate through all newObjectLog keys
    const behaviorLogObj = Object.keys(newBehaviorLog)
  
    behaviorLogObj.forEach((behaviorLog)=>{

        //transform the below values from string to the correct data types
        if (behaviorLog==='studentId') newBehaviorLog[behaviorLog] = parseInt(newBehaviorLog[behaviorLog], 10);
        if (behaviorLog==='yearGroup' && newBehaviorLog[behaviorLog]>0 ) newBehaviorLog[behaviorLog] = parseInt(newBehaviorLog[behaviorLog], 10);
        if (behaviorLog==='date') newBehaviorLog[behaviorLog] = new Date(newBehaviorLog[behaviorLog])
        if (behaviorLog==='dateResolved' && newBehaviorLog[behaviorLog]!="") newBehaviorLog[behaviorLog] = new Date(newBehaviorLog[behaviorLog])
        if (behaviorLog==='followUpRequired') newBehaviorLog[behaviorLog] = "true";
    
        
    })
    //return the transformed object
    return newBehaviorLog
}

module.exports = {transformNewBehaviorLog}