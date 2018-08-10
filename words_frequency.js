// ==UserScript==
// @name         词频统计
// @namespace    https://quoth.win/word_freq
// @version      1.1
// @description  利用COCA一万五词频表分析网页文单词词频，建议手动替换为五万词库。
// @author       Reynard
// @include      *://*
// @grant        none
// @require      http://7xwdld.com1.z0.glb.clouddn.com/COCA_47000.js
// @run-at       document-idle
// 
// ==/UserScript==

//添加样式表
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
        return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css.replace(/;/g, ' !important;');
    head.appendChild(style);
}

addGlobalStyle('span_0 { color: black; background-color: #eee; padding-left:0.2em; padding-right:0.2em; } \
                span_1 { color: black; background-color: #EFE7DA; padding-left:0.2em; padding-right:0.2em; } \
                span_2 { color: white; background-color: #BDC9AF; padding-left:0.2em; padding-right:0.2em; } \
                span_3 { color: white; background-color: #A1BEB4; padding-left:0.2em; padding-right:0.2em; } \
                span_4 { color: white; background-color: #20A69A; padding-left:0.2em; padding-right:0.2em; } \
                span_5 { color: white; background-color: #276A73; padding-left:0.2em; padding-right:0.2em; } \
                span_6 { color: white; background-color: #043B40; padding-left:0.2em; padding-right:0.2em; } \
                span_7 { color: white; background-color: #041625; padding-left:0.2em; padding-right:0.2em; }');

var lemmatizer = (function () {
    var step2list = {
            "ational": "ate",
            "tional": "tion",
            "enci": "ence",
            "anci": "ance",
            "izer": "ize",
            "bli": "ble",
            "alli": "al",
            "entli": "ent",
            "eli": "e",
            "ousli": "ous",
            "ization": "ize",
            "ation": "ate",
            "ator": "ate",
            "alism": "al",
            "iveness": "ive",
            "fulness": "ful",
            "ousness": "ous",
            "aliti": "al",
            "iviti": "ive",
            "biliti": "ble",
            "logi": "log"
        },

        step3list = {
            "icate": "ic",
            "ative": "",
            "alize": "al",
            "iciti": "ic",
            "ical": "ic",
            "ful": "",
            "ness": ""
        },

        c = "[^aeiou]", // consonant
        v = "[aeiouy]", // vowel
        C = c + "[^aeiouy]*", // consonant sequence
        V = v + "[aeiou]*", // vowel sequence

        mgr0 = "^(" + C + ")?" + V + C, // [C]VC... is m>0
        meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$", // [C]VC[V] is m=1
        mgr1 = "^(" + C + ")?" + V + C + V + C, // [C]VCVC... is m>1
        s_v = "^(" + C + ")?" + v; // vowel in stem

    return function (w) {
        var stem,
            suffix,
            firstch,
            re,
            re2,
            re3,
            re4,
            origword = w;

        if (w.length < 3) {
            return w;
        }

        firstch = w.substr(0, 1);
        if (firstch == "y") {
            w = firstch.toUpperCase() + w.substr(1);
        }

        // Step 1a
        re = /^(.+?)(ss|i)es$/;
        re2 = /^(.+?)([^s])s$/;

        if (re.test(w)) {
            w = w.replace(re, "$1$2");
        } else if (re2.test(w)) {
            w = w.replace(re2, "$1$2");
        }

        // Step 1b
        re = /^(.+?)eed$/;
        re2 = /^(.+?)(ed|ing)$/;
        if (re.test(w)) {
            var fp = re.exec(w);
            re = new RegExp(mgr0);
            if (re.test(fp[1])) {
                re = /.$/;
                w = w.replace(re, "");
            }
        } else if (re2.test(w)) {
            var fp = re2.exec(w);
            stem = fp[1];
            re2 = new RegExp(s_v);
            if (re2.test(stem)) {
                w = stem;
                re2 = /(at|bl|iz)$/;
                re3 = new RegExp("([^aeiouylsz])\\1$");
                re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");
                if (re2.test(w)) {
                    w = w + "e";
                } else if (re3.test(w)) {
                    re = /.$/;
                    w = w.replace(re, "");
                } else if (re4.test(w)) {
                    w = w + "e";
                }
            }
        }

        // Step 1c
        re = /^(.+?)y$/;
        if (re.test(w)) {
            var fp = re.exec(w);
            stem = fp[1];
            re = new RegExp(s_v);
            if (re.test(stem)) {
                w = stem + "i";
            }
        }

        // Step 2
        re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
        if (re.test(w)) {
            var fp = re.exec(w);
            stem = fp[1];
            suffix = fp[2];
            re = new RegExp(mgr0);
            if (re.test(stem)) {
                w = stem + step2list[suffix];
            }
        }

        // Step 3
        re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
        if (re.test(w)) {
            var fp = re.exec(w);
            stem = fp[1];
            suffix = fp[2];
            re = new RegExp(mgr0);
            if (re.test(stem)) {
                w = stem + step3list[suffix];
            }
        }

        // Step 4
        re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
        re2 = /^(.+?)(s|t)(ion)$/;
        if (re.test(w)) {
            var fp = re.exec(w);
            stem = fp[1];
            re = new RegExp(mgr1);
            if (re.test(stem)) {
                w = stem;
            }
        } else if (re2.test(w)) {
            var fp = re2.exec(w);
            stem = fp[1] + fp[2];
            re2 = new RegExp(mgr1);
            if (re2.test(stem)) {
                w = stem;
            }
        }

        // Step 5
        re = /^(.+?)e$/;
        if (re.test(w)) {
            var fp = re.exec(w);
            stem = fp[1];
            re = new RegExp(mgr1);
            re2 = new RegExp(meq1);
            re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
            if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
                w = stem;
            }
        }

        re = /ll$/;
        re2 = new RegExp(mgr1);
        if (re.test(w) && re2.test(w)) {
            re = /.$/;
            w = w.replace(re, "");
        }

        // and turn initial Y back to y

        if (firstch == "y") {
            w = firstch.toLowerCase() + w.substr(1);
        }
        //console.log("Lemmatizred:" + w);
        return w;
    }
})();

//console.log(lemmatizer("foretted"));
//检查单词是否在列表中
var inWords = function (word) {
    //console.log(words);
    word = word.trim().replace(/[\[\]\s\?\.!-;,:\'\"]+/g, '').toLowerCase();
    var wordIndexL = words.indexOf(lemmatizer(word));
    var wordIndex = words.indexOf(word);
    if (wordIndex >= 0) {
        return (wordIndex);
    } else if (wordIndexL >= 0) {
        return (wordIndexL);
    } else {
        return -1;
    }
};

//console.log("该单词在列表中，词频为" + inWords("the") + 1);
//添加 SPAN
var addSpan = function (selected, selectedS, spanType, isParagraph) {
    if (isParagraph != true) {
        var span = document.createElement("span_" + spanType);
        span.textContent = selectedS;
        var range = selected.getRangeAt(0);
        range.deleteContents();
        range.insertNode(span);
    } else {
        var newTextContent = "";
        selectedS = selectedS.split(" ");
        for (i in selectedS) {
            //console.log(selectedS[i]);
            if (selectedS[i].includes("\n")) {
                var wordInLines = selectedS[i].split("\n");
                var j = 0;
                for (i in wordInLines) {
                    wordInLinesFrequency = checkFrequency(wordInLines[i])
                    if (j == 0) {
                        newTextContent = newTextContent + " <span_" + wordInLinesFrequency + ">" + wordInLines[i] + "</span_" + wordInLinesFrequency + "><br/><br/>";
                    } else {
                        newTextContent = newTextContent + " <span_" + wordInLinesFrequency + ">" + wordInLines[i] + "</span_" + wordInLinesFrequency + ">";
                    }
                    j = 1;
                }
            } else {
                var selectedSResult = checkFrequency(selectedS[i])
                newTextContent = newTextContent + " <span_" + selectedSResult + ">" + selectedS[i] + "</span_" + selectedSResult + ">";
            }
        }

        //console.log(newTextContent);
        var new_spans = document.createElement("new_spans");
        new_spans.innerHTML = newTextContent;
        var range = selected.getRangeAt(0);
        range.deleteContents();
        range.insertNode(new_spans);
    }

};

var checkFrequency = function (selectedS) {
    var inWordsResult = inWords(selectedS);
    if (inWordsResult == -1) {
        return (0);
    } else if (inWordsResult <= 100) {
        return (1);
    } else if (inWordsResult <= 500) {
        return (2);
    } else if (inWordsResult <= 1500) {
        return (3);
    } else if (inWordsResult <= 5000) {
        return (4);
    } else if (inWordsResult <= 9000) {
        return (5);
    } else if (inWordsResult <= 15000) {
        return (6);
    } else if (inWordsResult <= 47000) {
        return (7);
    } else {
        console.log("Unexcepted");
    }
};

var checkElements = function (selected) { //需要完善
    ckString = selected.getRangeAt(0).startContainer.parentNode.innerHTML;
    if (ckString.indexOf("<img") >= 0 || ckString.indexOf("><") >= 0) return;
    return false;
}
//主进程
var main = function () {
    document.getElementsByTagName('body')[0].addEventListener("click", function () {
        var selected = document.getSelection();
        var selectedS = selected.toString();

        if (checkElements(selected) == true) {
            console.log("Skip!!!");
        } else if (selectedS != null && selectedS != "" && selectedS.trim().indexOf(" ") < 0) {
            console.log(inWords("the"));
            if (inWords(selectedS) >= 0) {
                addSpan(selected, selectedS, checkFrequency(selectedS));
            } else if (inWords(selectedS) == -1) {
                console.log("不存在此单词" + selectedS);
                if (selectedS != "," && selectedS != "." && selectedS != "!" && selectedS != '"' && selectedS != "\'" && selectedS != "-" && selectedS != " " && selectedS != "'" && selectedS != ":" && selectedS != "?") {
                    addSpan(selected, selectedS, 0);
                }
            } else {
                console.log("Exception!");
            }

        } else if (selectedS != null && selectedS != "" && selectedS.indexOf(" ") >= 1) {
            console.log("Paragraph!");
            if (selectedS.length >= 2000) {
                var r = confirm("您选择了大量文本，可能会影响系统响应时间，是否继续？");
                if (r) {
                    addSpan(selected, selectedS, 0, true); //0是占位符
                } else {
                    console.log("Canceled!!!");
                }
            } else {
                addSpan(selected, selectedS, 0, true); //0是占位符
            }
        }

        document.getSelection().removeAllRanges(); //运行完成后取消选择
    });
};
//运行主程序
main();
console.log("Is running!!!");