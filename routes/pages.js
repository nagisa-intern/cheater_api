module.exports = router => {
    router.post('/pages/:id', (req, res) => {
        // TODO: 更新
        // reqとつなぐ
        const page_id = 1
        const milisec = 1000
        let page = Page.getById(page_id)
        page = page.addTime(milisec)
        page.save()
        res.json({})
    })
    return router
}