function stringStarPatternMatching(targetStr, pattern){
    var items = pattern.split("*");
    for(var index in items){
        if(items[index]=="") continue;
        var startOfItem = targetStr.indexOf(items[index]);
        if(-1 != startOfItem){
            targetStr = targetStr.substr(startOfItem);
            console.log("matched: "+startOfItem + " following: " + targetStr);
            continue;
        }
        return false;
    }
    return true;
}