var cangSniffer = function(){
    var name = "cang.baidu.com";
    var onRequest = function(info) {

        return {tags: response.info.requestBody.formData.tn.join(), 
                postingUrl: response.info.requestBody.formData.iu,
                description: response.info.requestBody.formData.it}
    };


}