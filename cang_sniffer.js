var cangSniffer = {
    sitePattern: "*://cang.baidu.com/*",
    name: "cang.baidu.com",
    onRequest: function(info) {
        if(info.requestBody)
            return {tags: info.requestBody.formData.tn.join(), 
                    postingUrl: info.requestBody.formData.iu,
                    description: info.requestBody.formData.it,
                    capturer: this}
        else{
            /*
            var url = purl(info.url);
            var tags = purl(info.url).tn
            return {tags: info.requestBody.formData.tn.join(), 
                    postingUrl: info.requestBody.formData.iu,
                    description: info.requestBody.formData.it,
                    capturer: this}*/
            return false;
        }
    }
}