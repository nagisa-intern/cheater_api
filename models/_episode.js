const { Pages } = reqlib('models/_page')
const _pages = reqlib('database/pages')

class Episode {
    constructor (data) {
        this._data = JSON.parse(JSON.stringify(data))
    }
    serialize () {
        const data = Object.assign({}, this._data)
        /* if (data.pages && data.pages.length() > 0) {
            data.pages = data.pages.serialize()
        } */
        if (data.comic) {
            data.comic = data.comic.serialize()
        }
        return data
    }
    appendPage (page) {
        if (!this._data.pages) {
            this._data.pages = new Pages([])
        }
        this._data.pages.appendPage(page)
    }
    getEpisodeId () {
        return this._data.id
    }
    getComicId () {
        return this._data.comic_id
    }
    getEpisodeNum () {
        return this._data.episode
    }
    async injectPages () {
        const datas = await _pages
            .getListByEpisodeAndComicId(this.getEpisodeNum(), this.getComicId())
        this._data.pages = datas
        return this
    }
}

class Episodes {
    constructor (episodes) {
        this._data = {}
        this._data.keys = []
        this._data.values = episodes.map((episode, index) => {
            const _episode = new Episode(episode)
            this._data.keys[index] = _episode.getEpisodeId()
            return _episode
        })
        this.each = {}
    }
    serialize () {
        return this._data.values.map(episode => episode.serialize())
    }
    length () {
        return this._data.values.length
    }
    forEach (func) {
        this._data.values.forEach(func)
    }
    appendEpisode (episode) {
        this._data.values.push(episode)
        this._data.keys.push(episode.getEpisodeId())
    }
    getEpisodeIds () {
        return this._data.keys
    }
    getEpisodeSerials () {
        return this._data.values.map(episode => episode.getComicId() + '_' + episode.getEpisodeNum())
    }
    getByIndex (index) {
        return this._data.values[index]
    }
    async injectPagesForEach () {
        if (this.each.pages) {
            // もう既にあったらリセット
            this.each.pages = new Pages([])
        }
        // episodesのうち少なくとも1つと関連を持つページをすべて取得
        const pages = await _pages.getListByManyEpisodes(this._data.keys)
        // pagesは重複のない生データ
        this.each = Object.assign(this.each, {
            pages: new Pages(pages)
        })
        // <Pages>.forEachはpageオブジェクトについて行われる
        this.each.pages.forEach(page => {
            // page : Page
            const episodeId = page.getEpisodeId()
            const targetIndex = this._data.keys.indexOf(episodeId)
            if (targetIndex < 0){
                return
            }
            const targetEpisode = this._data.values[targetIndex]
            // targetEpisode : Episode
            targetEpisode.appendPage(page)
        })
        /**
         * これにより、
         * 各episodeは、this.each.pagesへの参照を保持することになる
         * 
         * それによって、
         * episodes.each.pages(:Pages).injectComicForEach()
         * を実行すると、参照先のpageが更新されるため、
         * 計算コストはかなり抑えられる
         */
        return this
    }
}

module.exports = {
    Episode,
    Episodes
}