const axios = require ("axios")

const testModel = async()=>{
    const response = await axios.get('https://api.artic.edu/api/v1/artworks')
    console.log(response.data)
    return response.data
}

module.exports = {testModel}