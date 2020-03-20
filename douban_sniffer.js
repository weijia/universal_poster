var doubanSnifferUrlPattern = "/interest";
var doubanSniffer = {
    sitePattern: "*://movie.douban.com/j/subject/*",
    name: "douban.com",
    // onRequest: function(info) {
    //     var starUrl = info.url;
    //     starUrl
    //     return {tags: "collect", 
    //             postingUrl: info.url.substring(0, info.url.length - doubanSnifferUrlPattern.length),
    //             description: info.url.substring(0, info.url.length - doubanSnifferUrlPattern.length),
    //             capturer: this}
    // },
    onRequest: function(info, callback) {
        var starUrl = info.url;
        chrome.tabs.get(info.tabId, function(tab){
            var postingItem = {tags: ["collect"],
                postingUrl: info.url.substring(0, info.url.length - doubanSnifferUrlPattern.length).replace("/j/subject", '/subject'),
                description: tab.title,
                capturer: this};
            console.log("douban posting:", postingItem);
            callback(postingItem);
        });
        return false;
    },
    matchUrl: function(info) {
        if((info.url.indexOf("movie.douban.com") != -1) &&
            (info.url.indexOf(doubanSnifferUrlPattern, info.url.length - doubanSnifferUrlPattern.length) !== -1))
            //console.log("Found", this.onRequest(info));
            return true;
        return false;
    }
};