const mysql = require('mysql')

const comicdb = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'nagisac2018',
    database: 'comicdb'
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