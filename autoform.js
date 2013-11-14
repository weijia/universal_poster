(function ($) {
    function isStr(obj) {
        return typeof obj == 'string' || obj instanceof String;
    }


    function genStringInput(jqueryElem, strInfo) {
        jqueryElem.html('<input value="' + strInfo + '"/>');
    }

    function getDescription(descriptions, item) {
        if (descriptions[item]) return descriptions[item] + " ";
        else return item + " ";
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
                    descriptionText = getDescription(descriptions, attr);
                    innerElem.append('<div class="attr-input"><label>' + descriptionText +
                        '</label><input class="'+attr+'" value="' + formInfo[attr] + '"/></div>');
                } else {
                    var newItem = $('<div><p><h1>' + getDescription(descriptions, attr) +
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
        if(item.hasClass("attr-input")){
            var inputElem = $("input", item);
            //console.log(inputElem.val());
            var attr = inputElem.attr("class");
            var val = inputElem.val()
            var res = new Object();
            res[attr] = val;
            return res;
        }
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
        createForm: function (content) {
            this.each(function () {
                //$(this).html("bye");
                //genForm($(this), config["storageSites"]);
                genForm($(this), content["config"], content["descriptions"]);
                
                //Create add new item button?
                $(".list-group").prepend('<button class="add-item">Add</button>');
                $("button").button().click(function(){
                    console.log($(this));
                    console.log(this);
                    console.log($(this).parents(".list-group"));
                    //$(this).parents(".list-group").after(""
                    var newItem = $(".list-item:first", $(this).parents(".list-group")).clone()
                    $(this).after(newItem);
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

