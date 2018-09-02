const axios = require('axios')
const Page = reqlib('models/page')

module.exports = router => {
    router.get('/n_ranking', async (req, res) => {
        const r = await axios.get('http://localhost:3001/get')
        const array = r.data.rank

        const pages = await Page.getListByIds(array)
        // -> : Pages
        await pages.injectEpisodeForEach()
        await pages.injectComicForEach()
        // pages.each.comic : Comics
        await pages.each.comic.injectAuthorsForEach()
        res.json(pages.serialize())
    })
    return router
}