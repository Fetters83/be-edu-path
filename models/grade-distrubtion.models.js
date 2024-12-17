const {client,run} = require('../connection')

//model for KS1 grad count visual
const fetchKS1GradeCount = async (academicYear,yearGroup)=>{

  //store regex value against variable regex for the format YYYY/MM
  const regex = /^[0-9]{4}\/[0-9]{2}$/

  //If academicYear is not undefined but fails the regex test, throw an error back to the server
  if (academicYear && regex.test(academicYear)===false) {
      throw { status: 400, msg: "academicYear must be of type string and in the correct format." };
    }
   
//if yearGroup is undefined and, once parsed, is not a number throw an error back to the server
      if (yearGroup && isNaN(parseInt(yearGroup))) {
        throw { status: 400, msg: "yearGroup must be of type integer." };
      }

   
   
    
    try {
    //ensure a connection to the mongo db client
      await run();
      //initialise filter for use in the mongo db query
        let filter={}
 
      //If yearGroup or academicYear have been passed in the request query, append to the filter object
        if(academicYear){
            filter.academicYear = academicYear;
        }

        if(yearGroup){
            filter.yearGroup = parseInt(yearGroup)
            
        }

        //execute the mongo db query
    const records = await client
      .db("eduPath")
      .collection("students")
      .find(filter)
      .toArray();

      //filter the number of records based on the query result to get the total number of grade types
     const readingGradesBESArr = records.filter((record)=>{record.ks1ReadingGrade;record.ks1ReadingGrade==='BES'})
     const readingGradesWESArr = records.filter((record)=>record.ks1ReadingGrade==='WES')
  
     const mathsGradesBESArr = records.filter((record)=>record.ks1MathsGrade==='BES')
     const mathsGradesWESArr = records.filter((record)=>record.ks1MathsGrade==='WES')

     const gpsGradesBESArr = records.filter((record)=>record.ks1GPSGrade==='BES')
     const gpsGradesWESArr = records.filter((record)=>record.ks1GPSGrade==='WES')
  
     //assign the result to a variable
           let resultsObj = {
            AcademicYear:academicYear? academicYear:"All Academic Years",
            YearGroup:yearGroup? Number(yearGroup):"All Year Groups",
            keyStage:1,
            ReadingBESCount:readingGradesBESArr.length,
            ReadingWESCount:readingGradesWESArr.length,
            MathsBESCount:mathsGradesBESArr.length,
            MathsWESCount:mathsGradesWESArr.length,
            GpsBESCount:gpsGradesBESArr.length,
            GpsWESCount:gpsGradesWESArr.length,
        
    }
    //return the result
     return resultsObj

    } catch (error) {
        console.log(error)
        throw error
    }

}

//model for KS2 Grade count visual
const fetchKS2GradeCount = async (academicYear)=>{
//store regex value against variable regex for the format YYYY/MM
  const regex = /^[0-9]{4}\/[0-9]{2}$/


//If academicYear is not undefined but fails the regex test, throw an error back to the server
  if (academicYear && regex.test(academicYear)===false) {
      throw { status: 400, msg: "academicYear must be of type string and in the correct format." };
    }
     
    try {
      
    //ensure a connection to the mongo db client
    await run();

      //initalise filter with yearGroup 6 - only year 6 available for results
      let filter={yearGroup:Number(6)} 
 
      if(academicYear){
          filter.academicYear = academicYear;
      }

      //execute query with filter
    const records = await client
      .db("eduPath")
      .collection("students")
      .find(filter)
      .toArray();

      //if no records returned throw an error
      if(records.length===0){
        throw({status:400,msg:'No student records found.'})
      }

       //filter the number of records based on the query result to get the total number of grade types
      const readingGradesGDSArr = records.filter((record)=>record.readingGrade==='GDS')
      const readingGradesEXSArr = records.filter((record)=>record.readingGrade==='EXS')
      const readingGradesWTArr = records.filter((record)=>record.readingGrade==='WT')
      const mathsGradesGDSArr = records.filter((record)=>record.mathsGrade==='GDS')
      const mathsGradesEXSArr = records.filter((record)=>record.mathsGrade==='EXS')
      const mathsGradesWTArr = records.filter((record)=>record.mathsGrade==='WT')
      const gpsGradesGDSArr = records.filter((record)=>record.gpsGrade==='GDS')
      const gpsGradesEXSArr = records.filter((record)=>record.gpsGrade==='EXS')
      const gpsGradesWTArr = records.filter((record)=>record.gpsGrade==='WT') 
      const scienceGradesGDSArr = records.filter((record)=>record.scienceGrade==='GDS')
      const scienceGradesEXSArr = records.filter((record)=>record.scienceGrade==='EXS')
      const scienceGradesWTArr = records.filter((record)=>record.scienceGrade==='WT') 


      //return the object with the results to the server
      return{
        AcademicYear:academicYear? academicYear:"All Academic Years",
        YearGroup:6,
        keyStage:2,
        ReadingGDSCount:readingGradesGDSArr.length,
        ReadingEXSCount:readingGradesEXSArr.length,
        ReadingWTCount:readingGradesWTArr.length,
        MathsGDSCount:mathsGradesGDSArr.length,
        MathsEXSCount:mathsGradesEXSArr.length,
        MathsWTCount:mathsGradesWTArr.length,
        GpsGDSCount:gpsGradesGDSArr.length,
        GpsEXSCount:gpsGradesEXSArr.length,
        GpsWTCount:gpsGradesWTArr.length,
        scienceGDSCount:scienceGradesGDSArr.length,
        scienceEXSCount:scienceGradesEXSArr.length,
        scienceWTCOunt:scienceGradesWTArr.length
    }

} catch(error){
  
    throw error
}
}

//model for KS1 grade count year on year
const fetchKS1GradeCountYearOnYear = async (yearGroup)=>{

  //if year group is undefined throw an error
        if(!yearGroup){
            throw({status:400,msg:"yearGroup must be included"})
        }

        //if yearGroup, once parsed, is not of data type number throw an error
       if (isNaN(parseInt(yearGroup))) {
        throw { status: 400, msg: "yearGroup must be of type string." };
      }

      //initialise an empty array to store the results
      let resultsArray = []
   
        try {
        //ensure a connection to the mongo db client
        await run();

        //execute mongo db query to retrieve all student results query
        const records = await client
          .db("eduPath")
          .collection("students")
          .find()
          .toArray();

          //if query returns no result throw an error
          if (records.length === 0) {
            throw { status: 400, msg: "No student records found." };
          }
          
          //create an new array with all academicYear values
          const academicYearsArr = records.map((record) => record.academicYear);
      
           //if query returns no result throw an error
          if (academicYearsArr.length === 0) {
            throw {
              status: 400,
              msg: "No student records found with academic year values.",
            };
          }
          //remove duplicate years with the new Set function
          const academicYearUnique = new Set(academicYearsArr);
          //push the unique years in the array uniqueAcademicYearsArray
          const uniqueAcademicYearsArray = [...academicYearUnique];

          
          //loop through each unique academic year
          for(let i = 0; i<uniqueAcademicYearsArray.length;i++){

            try {
                //on each iteration fetch only those KS1 grade counts where the accadmic year is equal to the current iteration
                const records = await fetchKS1GradeCount(uniqueAcademicYearsArray[i],parseInt(yearGroup))
                resultsArray.push(records)
                
            } catch (error) {
                throw error
            }
          }
          //return the array as a result to the server
          return resultsArray
     
    } catch (error) {
  
        throw error
    }

}
//model for KS2 grade count year on year
const fetchKS2GradeCountYearOnYear = async ()=>{

   //initialise an empty array to store the results
    let resultsArray = []

    try {
         //ensure a connection to the mongo db client
        await run();

         //execute mongo db query to retrieve all student results query
        const records = await client
          .db("eduPath")
          .collection("students")
          .find()
          .toArray();

         //if query returns no result throw an error
          if (records.length === 0) {
            throw { status: 400, msg: "No student records found." };
          }
      
            //create an new array with all academicYear values
          const academicYearsArr = records.map((record) => record.academicYear);
          
          //if query returns no result throw an error
          if (academicYearsArr.length === 0) {
            throw {
              status: 400,
              msg: "No student records found with academic year values.",
            };
          }
           //remove duplicate years with the new Set function
          const academicYearUnique = new Set(academicYearsArr);
          //push the unique years in the array uniqueAcademicYearsArray
          const uniqueAcademicYearsArray = [...academicYearUnique];
    
          try {

            //loop through each unique academic year
            for(let i=0;i<uniqueAcademicYearsArray.length;i++){
               //on each iteration fetch only those KS2 grade counts where the accadmic year is equal to the current iteration
                const records = await fetchKS2GradeCount(uniqueAcademicYearsArray[i])
                resultsArray.push(records)
              

            }


            
          } catch (error) {

            throw error
         }
          //return the array as a result to the server
          return resultsArray;

    } catch (error) {
        throw error
    }
}

module.exports = {fetchKS1GradeCount,fetchKS2GradeCount,fetchKS1GradeCountYearOnYear,fetchKS2GradeCountYearOnYear }