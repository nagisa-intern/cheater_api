const { Episodes } = reqlib('models/_episode')
const { Comics } = reqlib('models/_comic')
const _episodes = reqlib('database/episodes')
const _comics = reqlib('database/comics')
const _pages = reqlib('database/pages')

class Page {
    constructor (data) {
        this._data = JSON.parse(JSON.stringify(data))
    }
    serialize () {
        const data = Object.assign({}, this._data)
        // "_"をつけるのは、既にデータベースのカラムとして使用されてしまっているため
        if (data._episode) {
            data.episode = data._episode.serialize()
            delete data._episode
        }
        if (data._comic) {
            data.comic = data._comic.serialize()
            delete data._comic
        }
        return data
    }
    getPageId () {
        return this._data.id
    }
    getEpisodeSerial () {
        return this._data.comic + '_' + this._data.episode
    }
    getComicId () {
        return this._data.comic
    }
    addTime (milisec) {
        // データベースはfloatのため
        this._data.time = Number(this._data.time) + milisec / 1000
    }
    setEpisode (episode) {
        this._data._episode = episode
    }
    setComic (comic) {
        this._data._comic = comic
    }
    async saveTime () {
        await _pages.updateTimeById(this._data.id, this._data.time)
    }
}

class Pages {
    constructor (pages) {
        this._data = {}
        this._data.keys = []
        this._data.values = pages.map((page, index) => {
            const _page = new Page(page)
            this._data.keys[index] = _page.getPageId()
            return _page
        })
        this.each = {}
    }
    serialize () {
        return this._data.values.map(page => page.serialize())
    }
    appendPage (page) {
        this._data.values.push(page)
        this._data.keys.push(page.getPageId())
    }
    length () {
        return this._data.values.length
    }
    forEach (func) {
        this._data.values.forEach(func)
    }
    async injectEpisodeForEach () {
        if (this.each.episode) {
            // もう既にあったらリセット
            this.each.episode = new Episodes([])
        }
        // pagesのうち少なくとも1つと関連を持つepisodeをすべて取得
        const episodes = await _episodes.getListByManyPages(this._data.keys)
        // episodesは重複のない生データ
        this.each = Object.assign(this.each, {
            episode: new Episodes(episodes)
        })
        const episodeSerials = this.each.episode.getEpisodeSerials()
        this.forEach(page => {
            const targetEpisodeIndex = episodeSerials.indexOf(page.getEpisodeSerial())
            const targetEpisode = this.each.episode.getByIndex(targetEpisodeIndex)
            page.setEpisode(targetEpisode)
        })
        return this
    }
    async injectComicForEach () {
        if (this.each.comic) {
            // もう既にあったらリセット
            this.each.comic = new Comics([])
        }
        // pagesのうち少なくとも1つと関連を持つcomicをすべて取得
        const comics = await _comics.getListByManyIds(this._data.values.map(page => page.getComicId()))
        // episodesは重複のない生データ
        this.each = Object.assign(this.each, {
            comic: new Comics(comics)
        })
        const comicIds = this.each.comic.getComicIds()
        this.forEach(page => {
            const targetComicIndex = comicIds.indexOf(page.getComicId())
            const targetComic = this.each.comic.getByIndex(targetComicIndex)
            page.setComic(targetComic)
        })
        return this
    }
}

module.exports = {
    Page,
    Pages
}