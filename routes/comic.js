module.exports = router => {
    router.get('/comics/:id', (req,res) => {
        // TODO: 更新
        // reqとつなぐ
        const id = 1
        let comic = Comic.getById(id)
        comic = comic
            .injectAuthors()
            .injectEpisodes()
        // comic.episodesで、comic
        comic = comic.episodes.injectPagesForEach()
    })
    return router
}