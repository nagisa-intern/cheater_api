const comicdb = require('./index')

module.exports = {
    getById: async id => {
        // WARN: sql injection
        console.log(334)
        return new Promise((resolve, reject) => {
            comicdb.query(
                `select * from comics where ?`,
                { id },
                (error, results, fields) => {
                    resolve(results[0])
                    if (error) {
                        reject(error)
                    }
                }
            )    
        })
    }
}