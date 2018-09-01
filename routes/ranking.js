module.exports = router => {
    router.get('/ranking', (req, res) => {
        // TODO: 更新
        // reqとつなぐ
        const number = 5
        let pages = Page.getListByRanking(number)
        // Pages objectがかえる
        pages = pages
            .injectEpisodeForEach()
            .injectComicForEach()
        // pages.each.comicでComics objectがかえる
        // comicsはそれぞれ入る
        pages = pages.each.comic.injectAuthorsForEach()
        res.json(pages.serialize())
    })
    return router
}