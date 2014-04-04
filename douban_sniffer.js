var doubanSnifferUrlPattern = "/interest";
var doubanSniffer = {
    name: "douban.com",
    onRequest: function(info) {
        var starUrl = info.url;
        starUrl
        return {tags: "collect", 
                postingUrl: info.url.substring(0, info.url.length - doubanSnifferUrlPattern.length),
                description: info.url.substring(0, info.url.length - doubanSnifferUrlPattern.length),
                capturer: this}
    },
    matchUrl: function(info) {
        if((info.url.indexOf("movie.douban.com") != -1) &&
            (info.url.indexOf(doubanSnifferUrlPattern, info.url.length - doubanSnifferUrlPattern.length) !== -1))
            //console.log("Found", this.onRequest(info));
            return true;
        return false;
    }
};