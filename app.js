global.reqlib = require('app-root-path').require
global.reqroute = path => {
    const router = express.Router()
    router._get = router.get
    router.get = (path, asyncFunc) => {
        router._get(path, async (req, res) => {
            console.log('start GET', path)
            try {
                await asyncFunc(req, res)                
            } catch (error) {
                console.error(error)
                const prof = {
                    p: req.params,
                    b: req.body,
                    q: req.query
                }
                console.log('req', prof)
            }
            console.log('end GET', path)
        })
    }
    router._post = router.post
    router.post = (path, asyncFunc) => {
        router._post(path, async (req, res) => {
            console.log('start POST', path)
            try {
                await asyncFunc(req, res)                
            } catch (error) {
                console.error(error)
                const prof = {
                    p: req.params,
                    b: req.body,
                    q: req.query
                }
                console.log('req', prof)
            }
            console.log('end POST', path)
        })
    }
    return reqlib(path)(router)
}

const express    = require('express')
const app        = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const port = process.env.PORT || 3000

// CORSを許可する
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    next()
})

app.use('/', reqroute('routes/index'))
app.use('/', reqroute('routes/pages'))
app.use('/', reqroute('routes/comics'))
app.use('/', reqroute('routes/comics_list'))
app.use('/', reqroute('routes/ranking'))
app.use('/', reqroute('routes/episodes'))

app.listen(port)
console.log('listen on port ' + port)