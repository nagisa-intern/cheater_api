const Episode = reqlib('models/episode')

module.exports = router => {
    router.get('/episodes/:id', async (req, res) => {
        const episode_id = Number(req.params.id)
        const episode = await Episode.getById(episode_id)
        // -> : Episode
        await episode.injectPages()
        res.json(episode.serialize())
    })
    return router
}