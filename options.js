// Save this script as `options.js`

// Saves options to localStorage.
function save_options(e) {
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

