const episode = reqlib('database/episodes')
const { Episode } = reqlib('models/_episode')

module.exports = {
    getById: async id => {
        const data = await episode.getById(id)
        return new Episode(data)
    }
}