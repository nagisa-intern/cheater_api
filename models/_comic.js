const _authors = reqlib('database/authors')
const _episodes = reqlib('database/episodes')
const _comics_authors = reqlib('database/comics_authors')
const { Authors } = reqlib('models/_author')
const { Episodes } = reqlib('models/_episode')

class Comic {
    constructor (data) {
        this._data = JSON.parse(JSON.stringify(data))
    }
    serialize () {
        const data = Object.assign({}, this._data)
        if (data.episodes && data.episodes.length() > 0) {
            data.episodes = data.episodes.serialize()
        }
        if (data.authors && data.authors.length() > 0) {
            data.authors = data.authors.serialize()
        }
        return data
    }
    getComicId () {
        return this._data.id
    }
    appendAuthor (author) {
        if (!this._data.authors) {
            this._data.authors = new Authors([])
        }
        this._data.authors.appendAuthor(author)
    }
    episodes () {
        return this._data.episodes
    }
    async injectAuthors () {
        const authors = await _authors.getListByComicId(this._data.id)
        this._data.authors = new Authors(authors)
        return this
    }
    async injectEpisodes () {
        const episodes = await  _episodes.getListByComicId(this._data.id)
        this._data.episodes = new Episodes(episodes)
        return this
    }
}

class Comics {
    constructor (comics) {
        this._data = {}
        this._data.keys = []
        this._data.values = comics.map((comic, index) => {
            const _comic = new Comic(comic)
            this._data.keys[index] = _comic.getComicId()
            return _comic
        })
        this.each = {}
    }
    serialize () {
        return this._data.values.map(comic => comic.serialize())
    }
    map (func) {
        return this._data.values.map(func)
    }
    getComicIds () {
        return this._data.keys
    }
    getByIndex (index) {
        return this._data.values[index]
    }
    async injectAuthorsForEach () {
        if (this.each.authors) {
            // もう既にあったらリセット
            this.each.authors = new Authors([])
        }
        // authorsのうち少なくとも1つと関連を持つページをすべて取得
        const authors = await _authors.getListByManyComics(this._data.keys)
        // authorsは重複のない生データ
        this.each = Object.assign(this.each, {
            authors: new Authors(authors)
        })
        const comics_authors_rows = await _comics_authors.getListByManyComics(this._data.keys)
        comics_authors_rows.forEach(row => {
            const targetComicId = row.comic_id
            const targetComicIndex = this._data.keys.indexOf(targetComicId)
            const targetComic = this._data.values[targetComicIndex]
            const targetAuthorId = row.author_id
            const targetAuthorIndex = this.each.authors.getAuthorIds().indexOf(targetAuthorId)
            const targetAuthor = this.each.authors.getByIndex(targetAuthorIndex)
            targetComic.appendAuthor(targetAuthor)
        })
    }
}

module.exports = {
    Comic,
    Comics
}