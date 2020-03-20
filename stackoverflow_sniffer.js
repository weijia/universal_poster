var stackoverflowSniffer = {
    sitePattern: "*://stackoverflow.com/posts/*",
    name: "stackoverflow.com",
    onRequest: function(info, callback) {
        var starUrl = info.url;
        chrome.tabs.get(info.tabId, function(tab){
            var postingItem = {tags: ["star"],
                postingUrl: tab.url,
                description: tab.title,
                capturer: this};
            console.log("stackoverflow posting:", postingItem);
            callback(postingItem);
        });
        return false;
    },
    matchUrl: function(info) {
        if((info.url.indexOf("http://stackoverflow.com/posts/") == 0) &&
            (info.url.indexOf("/vote/5", info.url.length - "/vote/5".length) !== -1))
            //console.log("Found", this.onRequest(info));
            return true;
        return false;
    }
};
