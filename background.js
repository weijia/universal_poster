///////////////////////
// Initialize username and password from chrome cloud stoage
///////////////////////
var siteConfigurations = null;
chrome.storage.sync.get(["siteConfigurations"], function(items){
    siteConfigurations = items["siteConfigurations"];
    if(!siteConfigurations){
        console.log("You must first set sites you want to post to.");
        // Create a simple text notification:
        var notification = webkitNotifications.createNotification(
            '',
            'Warning!',  // notification title
            'You must first set sites you want to post to.'  // notification body text
        );
        notification.show();
    }
    else{
        localStorage["siteConfigurations"] = siteConfigurations;
    }
});


var startPostInfoProcess = function(postInfo) {
    console.log(postInfo);
    
    var postUrl = "";
    chrome.storage.sync.get(["duapp-username", "duapp-password"], function(items){
        //console.log(items);
        //console.log(items["duapp-username"], items["duapp-password"]);
        if(items["duapp-username"] && items["duapp-password"]){
            postUrl = baeBackend.getPostUrl(items["duapp-username"], items["duapp-password"], postInfo.tags, postInfo.postingUrl, postInfo.description);
            postUrlWithCallback(postUrl, function(data){console.log("BAE post result:", data);});
        }
        else{
            console.log("You must first set your username for BAE backend in option");
        }
    });
    
    console.log("capturer:", postInfo.capturer.name);
    
    var instapaperPostUrl = "";
    if((postInfo.capturer.name != "instapaper.com")){
        chrome.storage.sync.get(["instapaper-username", "instapaper-password"], function(items){
            //console.log(items);
            //console.log(items["instapaper-username"], items["instapaper-password"]);
            if(items["instapaper-username"] && items["instapaper-password"]){
                instapaperPostUrl = instapaperBackend.getPostUrl(items["instapaper-username"], items["instapaper-password"], postInfo.tags, postInfo.postingUrl, postInfo.description);
                if(instapaperPostUrl != "") postUrlWithCallback(instapaperPostUrl, function(data){console.log("instapaper post result:", data);});
            }
            else{
                console.log("You must first set your instapaper username in option");
            }
        });
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
    
}

//Only URL match will be used
var snifferEngineDict = {"http://cang.baidu.com/do/cm": cangSniffer,
                            "https://www.instapaper.com/bookmarklet/": instapaperSniffer,
                            "http://www.instapaper.com/bookmarklet/": instapaperSniffer,
                            "http://my.yihaodian.com/member/myNewCollection/addNewFavorite.do": yihaodianSniffer
};

//Sniffer callback will be used to determine if the item matches the criteria
var snifferEngineList = [githubSniffer, stackoverflowSniffer];

chrome.webRequest.onBeforeRequest.addListener(
    function(info) {
        var submitPackage = {};
        console.log("url intercepted: " + info.url, info);
        var matched = false;
        for(var matchUrl in snifferEngineDict){
            if(snifferEngineDict.hasOwnProperty(matchUrl))  // Ref: http://stackoverflow.com/questions/890807/iterate-over-a-javascript-associative-array-in-sorted-order
            {
                if(-1 != info.url.indexOf(matchUrl)) matched = true;
            }
        }
        for(var index=0;index<snifferEngineList.length;index++){
            if(snifferEngineList[index].matchUrl(info)) matched = true;
        }
        if(matched){
            var postInfo = snifferEngineDict[matchUrl].onRequest(info, startPostInfoProcess);
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
    
