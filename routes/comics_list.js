module.exports = router => {
    router.get('/comics_list', (req, res) => {
        // TODO: 更新
        // reqとつなぐ
        const number = 5
        let comics = Comic.getList(number)
        // Comics objectがかえる
        comics = comics
            .injectAuthorsForEach()
        res.json(comics.serialize())
    })
    return router
}