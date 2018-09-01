const Comic = reqlib('models/comic')

module.exports = router => {
    router.get('/comics/:id', async (req,res) => {
        const id = Number(req.params.id)
        const comic = await Comic.getById(id)
        // -> : Comic
        await comic.injectAuthors()
        await comic.injectEpisodes()
        // comic.episodes : Episodes
        // await comic.episodes().injectPagesForEach()
        res.json(comic.serialize())
    })
    return router
}