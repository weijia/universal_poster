var commonSniffer = {
    name: "commonSniffer",
    onRequest: function(info, callback) {
        var starUrl = info.url;
        console.log(info.tabId);
        chrome.tabs.get(info.tabId, function(tab){
            var postingItem = {tags: ["star"],
                postingUrl: tab.url,
                description: tab.title,
                capturer: this};
            console.log("common sniffer posting:", postingItem);
            callback(postingItem);
        });
        return false;
    }
};