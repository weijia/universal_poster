var diigoSniffer = {
    sitePattern: "*://www.diigo.com/item/save/bookmark*",
    name: "diigo.com",
    onRequest: function(info) {

        return {tags: info.requestBody.formData.tags.split(" "), 
                postingUrl: info.requestBody.formData.url[0],
                description: info.requestBody.formData.title + info.requestBody.formData.description,
                capturer: this}
    },
    matchUrl: function(info) {
        if(info.url.indexOf("www.diigo.com/item/save") != -1) return true;
        return false;
    }
};