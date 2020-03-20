var tampermonkeyBody = document.getElementsByTagName("body")[0];
//console.log(tampermonkeyBody);


function handleInitForNetEaseScript(event){
    console.log(event);
    // To fully support feedly (even keyboard short cut is used to set item as saved.
    // saving URL must be captured and then send msg to content page to check the entry id and content info.
    var isFeedly = (-1 != document.URL.indexOf('feedly.com'));
    if(isFeedly){
        var url = null;
        var text = null;
        var saved = false;
        console.log("On feedly");
        if($(event.target).hasClass("wikiWidgetSave")){
            console.log("wikiWidgetSave");
            var currentTarget = $(event.target);
            var entryId = currentTarget.attr("data-toggleentryid");
            //var targetParent = $(event.target).parents('.u100Frame');
            //console.log(targetParent);
            var itemDiv = $('div[data-entryid="'+entryId+'"]');
            console.log(itemDiv.attr("data-title"));
            url = itemDiv.attr("data-alternate-link");
            text = itemDiv.attr("data-title");
            saved = true;
        }
        else if($(event.target).hasClass("quickListHandle")){
            console.log("quickListHandle");
            console.log($($("a", $(event.target).parent())[0]).href);
            url = $($("a", $(event.target).parent())[0]).href;
            text = $($("a", $(event.target).parent())[0]).text;
            saved = true;
        }            
        if(saved){
            //console.log("Hello world");
            var msg = {tags: ["feedly"], postingUrl: url, description: text, capturer: {name: "feedly"}};
            chrome.runtime.sendMessage(msg, function(response) {});
            console.log("send msg done", msg);
        }
    }
    else{
        var signaturePosition = event.target.className.indexOf('cast-function-tag');
        if(-1 != signaturePosition)
        {
            //console.log($(event.target).parents(".cast"));
            //console.log($(".cast-title a", $(event.target).parents(".cast")));
            //console.log($(".cast-title a", $(event.target).parents(".cast")).attr("href"));
            var item = $(".cast-title a", $(event.target).parents(".cast"));
            

            //console.log("Hello world");
            var msg = {tags: ["buy"], postingUrl: item.attr("href"), description: item.text(), capturer: {name: "netease_reader"}};
            chrome.runtime.sendMessage(msg, function(response) {});
            console.log("send msg done", msg);
        }
    }
}
tampermonkeyBody.addEventListener("click", handleInitForNetEaseScript, true);
