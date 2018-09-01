const comicdb = require('./utils')

module.exports = {
    // 中間テーブル
    getListByManyComics: async comicIds => {
        if (!comicIds || comicIds.length === 0) {
            return []
        }
        return comicdb(
            `select * from comic_author where comic_id in (${comicIds.join(',')})`,
            undefined
        )
    }
}