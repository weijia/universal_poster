///////////////////////
// Initialize username and password from chrome cloud stoage
///////////////////////


function notifyPost(postInfo){
    showMsg(
        chrome.i18n.getMessage("notificationPostingTitle"),//'Universal poster: Posting!',  // notification title
        postInfo.postingUrl  // notification body text
    );
}

var startPostInfoProcess = function(postInfo) {
    console.log(postInfo);
    var siteConfigurations = getSiteConfigurations();
    var isPostDone = false;
    for(var index=0; index<siteConfigurations.length; index++){
        //work arround for empty url setting
        if(!siteConfigurations[index].siteUrl) continue;
        if(!siteConfigurations[index].username) continue;
        if(!siteConfigurations[index].password) continue;
        
        isPostDone = true;
        var username = siteConfigurations[index].username;
        var password = siteConfigurations[index].password;
        var postUrl = siteConfigurations[index].siteUrl.replace("{username}", username);

        postUrl = postUrl.replace("{password}", password).replace("{url}", encodeURIComponent(postInfo.postingUrl));
        postUrl = postUrl.replace("{tags}", encodeURIComponent(postInfo.tags)).replace("{description}", encodeURIComponent(postInfo.description));
        //console.log(postUrl);
        if((postInfo.capturer.name == "instapaper.com") &&
            (-1!=siteConfigurations[index].siteUrl.indexOf("instapaper.com")))
                continue;//Captured from instapaper, so it is already posted to instapaper. Ignore this post
                
        postUrlWithCallback(postUrl, function(data){
            //console.log("post result:", data);
        });
    }
    if(isPostDone) notifyPost(postInfo);
    else showWarningTranslated("notificationWarningTitle", "notificationAccountWarningWhenUrlMatches");
    
}

//Only URL match will be used
var snifferEngineDict = {"http://cang.baidu.com/do/cm": cangSniffer,
                            "https://www.instapaper.com/bookmarklet/": instapaperSniffer,
                            "http://www.instapaper.com/bookmarklet/": instapaperSniffer,
                            "http://my.yihaodian.com/member/myNewCollection/addNewFavorite.do": yihaodianSniffer,
                            "http://my.1mall.com/member/myNewCollection/addNewFavorite.do": yihaodianSniffer
};

//Sniffer callback will be used to determine if the item matches the criteria
var snifferEngineList = [
    //githubSniffer, 
    //stackoverflowSniffer, 
    doubanSniffer
];


var filterForPredefinedUrlPatterns = [
            //"<all_urls>"
            "*://cang.baidu.com/*",
            "*://www.instapaper.com/",
            //"*://github.com/*/star",
            //"*://stackoverflow.com/posts/*",
            "*://movie.douban.com/j/subject/*"
            ];

function getFilters(){
    var filters = filterForPredefinedUrlPatterns;
    var captureUrls = getCaptureUrls();
    for(var index=0;index<captureUrls.length;index++){
        filters.push(captureUrls[index]+"*");
    }
    for(var index=0;index<snifferEngineList.length;index++){
        filters.push(snifferEngineList[index].sitePattern);
    }
    console.log("filters: "+filters);
    return filters;
}


function onConfigLoaded(){
    var filters_to_register = getFilters();            
    /*
    "*://my.yihaodian.com/member/myNewCollection/*",
                "*://my.1mall.com/member/myNewCollection/*",
                "*://base.yixun.com/json.php*",
                "*://www.facebook.com/plugins/like/connect",
                "*://t.jd.com/product/followProduct.action*"
                ]*/
    chrome.webRequest.onBeforeRequest.addListener(
        function(info) {
            var submitPackage = {};
            console.log("url captured according to filters: " + info.url, info);
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
            //Customizable URL matching, will use common sniffer for all customized URL capturing
            var captureUrlList = getCaptureUrls();
            //console.log(captureUrlList);
            for(var index=0;index<captureUrlList.length;index++){
                //if(-1 != info.url.indexOf(captureUrlList[index])){
                if(stringStarPatternMatching(info.url, captureUrlList[index])){
                    matchedEngine = commonSniffer;
                    //console.log(captureUrlList[index], matchedEngine, info.url);
                }
            }
            
            if(matchedEngine){
                var postInfo = matchedEngine.onRequest(info, startPostInfoProcess);
                if(postInfo) startPostInfoProcess(postInfo);
            }
        },
        // filters
        {
            urls: filters_to_register
        },
        ["requestBody"]
    );
}

loadConfig(onConfigLoaded);

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
    
