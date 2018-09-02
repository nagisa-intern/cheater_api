const Page = reqlib('models/page')

module.exports = router => {
    router.get('/n_ranking', async (req, res) => {
        const number = Number(req.query.number) || 5
        const pages = await Page.getListByRanking(number)
        // -> : Pages
        await pages.injectEpisodeForEach()
        await pages.injectComicForEach()
        // pages.each.comic : Comics
        await pages.each.comic.injectAuthorsForEach()
        res.json(pages.serialize())
    })
    return router
}