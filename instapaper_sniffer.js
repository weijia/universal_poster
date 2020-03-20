var instapaperSniffer = {
    sitePattern: "*://www.instapaper.com/",
    name: "instapaper.com",
    onRequest: function(info) {

        return {tags: ["read_it_later"], 
                postingUrl: info.requestBody.formData.u,
                description: info.requestBody.formData.t,
                capturer: this}
    }
};