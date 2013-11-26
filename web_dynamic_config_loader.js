
function saveWebDynamicConfig(data){
    console.log(data);
    /*
    var splitedFullList = data.split("=");
    var valueStr = splitedFullList.slice(1).join("=").trim();
    if(valueStr[0] == "[") valueStr = valueStr.substring(1);
    if(valueStr(valueStr.length
    var splitByComma = valueStr.split(",");
    console.log(splitByComma)*/
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
        });
}

function loadWebDynamicConfig() {
    postUrlWithCallback("https://raw.github.com/weijia/universal_poster/master/default_capturing_url.js", saveWebDynamicConfig)
};