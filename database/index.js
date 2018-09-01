const mysql = require('mysql')

const comicdb = mysql.createConnection({
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'bb72568e1ffe6c',
    password: '9c7cce5f',
    database: 'heroku_5a61d935653267e'
})

module.exports = comicdb