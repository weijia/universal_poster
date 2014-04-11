var githubSniffer = {
    sitePattern: "*://github.com/*/star*",
    name: "github.com",
    onRequest: function(info) {
        var starUrl = info.url;
        starUrl
        return {tags: "star", 
                postingUrl: info.url.substring(0, info.url.length - "/star".length),
                description: info.url.substring(0, info.url.length - "/star".length),
                capturer: this}
    },
    matchUrl: function(info) {
        if((info.url.indexOf("https://github.com/") == 0) &&
            (info.url.indexOf("/star", info.url.length - "/star".length) !== -1))
            //console.log("Found", this.onRequest(info));
            return true;
        return false;
    }
};