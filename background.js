// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Simple extension to replace lolcat images from
// http://icanhascheezburger.com/ with loldog images instead.

//console.log("Loaded");
/*
chrome.webRequest.onSendHeaders.addListener(
  function(info) {
    //console.log("url intercepted: " + info.url, info);
  },
  // filters
  {
    urls: ["<all_urls>"]
  },
  ["requestHeaders"]);
*/

var gStaredItemList = {};

chrome.webRequest.onBeforeRequest.addListener(
    function(info) {
        console.log("url intercepted: " + info.url, info);
        //chrome.tabs.sendMessage(info.tabId, any message, function responseCallback);
        var expectedUrlPos = info.url.indexOf("http://cang.baidu.com/do/cm");
        if(-1 != expectedUrlPos)
            gStaredItemList[info.requestBody.formData.iu] = info;
        else{
            /*
            expectedUrlPos = info.url.indexOf('http://reader.youdao.com/favor.do?');
            if(-1 != expectedUrlPos){
                //http://reader.youdao.com/favor.do?_=1376805350877&method=addFavorite&id=-4238221193455415553&index=28244&tag=buy
                if(-1 != info.url.indexOf("method=addFavorite")){
                    params = info.url.split("&");
                    for(var param in params){
                        if(-1!=param.indexOf("tag")){
                            tags = param.split("=")[1];
                        }
                    }
                }
            }*/
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
        console.log(sender.tab.url, gStaredItemList);

        savedUsername = localStorage["username"];
        savedPassword = localStorage["password"];

        if(sender.tab.url in gStaredItemList){
            // TODO: remove the info after a timeout
            sendResponse({info: gStaredItemList[sender.tab.url], isPostNeeded: true,
                username: savedUsername, password: savedPassword});
			setInterval(function(){delete gStaredItemList[sender.tab.url];},10000);
        }
        else{
            sendResponse({isPostNeeded: false,
                username: savedUsername, password: savedPassword});
        }
    }
);

  
  
  