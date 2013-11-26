
function getCaptureUrls(){
    return JSON.parse(localStorage["captureUrls"]);
}

function setCaptureUrls(captureUrls){
    localStorage["captureUrls"] = JSON.stringify(captureUrls);
}

function getSiteConfigurations(){
    return JSON.parse(localStorage["siteConfigurations"]);
}

function setSiteConfigurations(siteConfigurations){
    localStorage["siteConfigurations"] = JSON.stringify(siteConfigurations);
}

function getCurVerConfigFromLocalStorage(){
    return JSON.parse(localStorage["curVerConfigFromLocalStorage"]);
}

function setCurVerConfigFromLocalStorage(curVerConfigFromLocalStorage){
    localStorage["curVerConfigFromLocalStorage"] = JSON.stringify(curVerConfigFromLocalStorage)
}
