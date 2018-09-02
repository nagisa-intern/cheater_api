const comicdb = require('./utils')

module.exports = {
    getById: async id => {
        const res = await comicdb(
            `select * from page where id = ?`,
            id
        )
        return res[0]
    },
    // n + 1になってるのはDB設計をミスったため
    getListByManyEpisodes: async episodeIds => {
        if (episodeIds.length === 0) {
            return []
        }
        const episodes = await comicdb(
            `select * from comic_data where id in (${episodeIds.join(',')})`
        )
        const pairs = Array.from(episodes)
            .map(episode => [episode.episode, episode.comic_id])
        return Promise.all(pairs.map(async pair => {
            const res = Array.from(await comicdb(
                `select * from page where episode = ? and comic = ?`,
                pair
            ))
            return res[0]
        }))
    },
    getListByRanking: async number => {
        return comicdb(
            `select * from page order by time desc limit ?`,
            number
        )
    },
    updateTimeById: async (id, time) => {
        console.log('udpate', time, id)
        return comicdb(
            `update page set time = ? where id = ?`,
            [time, id]
        )
    },
    getListByEpisodeAndComicId: async (episode, comic_id) => {
        return comicdb(
            `select * from page where episode = ? and comic = ?`,
            [episode, comic_id]
        )
    }
}