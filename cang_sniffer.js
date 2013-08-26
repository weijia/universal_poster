var cangSniffer = {
    name: "cang.baidu.com",
    onRequest: function(info) {

        return {tags: response.info.requestBody.formData.tn.join(), 
                postingUrl: response.info.requestBody.formData.iu,
                description: response.info.requestBody.formData.it}
    }
}