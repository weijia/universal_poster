// Save this script as `options.js`

    /*
    v3 below:
        chrome sync storage => {
            "siteConfigurations": [
                //One item for every site:
                {"siteUrl": siteUrl, "username": username, "password": password},
                {}
            ]
        }
        
    v4 and above:
        chrome sync storage => {
            "v4Configuration":{
                storageSiteConfiguration: [
                    //One item for every site:
                    {"siteUrl": siteUrl, "username": username, "password": password}
                
                ]
            }
        }
    */

/*
// Saves options to localStorage.
function save_options(e) {

    var fields = $(e.target).parents(".input-fields");
    var savingItem = {};
    $.each($("input", fields), function(key, value){
        //localStorage[value.id] = value.value;
        savingItem[value.id] = value.value;
    });
    var siteUrl=$(".url", fields).val();
    var username=$(".username", fields).val();
    var password=$(".password", fields).val();
    if(localStorage["siteConfigurations"])
        existingItem["siteConfigurations"] = JSON.parse(localStorage["siteConfigurations"]);
    else
        existingItem["siteConfigurations"] = []

    var foundItem = false;
    for(var index=0; index<existingItem["siteConfigurations"].length; index++){
        if(existingItem["siteConfigurations"][index].siteUrl == siteUrl){
            foundItem = true;
        }
    }
    if(!foundItem) existingItem["siteConfigurations"].push({"siteUrl": siteUrl, "username": username, "password": password});
    localStorage["siteConfigurations"] = JSON.stringify(savingItem["siteConfigurations"]);
    console.log(existingItem);
    console.log(JSON.parse(localStorage["siteConfigurations"]));
    // Save it using the Chrome extension storage API.
    chrome.storage.sync.set(existingItem, function() {
        // Notify that we saved.
        //message('Settings saved');
        // Update status to let user know options were saved.
        var status = $(".status", field)[0];
        status.innerHTML = chrome.i18n.getMessage("optionSaved");//"Options Saved.";
        setTimeout(function() {
            status.innerHTML = "";
        }, 750);
    });
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  $.each($("input"), function(key, value){
    console.log(key, value, value.id, value.value);
    //if(localStorage[value.id])
    //    value.value = localStorage[value.id];
    chrome.storage.sync.get(value.id, function(items){console.log(items);
        if(items[value.id])
            value.value = items[value.id];
        var captureUrlList = ["http://base.yixun.com/json.php?mod=favor&act=add"];
        $('#common-capture-urls').val(JSON.stringify(captureUrlList));
        console.log($('#common-capture-urls').value);
    });
  });

}
document.addEventListener('DOMContentLoaded', restore_options);
//document.querySelector('.save').addEventListener('click', save_options);
$(".save").click(save_options);
//To enable private servers, input: chrome.storage.sync.set({"showPrivateFlag": true}, function(e){console.log("Done");})
chrome.storage.sync.get("showPrivateFlag", function(items){
    console.log(items);
    
    if(items["showPrivateFlag"])
        $(".private").css("display", "block");
        localStorage["showPrivateFlag"] = items["showPrivateFlag"];
        //console.log("display");
});

*/

var descriptions = {
    "storageSites": "Bookmark Storage Site Configurations:",
    "siteUrl": "Post URL for bookmark storage site:",
    "username": "Username:",
    "password": "Password:",
    "captureUrls": "URLs to capture:",
    "siteConfigurations": "Site Configurations"
};

function showNoConfigWarning(){
    console.log("You must first set sites you want to post to. Please open option page for this extension.");
    // Create a simple text notification:
    var notification = webkitNotifications.createNotification(
        '',
        chrome.i18n.getMessage("notificationWarningTitle"), //'Universal poster warning!',  // notification title
        chrome.i18n.getMessage("notificationAccountWarning") //'You must first set sites you want to post to. Please open option page for this extension.'  // notification body text
    );
    notification.show();
}

//The following is an example for config, it should be saved in chrome storage as is.
var configObj = {"versionedConfig":
    {
        "curConfigVer": "1",
        "configDict": {
            "1": {},
            "2": {}
        }
    }
};

var universalPosterConfigObj = {"versionedConfig":
    {
        "curConfigVer": "1",
        "configDict": {
            "1": {},
            "2": {}
        }
    }
};

function showNotificationForSavingConfig(){
    var status = $(".status", field)[0];
    status.innerHTML = chrome.i18n.getMessage("optionSaved");//"Options Saved.";
    setTimeout(function() {
        status.innerHTML = "";
    }, 750);
}

function saveConfig(config){
    var savingUniversalPosterConfig = universalPosterConfigObj;
    savingUniversalPosterConfig["versionedConfig"]["curConfigVer"] = "1";
    savingUniversalPosterConfig["versionedConfig"]["configDict"] = {"1": config};
    //Save as versioned config
    chrome.storage.sync.set(savingUniversalPosterConfig, function() {
        console.log(savingUniversalPosterConfig);
    });
}


chrome.storage.sync.get(["siteConfigurations"], function(items){
    siteConfigurations = items["siteConfigurations"];
    if(!siteConfigurations){
        localStorage["siteConfigurations"] = JSON.stringify([]);
        showNoConfigWarning();
    }
    else{
        localStorage["siteConfigurations"] = JSON.stringify(siteConfigurations);
        
        //Save config to versioned config if versioned config is not created yet.
        chrome.storage.sync.get(["versionedConfig"], function(items){
            versionedConfigInChromeSync = items["versionedConfig"];
            //if(!versionedConfigInChromeSync){
                saveConfig({"captureUrls": ["http://base.yixun.com/json.php?mod=favor&act=add",
                                    "https://www.facebook.com/plugins/like/connect",
                                    "http://t.jd.com/product/followProduct.action"],
                        "siteConfigurations": siteConfigurations});
            //}
        });
    }
});



chrome.storage.sync.get(["versionedConfig"], function(items){
    var versionedConfig = items["versionedConfig"];
    if(versionedConfig){
        console.log(versionedConfig["configDict"]["1"]);
        //localStorage["exportedConfigString"] = JSON.stringify(siteConfigurations);
        $("#input-form").createForm({"config": versionedConfig["configDict"]["1"], "descriptions": descriptions,
            "onsave": function(){
                var config = $("#input-form").getData()[0][0];
                console.log(config);
                saveConfig(config);
            }
        });
        localStorage["captureUrls"] = versionedConfig["configDict"]["1"]["captureUrls"];
        localStorage["siteConfigurations"] = versionedConfig["configDict"]["1"]["siteConfigurations"];
        console.log(JSON.stringify(versionedConfig));
        localStorage["versionedConfigLocalString1"] = JSON.stringify(versionedConfig);
        //$("#input-form").click(function(){console.log(JSON.stringify())});
    }
});