const comicdb = require('./utils')

module.exports = {
    getById: async id => {
        const list = await comicdb(
            `select * from comics where ?`,
            { id }
        )
        return list[0]
    },
    firsts: async number => {
        return comicdb(
            `select * from comics where id <= ?`,
            number
        )
    },
    getListByManyIds: async comicIds => {
        return comicdb(
            `select * from comics where id in (${comicIds.join(',')})`,
            undefined
        )
    }
}