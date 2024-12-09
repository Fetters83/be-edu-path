const {client,run} = require('../connection')

const fetchKS1GradeCount = async (academicYear,yearGroup)=>{

  const regex = /^[0-9]{4}\/[0-9]{2}$/

  if (academicYear && regex.test(academicYear)===false) {
      throw { status: 400, msg: "academicYear must be of type string and in the correct format." };
    }
   

      if (yearGroup && isNaN(parseInt(yearGroup))) {
        throw { status: 400, msg: "yearGroup must be of type integer." };
      }

   
   
    
    try {

     
        let filter={}
 
 
        if(academicYear){
            filter.academicYear = academicYear;
        }

        if(yearGroup){
            filter.yearGroup = parseInt(yearGroup)
            
        }

 
    await run();
    const records = await client
      .db("eduPath")
      .collection("students")
      .find(filter)
      .toArray();

     const readingGradesBESArr = records.filter((record)=>{record.ks1ReadingGrade;record.ks1ReadingGrade==='BES'})
     const readingGradesWESArr = records.filter((record)=>record.ks1ReadingGrade==='WES')
  
     const mathsGradesBESArr = records.filter((record)=>record.ks1MathsGrade==='BES')
     const mathsGradesWESArr = records.filter((record)=>record.ks1MathsGrade==='WES')

     const gpsGradesBESArr = records.filter((record)=>record.ks1GPSGrade==='BES')
     const gpsGradesWESArr = records.filter((record)=>record.ks1GPSGrade==='WES')
  
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

     return resultsObj

    } catch (error) {
        console.log(error)
        throw error
    }

}


const fetchKS2GradeCount = async (academicYear)=>{

  const regex = /^[0-9]{4}\/[0-9]{2}$/



  if (academicYear && regex.test(academicYear)===false) {
      throw { status: 400, msg: "academicYear must be of type string and in the correct format." };
    }
     
    try {
      
     
     let filter={yearGroup:Number(6)} 
 
        if(academicYear){
            filter.academicYear = academicYear;
        }


 
    await run();
    const records = await client
      .db("eduPath")
      .collection("students")
      .find(filter)
      .toArray();

      if(records.length===0){
        throw({status:400,msg:'No student records found.'})
      }

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
    console.log(error)
    throw error
}
}

const fetchKS1GradeCountYearOnYear = async (yearGroup)=>{

        if(!yearGroup){
            throw({status:400,msg:"yearGroup must be included"})
        }

       if (isNaN(parseInt(yearGroup))) {
        throw { status: 400, msg: "yearGroup must be of type string." };
      }

      let resultsArray = []
   
        try {

        await run();
        const records = await client
          .db("eduPath")
          .collection("students")
          .find()
          .toArray();

          if (records.length === 0) {
            throw { status: 400, msg: "No student records found." };
          }
      
          const academicYearsArr = records.map((record) => record.academicYear);
      
          if (academicYearsArr.length === 0) {
            throw {
              status: 400,
              msg: "No student records found with academic year values.",
            };
          }
          //create unique values with set
          const academicYearUnique = new Set(academicYearsArr);
          const uniqueAcademicYearsArray = [...academicYearUnique];

          

          for(let i = 0; i<uniqueAcademicYearsArray.length;i++){

            try {

                const records = await fetchKS1GradeCount(uniqueAcademicYearsArray[i],parseInt(yearGroup))
                resultsArray.push(records)
                
            } catch (error) {
                throw error
            }
          }

          return resultsArray
     
    } catch (error) {
  
        throw error
    }

}

const fetchKS2GradeCountYearOnYear = async ()=>{

    let resultsArray = []

    try {
        
        await run();
        const records = await client
          .db("eduPath")
          .collection("students")
          .find()
          .toArray();

        
          if (records.length === 0) {
            throw { status: 400, msg: "No student records found." };
          }
      
          const academicYearsArr = records.map((record) => record.academicYear);
          console.log('years map created')
          if (academicYearsArr.length === 0) {
            throw {
              status: 400,
              msg: "No student records found with academic year values.",
            };
          }
          //create unique values with set
          const academicYearUnique = new Set(academicYearsArr);
          const uniqueAcademicYearsArray = [...academicYearUnique];
    
          try {

            for(let i=0;i<uniqueAcademicYearsArray.length;i++){
                const records = await fetchKS2GradeCount(uniqueAcademicYearsArray[i])
                resultsArray.push(records)
              

            }


            
          } catch (error) {

            console.log(error)

            throw error
            
          }

          return resultsArray;

    } catch (error) {
        console.log(error)
        throw error
    }
}

module.exports = {fetchKS1GradeCount,fetchKS2GradeCount,fetchKS1GradeCountYearOnYear,fetchKS2GradeCountYearOnYear }