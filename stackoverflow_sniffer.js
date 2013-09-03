var stackoverflowSniffer = {
    name: "stackoverflow.com",
    onRequest: function(info) {
        var starUrl = info.url;
        starUrl
        return {tags: "star", 
                postingUrl: info.url.substring(0, info.url.length - "/vote/5".length).replace("\/posts\/","/questions/"),
                description: info.url.substring(0, info.url.length - "/vote/5".length).replace("\/posts\/","/questions/"),
                capturer: this}
    },
    matchUrl: function(info) {
        if((info.url.indexOf("http://stackoverflow.com/posts/") == 0) &&
            (info.url.indexOf("/vote/5", info.url.length - "/vote/5".length) !== -1))
            //console.log("Found", this.onRequest(info));
            return true;
        return false;
    }
}