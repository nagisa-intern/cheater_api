const mysql = require('mysql')

const comicdb = mysql.createConnection({
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'bb72568e1ffe6c',
    password: '9c7cce5f',
    database: 'heroku_5a61d935653267e'
})

const handleDisconnect = () => {
    comicdb.connect()
    
    // error('PROTOCOL_CONNECTION_LOST')時に再接続
    comicdb.on('error', err => {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect()
        } else {
            throw err
        }
    })
}
handleDisconnect()

module.exports = comicdb