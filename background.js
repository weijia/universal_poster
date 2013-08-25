


var startPostInfoProcess = function(postInfo) {
    console.log(postInfo);
        
    savedUsername = localStorage["username"];
    savedPassword = localStorage["password"];
    
    var postUrl = baeBackend.getPostUrl(savedUsername, savedPassword, postInfo.tags, postInfo.postingUrl, postInfo.description);
    console.log(postUrl);
    postUrlWithCallback(postUrl, function(data){console.log(data);});
}

var snifferEngineDict = {"http://cang.baidu.com/do/cm": cangSniffer};

chrome.webRequest.onBeforeRequest.addListener(
    function(info) {
        var submitPackage = {};
        console.log("url intercepted: " + info.url, info);
        //chrome.tabs.sendMessage(info.tabId, any message, function responseCallback);
        for(var matchUrl in snifferEngineDict){
            if(snifferEngineDict.hasOwnProperty(matchUrl))  // Ref: http://stackoverflow.com/questions/890807/iterate-over-a-javascript-associative-array-in-sorted-order
            {
                var expectedUrlPos = info.url.indexOf(matchUrl);
                if(-1 != expectedUrlPos){
                    var postInfo = snifferEngineDict[key].onRequest(info);
                    submitPackage[snifferEngineDict[key].name] = postInfo;
                }
            }

        }

    },
    // filters
    {
        urls: [
            //"<all_urls>"
            //"*://cang.baidu.com/"//Does not work.
            ]
    },
    ["requestBody"]
);



chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
        //if (request.greeting == "hello")
        //  sendResponse({farewell: "goodbye"});
        console.log(sender.tab.url);
        
        
        startPostInfoProcess(request);

    }
);
    
