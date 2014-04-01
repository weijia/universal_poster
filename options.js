var descriptions = {
    "storageSites": "Bookmark Storage Site Configurations:",
    "siteUrl": "Post URL for bookmark storage site:",
    "username": "Username:",
    "password": "Password:",
    "captureUrls": "URLs to capture:",
    "siteConfigurations": "Bookmark Site Configurations"
};

function showNotificationForSavingConfig(){
    var status = $(".status", field)[0];
    status.innerHTML = chrome.i18n.getMessage("optionSaved");//"Options Saved.";
    setTimeout(function() {
        status.innerHTML = "";
    }, 750);
}

loadConfig(function(){
    $("#input-form").createForm({"config": getCurVerConfigFromLocalStorage(), "descriptions": descriptions,
        "onsave": function(){
            var config = $("#input-form").getData()[0][0];
            console.log(config);
            var bkg = chrome.extension.getBackgroundPage();
            bkg.location.reload();
            saveConfig(config);
            showNotificationForSavingConfig();
        }
    });
    if(!localStorage["showAllbookmarksSites"]){
        $(".siteUrl").each(function(){
            if((-1 == $(this).val().indexOf("instapaper"))&&(-1 == $(this).val().indexOf("tag4u.sinaapp.com")))
                $(this).parent().parent().parent().hide();
        });
        console.log("showAllbookmarksSites is not set");
    }
    $(".siteUrl").attr("disabled", true);
    $(".captureUrls button.add-item").parent().append('<button id="update-capture-urls">Update capture pattern from web</button>');
    $("#update-capture-urls").button().click(function(){loadWebDynamicConfig();});
});