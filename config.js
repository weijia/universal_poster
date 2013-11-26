//The following is an example for config, it should be saved in chrome storage as is.
var configObj = {
    "versionedConfig": {
        "curConfigVer": "v1",
            "configDict": {
            "v1": {},
            "v2": {}
        }
    }
};

var templateConfigStructure = {
    "versionedConfig": {
        "curConfigVer": "v1",
            "configDict": {
            "v1": {},
            "v2": {}
        }
    }
};

function showNoConfigWarning() {
    console.log("You must first set sites you want to post to. Please open option page for this extension.");
    // Create a simple text notification:
    var notification = webkitNotifications.createNotification(
        '',
    chrome.i18n.getMessage("notificationWarningTitle"), //'Universal poster warning!',  // notification title
    chrome.i18n.getMessage("notificationAccountWarning") //'You must first set sites you want to post to. Please open option page for this extension.'  // notification body text
    );
    notification.show();
}

function startLoadConfig(callbacks) {
    var onSuccess = callbacks["success"];
    var onFail = callbacks["fail"];

    chrome.storage.sync.get(["versionedConfig"], function (items) {
        var versionedConfig = items["versionedConfig"];
        if (versionedConfig) {
            setCurVerConfigFromLocalStorage(versionedConfig["configDict"]["v1"]);
            setCaptureUrls(versionedConfig["configDict"]["v1"]["captureUrls"]);
            setSiteConfigurations(versionedConfig["configDict"]["v1"]["siteConfigurations"]);
            console.log(JSON.stringify(versionedConfig));
            localStorage[chrome.app.getDetails().version] = JSON.stringify(versionedConfig);
            if(onSuccess) onSuccess();
        } else {
            if (onFail) onFail();
            else {
                showNoConfigWarning();
            }
        }
    });
}


function saveConfig(config, callback) {
    var savingUniversalPosterConfig = templateConfigStructure;
    savingUniversalPosterConfig["versionedConfig"]["curConfigVer"] = "v1";
    savingUniversalPosterConfig["versionedConfig"]["configDict"] = {
        "v1": config
    };
    //Save as versioned config
    chrome.storage.sync.set(savingUniversalPosterConfig, function () {
        console.log(savingUniversalPosterConfig);
        //Save OK
        if (callback) callback();
    });
}


function loadLegacyConfig(callbacks) {
    var onSuccess = callbacks["success"];
    var onFail = callbacks["fail"];

    chrome.storage.sync.get(["siteConfigurations"], function (items) {
        siteConfigurations = items["siteConfigurations"];
        if (!siteConfigurations) {
            localStorage["siteConfigurations"] = JSON.stringify([]);
            showNoConfigWarning();
            onFail();
        } else {
            localStorage["siteConfigurations"] = JSON.stringify(siteConfigurations);

            //Save config to versioned config if versioned config is not created yet.
            chrome.storage.sync.get(["versionedConfig"], function (items) {
                versionedConfigInChromeSync = items["versionedConfig"];
                //if(!versionedConfigInChromeSync){
                saveConfig({
                    "captureUrls": defaultCaptureUrls,
                        "siteConfigurations": siteConfigurations
                }, onSuccess);
                //}
            });
        }
    });
}

var defaultSiteConfigurations = [
    {
        "password": "",
            "siteUrl": "https://www.instapaper.com/api/add?username={username}&password={password}&url={url}&title={description}",
            "username": ""
    }, {
        "password": "",
            "siteUrl":
            "https://mycampus.duapp.com/objsys/append_tags/?username={username}&password={password}&selected_url={url}&description={description}&tags={tags}",
            "username": ""
    }, {
        "password": "",
            "siteUrl": "https://127.0.0.1:8110/objsys/append_tags/?username={username}&password={password}&selected_url={url}&description={description}&tags={tags}",
            "username": ""
    }, {
        "password": "",
            "siteUrl": "http://127.0.0.1:8110/objsys/append_tags/?username={username}&password={password}&selected_url={url}&description={description}&tags={tags}",
            "username": ""
    }, {
        "password": "",
            "siteUrl":
            "https://allbookmarks.duapp.com/objsys/append_tags/?username={username}&password={password}&selected_url={url}&description={description}&tags={tags}",
            "username": ""
    }, {
        "password": "",
            "siteUrl": "http://127.0.0.1:8210/objsys/append_tags/?username={username}&password={password}&selected_url={url}&description={description}&tags={tags}",
            "username": ""
    }
];
    
    
//TODO: Rewrite the codes use jquery defer
//////////////////////////
// External API for load config to localStorage
//////////////////////////
function loadConfig(successCallback, failCallback) {
    startLoadConfig({
        "success": successCallback,
        "fail": function () {
            loadLegacyConfig({
                "success": successCallback,
                "fail": function () {
                    saveConfig({
                        "captureUrls": defaultCaptureUrls,
                            "siteConfigurations": defaultSiteConfigurations
                        }, successCallback);
                }
            });
        }
    });
}