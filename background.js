///////////////////////
// Initialize username and password from chrome cloud stoage
///////////////////////
var siteConfigurations = null;
chrome.storage.sync.get(["siteConfigurations"], function(items){
    siteConfigurations = items["siteConfigurations"];
    if(!siteConfigurations){
        localStorage["siteConfigurations"] = [];
        console.log("You must first set sites you want to post to. Please open option page for this extension.");
        // Create a simple text notification:
        var notification = webkitNotifications.createNotification(
            '',
            chrome.i18n.getMessage("notificationWarningTitle"), //'Universal poster warning!',  // notification title
            chrome.i18n.getMessage("notificationAccountWarning") //'You must first set sites you want to post to. Please open option page for this extension.'  // notification body text
        );
        notification.show();
    }
    else{
        localStorage["siteConfigurations"] = JSON.stringify(siteConfigurations);
    }
});


var startPostInfoProcess = function(postInfo) {
    console.log(postInfo);
    var siteConfigurations = JSON.parse(localStorage["siteConfigurations"]);
    for(var index=0; index<siteConfigurations.length; index++){
        var username = siteConfigurations[index].username;
        var password = siteConfigurations[index].password;
        var postUrl = siteConfigurations[index].siteUrl.replace("{username}", username);
        postUrl = postUrl.replace("{password}", password).replace("{url}", encodeURIComponent(postInfo.postingUrl));
        postUrl = postUrl.replace("{tags}", encodeURIComponent(postInfo.tags)).replace("{description}", encodeURIComponent(postInfo.description));
        console.log(postUrl);
        if((postInfo.capturer.name == "instapaper.com") &&
            (-1!=siteConfigurations[index].siteUrl.indexOf("instapaper.com")))
                continue;//Captured from instapaper, so it is already posted to instapaper. Ignore this post
        postUrlWithCallback(postUrl, function(data){console.log("post result:", data);});
    }

    
    // Note: There's no need to call webkitNotifications.checkPermission().
    // Extensions that declare the notifications permission are always
    // allowed create notifications.

    // Create a simple text notification:
    var notification = webkitNotifications.createNotification(
      '',
      chrome.i18n.getMessage("notificationPostingTitle"),//'Universal poster: Posting!',  // notification title
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
    
}

//Only URL match will be used
var snifferEngineDict = {"http://cang.baidu.com/do/cm": cangSniffer,
                            "https://www.instapaper.com/bookmarklet/": instapaperSniffer,
                            "http://www.instapaper.com/bookmarklet/": instapaperSniffer,
                            "http://my.yihaodian.com/member/myNewCollection/addNewFavorite.do": yihaodianSniffer,
                            "http://my.1mall.com/member/myNewCollection/addNewFavorite.do": yihaodianSniffer,
                            "http://base.yixun.com/json.php?mod=favor&act=add": commonSniffer
};

//Sniffer callback will be used to determine if the item matches the criteria
var snifferEngineList = [githubSniffer, stackoverflowSniffer];

chrome.webRequest.onBeforeRequest.addListener(
    function(info) {
        var submitPackage = {};
        console.log("url intercepted: " + info.url, info);
        var matchedEngine = false;
        for(var matchUrl in snifferEngineDict){
            if(snifferEngineDict.hasOwnProperty(matchUrl))  // Ref: http://stackoverflow.com/questions/890807/iterate-over-a-javascript-associative-array-in-sorted-order
            {
                if(-1 != info.url.indexOf(matchUrl)) matchedEngine = snifferEngineDict[matchUrl];
            }
        }
        for(var index=0;index<snifferEngineList.length;index++){
            if(snifferEngineList[index].matchUrl(info)) matchedEngine = snifferEngineList[index];
        }
        if(matchedEngine){
            var postInfo = matchedEngine.onRequest(info, startPostInfoProcess);
            if(postInfo) startPostInfoProcess(postInfo);
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
    
