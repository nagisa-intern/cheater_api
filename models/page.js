const pages = reqlib('database/pages')
const { Page, Pages } = reqlib('models/_page')

module.exports = {
    getListByRanking: async number => {
        const data = await pages.getListByRanking(number)
        return new Pages(data)
    },
    getById: async id => {
        const data = await pages.getById(id)
        return new Page(data)
    }
}