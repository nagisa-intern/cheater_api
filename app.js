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

app.get('/api/v1/',(req,res) => {
    res.json({
        message:"Hello,world"
    })
})

app.listen(port)
console.log('listen on port ' + port)