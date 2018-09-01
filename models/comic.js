const comics = reqlib('database/comics')
const { Comic, Comics } = reqlib('models/_comic')

module.exports = {
    getById: async id => {
        const data = await comics.getById(id)
        return new Comic(data)
    },
    getList: async number => {
        const data = await comics.firsts(number)
        return new Comics(data)
    }
}