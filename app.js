const express    = require('express')
const app        = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')
const comicdb = mysql.createConnection({
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'bb72568e1ffe6c',
    password: '9c7cce5f',
    database: 'heroku_5a61d935653267e'
})

comicdb.connect()

comicdb.query('select * from authors', (error, results, fields) => {
    console.log(results)
})

global.reqlib = require('app-root-path').require
global.reqroute = path => {
    return reqlib(path)(express.Router())
}

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