// Save this script as `options.js`

// Saves options to localStorage.
function save_options(e) {
    var field = $(e.target).parents(".input-fields");
    var savingItem = {};
    $.each($("input", field), function(key, value){
        //localStorage[value.id] = value.value;
        savingItem[value.id] = value.value;
    });
    var siteUrl=$(".url", field).val();
    var username=$(".username", field).val();
    var password=$(".password", field).val();
    if(localStorage["siteConfigurations"])
        savingItem["siteConfigurations"] = JSON.parse(localStorage["siteConfigurations"]);
    else
        savingItem["siteConfigurations"] = []

    var foundItem = false;
    for(var index=0; index<savingItem["siteConfigurations"].length; index++){
        if(savingItem["siteConfigurations"][index].siteUrl == siteUrl){
            foundItem = true;
        }
    }
    if(!foundItem) savingItem["siteConfigurations"].push({"siteUrl": siteUrl, "username": username, "password": password});
    localStorage["siteConfigurations"] = JSON.stringify(savingItem["siteConfigurations"]);
    console.log(savingItem);
    console.log(JSON.parse(localStorage["siteConfigurations"]));
    // Save it using the Chrome extension storage API.
    chrome.storage.sync.set(savingItem, function() {
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
    });
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
//document.querySelector('.save').addEventListener('click', save_options);
$(".save").click(save_options);