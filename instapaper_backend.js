var instapaperBackend = {
    name: "Instapaper",
    getPostUrl: function(username, password, tags, postingUrl, description) {

        var url = 'https://www.instapaper.com/api/add?username=' + username;
        url += '&password=' + password;
        url += "&url=" + encodeURI(postingUrl);
        url += "&title=" + encodeURI(description);
        console.log("Instapaper post URL: "+url);
        return url;
    }

}