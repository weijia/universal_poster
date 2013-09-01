


var startPostInfoProcess = function(postInfo) {
    console.log(postInfo);
        
    //savedUsername = localStorage["username"];
    //savedPassword = localStorage["password"];
    
    var postUrl = "";
    if((localStorage["duapp-username"])&&(localStorage["duapp-password"])){
        postUrl = baeBackend.getPostUrl(localStorage["duapp-username"], localStorage["duapp-password"], postInfo.tags, postInfo.postingUrl, postInfo.description);
    }
    else{
        console.log("You must first set your username for BAE backend in option");
    }
    
    
    console.log("capturer:", postInfo.capturer.name);
    
    var instapaperPostUrl = "";
    if((postInfo.capturer.name != "instapaper.com")){
        if((localStorage["instapaper-username"])&&(localStorage["instapaper-password"]))
            instapaperPostUrl = instapaperBackend.getPostUrl(localStorage["instapaper-username"], localStorage["instapaper-password"], postInfo.tags, postInfo.postingUrl, postInfo.description);
        else{
            console.log("You must first set your instapaper username in option");
        }
    }
    
    // Note: There's no need to call webkitNotifications.checkPermission().
    // Extensions that declare the notifications permission are always
    // allowed create notifications.

    // Create a simple text notification:
    var notification = webkitNotifications.createNotification(
      '',
      'Posting!',  // notification title
      postInfo.postingUrl  // notification body text
    );
    /*
    // Or create an HTML notification:
    var notification = webkitNotifications.createHTMLNotification(
      'notification.html'  // html url - can be relative
    );*/

    // Then show the notification.
    notification.show();
    setTimeout(function(){
      notification.cancel();
    }, 3000);
    
    if(postUrl != "") postUrlWithCallback(postUrl, function(data){console.log("BAE post result:", data);});
    if(instapaperPostUrl != "") postUrlWithCallback(instapaperPostUrl, function(data){console.log("instapaper post result:", data);});
}

var snifferEngineDict = {"http://cang.baidu.com/do/cm": cangSniffer,
                            "https://www.instapaper.com/bookmarklet/": instapaperSniffer
};

var snifferEngineList = [githubSniffer, stackoverflowSniffer];

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
                    var postInfo = snifferEngineDict[matchUrl].onRequest(info);
                    startPostInfoProcess(postInfo);
                }
            }

        }
        for(var index=0;index<snifferEngineList.length;index++){
            if(snifferEngineList[index].matchUrl(info)) {
                var postInfo = snifferEngineList[index].onRequest(info);
                startPostInfoProcess(postInfo);
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
    
