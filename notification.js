function showWarningTranslated(title, content) {
    
    console.log("You must first set sites you want to post to. Please open option page for this extension.");
    // Create a simple text notification:
    createNotification(
        chrome.i18n.getMessage(title), //'Universal poster warning!',  // notification title
        chrome.i18n.getMessage(content) //'You must first set sites you want to post to. Please open option page for this extension.'  // notification body text
    );
}


function showMsg(title, content){
    createNotification(title, content);
}


function createNotification(title, content){
    var n = new Notification(title + "\n" + content);
    setTimeout(n.close, 3000);
}