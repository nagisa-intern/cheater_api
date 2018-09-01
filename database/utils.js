const comicdb = require('./index')

module.exports = async (query, placeholder) => {
    return new Promise((resolve, reject) => {
        comicdb.query(
            query,
            placeholder,
            (error, results, fields) => {
                if (error) {
                    reject(error)
                }
                resolve(Array.from(results))
            }
        )    
    })
}