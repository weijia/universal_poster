var descriptions = {
    "storageSites": "Bookmark Storage Site Configurations:",
    "siteUrl": "Post URL for bookmark storage site:",
    "username": "Username:",
    "password": "Password:",
    "captureUrls": "URLs to capture:",
    "siteConfigurations": "Site Configurations"
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
            saveConfig(config);
        }
    });
    if(!localStorage["showAllbookmarksSites"])
        $(".siteUrl").each(function(){
            if(-1 == $(this).val().indexOf("instapaper"))
                $(this).parent().parent().parent().hide();
        });
    else
        console.log("showAllbookmarksSites is not set");
});