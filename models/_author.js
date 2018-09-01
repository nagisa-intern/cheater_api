const _authors = reqlib('database/authors')

class Author {
    constructor (data) {
        this._data = JSON.parse(JSON.stringify(data))
    }
    serialize () {
        const data = Object.assign({}, this._data)
        return data
    }
    getAuthorId () {
        return this._data.id
    }
}

class Authors {
    constructor (authors) {
        this._data = {}
        this._data.keys = []
        this._data.values = authors.map((author, index) => {
            const _author = new Author(author)
            this._data.keys[index] = _author.getAuthorId()
            return _author
        })
        this.each = {}
    }
    serialize () {
        return this._data.values.map(author => author.serialize())
    }
    length () {
        return this._data.values.length
    }
    getAuthorIds () {
        return this._data.keys
    }
    getByIndex (index) {
        return this._data.values[index]
    }
    appendAuthor (author) {
        this._data.values.push(author)
        this._data.keys.push(author.getAuthorId())
    }
}


module.exports = {
    Author,
    Authors
}