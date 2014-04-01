(function ($) {
    function isStr(obj) {
        return typeof obj == 'string' || obj instanceof String;
    }


    function genStringInput(jqueryElem, strInfo) {
        jqueryElem.html('<input value="' + strInfo + '" class="simple-input"/>');
    }

    function getDescription(descriptions, item) {
        if (descriptions[item]) return descriptions[item] + " ";
        else return item + " ";
    }
    
    function getOrder(descriptions, item) {
        if (descriptions[item]) return descriptions[item][0];
        else return "0";
    }

    function genObjInput(jqueryElem, formInfo, descriptions) {
        //alert(formInfo);

        //var inputHtmlStr = "";
        jqueryElem.html('<div class="obj-attrs"></div>');
        var innerElem = $(".obj-attrs", jqueryElem);
        for (var attr in formInfo) {
            var cnt = 0;
            if (formInfo.hasOwnProperty(attr)) {
                if (isStr(formInfo[attr])) {
                    //{"good":"bad"}, attr="good";formInfo[attr]="bad";
                    var descriptionText = getDescription(descriptions, attr);
                    var order = getOrder(descriptions, attr);
                    innerElem.append('<div class="attr-input" order="'+order+'"><label>' + descriptionText +
                        '</label><input class="'+attr+'" value="' + formInfo[attr] + '"/></div>');
                } else {
                    //If the value is not simple string, create complex fields
                    var descriptionText = getDescription(descriptions, attr);
                    var order = getOrder(descriptions, attr);
                    var newItem = $('<div class="'+attr+'" order="'+order+'"><p><h1>' + descriptionText +
                        '</h1></p><div class="content"></div></div>');
                    innerElem.append(newItem);
                    genForm($(".content", newItem), formInfo[attr], descriptions);
                }
            }
        }
    }

    function genForm(jqueryElem, formInfo, descriptions) {

        if (isStr(formInfo)) {
            genStringInput(jqueryElem, formInfo);
            return;
        }
        var genElemStr = "";
        if (Object.prototype.toString.call(formInfo) === '[object Array]') {
            genElemStr += '<div class="list-group">';
            for (var index = 0; index < formInfo.length; index++) {
                genElemStr += ('<div class="' + index + ' list-item" style="border: 1px solid"></div>');
            }
            genElemStr += '</div>';
            jqueryElem.html(genElemStr);
            for (var index = 0; index < formInfo.length; index++) {
                genForm($("." + index, jqueryElem), formInfo[index], descriptions);
            }
        } else {
            genObjInput(jqueryElem, formInfo, descriptions);
        }
    }
    
    function getDataFromObjAttrNode(item){
        var res = new Object();
        if(item.hasClass("attr-input")){
            var inputElem = $("input", item);
            //console.log(inputElem.val());
            var attr = inputElem.attr("class");
            var val = inputElem.val()
            res[attr] = val;
        }
        else{
            //Child node is a complex node
            var childPaneRootDiv = $(item.children('div')[0]);
            res[item.attr("class")] = getDataFromItem($(childPaneRootDiv.children('div')[0]));
        }
        return res;
    }
    
    function getDataFromItem(item){
        if(item.hasClass("obj-attrs")){
            var res = new Object();
            item.children('div').each(function(){
                var pair = getDataFromObjAttrNode($(this));
                $.each(pair, function(key, value){
                    res[key] = value;
                });
            });
            return res;
        }else if(item.hasClass("list-item")){
            var onlyItem = item.children('div')[0];
            if(!onlyItem){
                return $('input', item).val();
            }
            return getDataFromItem($(onlyItem));
        }else{
            var res = [];
            item.children('div').each(function(){
                res.push(getDataFromItem($(this)));
            });
            return res;
        }
    }

    $.fn.extend({
        createForm: function (options) {
            this.each(function () {
                //$(this).html("bye");
                //genForm($(this), config["storageSites"]);
                genForm($(this), options["config"], options["descriptions"]);
                //////////////////////////////
                //Sort items
                //////////////////////////////
                var objAttrs = $(".obj-attrs", $(this));
                $.each(objAttrs, function(index, parent){
                    var items = $(parent).children().remove();
                    //$.each(items, function(index, item) {
                    //    console.log(item);
                    //    $(item).appendTo($(parent));
                    //});
                    
                    var cnt = 1;
                    while(cnt<100){
                        //var filtered = $(items).filter(":contains('"+cnt+".')");
                        var filtered = $(items).filter("[order="+cnt+"]");
                        if(filtered.length==0) break;
                        $(parent).append($(filtered));
                        cnt += 1;
                    }
                    
                });
                //////////////////////////////
                //Create add new item button?
                //////////////////////////////
                $(".list-group").prepend('<button class="add-item">Add</button>');
                $("button.add-item").button().click(function(){
                    console.log($(this));
                    console.log(this);
                    console.log($(this).parents(".list-group"));
                    //$(this).parents(".list-group").after(""
                    var newItem = $(".list-item:first", $(this).parents(".list-group")).clone()
                    $("input", newItem).keypress(function(){
                        if(options["onchange"]) options["onchange"]();
                        else $("#save").removeAttr("disabled");
                    });
                    $("input", newItem).val("");
                    $(this).after(newItem);
                });
                //////////////////////////////
                //Add remove buttons
                //////////////////////////////
                $(".list-item", $(this)).prepend('<button class="remove">Remove</button>');
                $("button.remove").button().click(function(){
                    if(0 != $(this).parent().siblings('.list-item').length){
                        $(this).parent().remove();
                        $("#save").removeAttr("disabled");
                    }
                });
                //////////////////////////////
                //Save button
                //////////////////////////////
                $(this).append('<button id="save">Save</button>')
                $("#save").button().click(function(){
                    console.log("save clicked");
                    if(options["onsave"]) options["onsave"]();
                });
            });
        },
        getData: function () {
            var res = [];
            this.each(function (){
                res.push(getDataFromItem($(this)));
            });
            return res;
        }

    });
})(jQuery);

