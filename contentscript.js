var tampermonkeyBody = document.getElementsByTagName("body")[0];
//console.log(tampermonkeyBody);

function handleInitForNetEaseScript(event){
    console.log(event);
    var signaturePosition = event.target.className.indexOf('cast-function-tag');
    if(-1 != signaturePosition)
    {
        //console.log($(event.target).parents(".cast"));
        //console.log($(".cast-title a", $(event.target).parents(".cast")));
        //console.log($(".cast-title a", $(event.target).parents(".cast")).attr("href"));
        var item = $(".cast-title a", $(event.target).parents(".cast"));
        

        //console.log("Hello world");
        var msg = {tags: "buy", postingUrl: item.attr("href"), description: item.text()};
        chrome.runtime.sendMessage(msg, function(response) {});
        console.log("send msg done", msg);
    }
}
tampermonkeyBody.addEventListener("click", handleInitForNetEaseScript, true);
