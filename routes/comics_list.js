const Comic = reqlib('models/comic')

module.exports = router => {
    router.get('/comics_list', async (req, res) => {
        const number = Number(req.query.number) || 6
        const comics = await Comic.getList(number)
        // -> : Comics
        await comics.injectAuthorsForEach()
        res.json(comics.serialize())
    })
    return router
}