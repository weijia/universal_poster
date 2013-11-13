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
        jqueryElem.html("");
        for (var attr in formInfo) {
            var cnt = 0;
            if (formInfo.hasOwnProperty(attr)) {
                if (isStr(formInfo[attr])) {
                    //{"good":"bad"}, attr="good";formInfo[attr]="bad";
                    descriptionText = getDescription(descriptions, attr);
                    jqueryElem.append('<div class="attr-input"><label>' + descriptionText +
                        '</label><input class="'+attr+'" value="' + formInfo[attr] + '"/></div>');
                } else {
                    var newItem = $('<div><p><h1>' + getDescription(descriptions, attr) +
                        '</h1></p><div class="content"></div></div>');
                    jqueryElem.append(newItem);
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
            for (var index = 0; index < formInfo.length; index++) {
                genElemStr += ('<div class="' + index + '" style="border: 1px solid"></div>');
            }
            jqueryElem.html(genElemStr);
            for (var index = 0; index < formInfo.length; index++) {
                genForm($("." + index, jqueryElem), formInfo[index], descriptions);
            }
        } else {
            genObjInput(jqueryElem, formInfo, descriptions);
        }
    }
    
    function getDataFromItem(item){
        if(item.hasClass("attr-input")){
            var inputElem = $("input", item);
            console.log(inputElem.val());
            var attr = inputElem.attr("class");
            var val = inputElem.val()
            var res = new Object();
            res[attr] = val;
            return res;
        }
        else{
            var res = []
            $(item).children('div').each(function(){
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

