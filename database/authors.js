const comicdb = require('./utils')

module.exports = {
    getListByComicId: async id => {
        const rows = await comicdb(`select * from comic_author where comic_id = ?`, id)
        let ids = []
        for (let row of rows) {
            const authorId = row.author_id
            if (ids.indexOf(authorId) < 0) {
                ids.push(authorId)
            }
        }
        if (ids.length === 0) {
            return []
        }
        return comicdb(
            `select * from authors where id in (${ids.join(',')})`
        )
    },
    getListByManyComics: async comicIds => {
        if (comicIds.length === 0) {
            return []
        }
        const rows = await comicdb(
            `select * from comic_author where comic_id in (${comicIds.join(',')})`,
            comicIds
        )
        let ids = []
        for (let row of rows) {
            const authorId = row.author_id
            if (ids.indexOf(authorId) < 0) {
                ids.push(authorId)
            }
        }
        if (ids.length === 0) {
            return []
        }
        return comicdb(
            `select * from authors where id in (${ids.join(',')})`
        )
    }
}