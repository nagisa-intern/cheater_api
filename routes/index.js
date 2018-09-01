module.exports = router => {
    router.get('/',(req,res) => {
        res.json({
            message:"Hello,world"
        })
    })
    return router
}