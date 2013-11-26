


function loadWebDynamicConfig(onSuccess) {
    postUrlWithCallback("https://raw.github.com/weijia/universal_poster/master/default_capturing_url.js", function (data){
        console.log(data);

        var strList = data.match(/\".+\"/g);
        //console.log(strList);
        var capturingUrls = getCaptureUrls();
        var isUpdated = false;
        for(var index=0;index<strList.length;index++){
            var item = strList[index].replace(/\"/g,"");
            //console.log(item);
            //capturingUrls.push(item);
            if(-1 == capturingUrls.indexOf(item)){
                capturingUrls.push(item);
                isUpdated = true;
                console.log("Adding", item, capturingUrls);
            }
        }
        //Save to localStorage
        setCaptureUrls(capturingUrls);
        //Save to sync stroage
        saveConfig({
                    "captureUrls": capturingUrls,
                        "siteConfigurations": getSiteConfigurations()
                    }, function(){
                        location.reload();
                        var bkg = chrome.extension.getBackgroundPage();
                        bkg.location.reload();
                        if(onSuccess) onSuccess();

                });
    })
};