var stackoverflowSniffer = {
    name: "stackoverflow.com",
    onRequest: function(info) {
        var starUrl = info.url;
        return {tags: "star", 
                postingUrl: info.url.substring(0, info.url.length - "/vote/5".length),
                description: info.url.substring(0, info.url.length - "/vote/5".length),
                capturer: this}
    },
    matchUrl: function(info) {
        if((info.url.indexOf("http://stackoverflow.com/posts/") == 0) &&
            (info.url.indexOf("/vote/5", info.url.length - "/vote/5".length) !== -1))
            //console.log("Found", this.onRequest(info));
            return true;
        return false;
    }
};