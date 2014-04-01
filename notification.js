function showWarningTranslated(title, content) {
    console.log("You must first set sites you want to post to. Please open option page for this extension.");
    // Create a simple text notification:
    var notification = webkitNotifications.createNotification(
        '',
    chrome.i18n.getMessage(title), //'Universal poster warning!',  // notification title
    chrome.i18n.getMessage(content) //'You must first set sites you want to post to. Please open option page for this extension.'  // notification body text
    );
    notification.show();
}


function showMsg(title, content){
    // Note: There's no need to call webkitNotifications.checkPermission().
    // Extensions that declare the notifications permission are always
    // allowed create notifications.

    // Create a simple text notification:
    var notification = webkitNotifications.createNotification(
      '',
      title,
      content
    );
    /*
    // Or create an HTML notification:
    var notification = webkitNotifications.createHTMLNotification(
      'notification.html'  // html url - can be relative
    );*/

    // Then show the notification.
    notification.show();
    setTimeout(function(){
      notification.cancel();
    }, 3000);
}