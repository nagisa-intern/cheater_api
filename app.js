global.reqlib = require('app-root-path').require
global.reqroute = path => {
    return reqlib(path)(express.Router())
}

const express    = require('express')
const app        = express()
const bodyParser = require('body-parser')

const comics = reqlib('database/comics')

comics.getById(1).then(res => {
    console.log(res)
})

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

app.listen(port)
console.log('listen on port ' + port)