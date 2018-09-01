const Page = reqlib('models/page')

module.exports = router => {
    router.post('/pages/:id', async (req, res) => {
        const page_id = Number(req.params.id)
        const milisec = Number(req.body.time)
        const page = await Page.getById(page_id)
        // -> : Page
        page.addTime(milisec)
        await page.saveTime()
        res.json({})
    })
    return router
}