var baeBackend = {
    name: "BAE",
    getPostUrl: function(username, password, tags, postingUrl, description) {

        var url = 'https://mycampus.duapp.com/objsys/append_tags/?username=' + username;
        url += '&password=' + password;
        url += "&tags=" + tags;
        url += "&selected_url=" + encodeURI(postingUrl);
        url += "&description=" + encodeURI(description);
        console.log("BAE post URL: "+url);
        return url;
    }

}