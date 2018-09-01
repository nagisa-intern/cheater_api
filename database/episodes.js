const comicdb = require('./utils')

module.exports = {
    getListByComicId: async id => {
        return comicdb(
            `select * from comic_data where comic_id = ?`,
            id
        )
    },
    getById: async id => {
        const res = await comicdb(
            `select * from comic_data where id = ?`,
            id
        )
        return res[0]
    },
    // n + 1になってるのはDB設計をミスったため
    getListByManyPages: async pageIds => {
        if (pageIds.length === 0) {
            return []
        }
        const pages = Array.from(await comicdb(
            `select * from page where id in (${pageIds.join(',')})`
        ))
        const _episodeDetails = pages.map(page => [page.episode, page.comic])
        
        const episodeDetailSerial = _episodeDetails.map(episodeDetail => episodeDetail.join('_'))

        const episodeDetails = _episodeDetails.filter((episodeDetail, nowIdx) => {
            const nowSerial = episodeDetail.join('_')
            return episodeDetailSerial.indexOf(nowSerial) === nowIdx
        })

        return Promise.all(episodeDetails.map(async episodeDetail => {
            return Array.from(await comicdb(
                `select * from comic_data where episode = ? and comic_id = ?`,
                episodeDetail
            ))[0]
        }))
    }
}