var cangSniffer = {
    name: "cang.baidu.com",
    onRequest: function(info) {

        return {tags: info.requestBody.formData.tn.join(), 
                postingUrl: info.requestBody.formData.iu,
                description: info.requestBody.formData.it}
    }
}