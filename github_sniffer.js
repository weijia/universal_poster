var githubSniffer = {
    name: "github.com",
    onRequest: function(info) {
        var starUrl = info.url;
        starUrl
        return {tags: "star", 
                postingUrl: info.url,
                description: info.url}
    }
}