var descriptions = {
    "storageSites": "Bookmark Storage Site Configurations:",
    "siteUrl": "3. Post URL for bookmark storage site:",
    "username": "1. Username:",
    "password": "2. Password:",
    "captureUrls": "2. URLs to capture:",
    "siteConfigurations": "1. Bookmark Site Configurations"
};

function showNotificationForSavingConfig(){
    var status = $("#save_status")[0];
    status.innerHTML = chrome.i18n.getMessage("optionSaved");//"Options Saved.";
    setTimeout(function() {
        status.innerHTML = "";
    }, 5000);
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
            if((-1 == $(this).val().indexOf("instapaper"))&&(-1 == $(this).val().indexOf("tag4u.sinaapp.com"))
                        &&(-1 == $(this).val().indexOf("www.tingwojia.com")))
                $(this).parent().parent().parent().hide();
        });
        console.log("showAllbookmarksSites is not set, you can set it by: localStorage['showAllbookmarksSites']=1");
    }
    $(".siteUrl").attr("disabled", true);
    $(".captureUrls button.add-item").parent().append('<button id="update-capture-urls">Update capture pattern from web</button>');
    $(".captureUrls button.add-item").parent().append('<button id="reset-to-default-capture-urls">Reset to default capture pattern</button>');
    $("#update-capture-urls").button().click(function(){loadWebDynamicConfig();});
    $("#reset-to-default-capture-urls").button().click(function(){resetToDefaultCapturePatterns();});
});
