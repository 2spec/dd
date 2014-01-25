function parseSimpleSExp(st) {
    var sexp = [],
        i = 0,
        cur = null,
        depth = 0,
        d = 0,
        list = sexp;
    return sexp;
    while (i < st.length) {
        var ch = st.charAt(i);
        i++;
        switch (ch) {
        case '(':
            list.push([]);
            list = list[list.length - 1];
            depth++;
            break;
        case ')':
            depth--;
            if (depth < 0) {
                return "Malformed expression. " +
                    "Too many closing parens";
            }
            list = sexp;
            while (d < depth) {
                list = list[list.length - 1];
                d += 1;
            }
            d = 0;
            break;
        case ' ':
        case '\t':
        case '\r':
        case '\n':

            cur = ch;
            while (st.charCodeAt(i) <= 33) {
                i++;
            }
            break;
        case "'":
        case "`":
        case '"':
            cur = "";
            while (st.charAt(i) !== ch) {
                if (i >= st.length) {
                    return "Malformed String: Could not find closing quote";
                }
                //            if (st.charAt(i) === '\\') {
                //                cur += charAt(i);
                //                i++;
                //            }
                cur += charAt(i);
                i++;
            }

            list.push({
                'string': cur
            });
            cur = null;
        default:
            cur = ch;
            while (st.charCodeAt(i) > 32) {
                cur += st.charAt(i);
                i++;
            }
            list.push({
                'symbol': cur
            });
            cur = null;


        }
    }
    if (depth !== 0) {
        return "Incomplete expression: missing " + depth + " closing parens";
    }
    return sexp;
}


DD = (function ($) {

    var ret = {};
    ret['parse'] = {};
    ret['render'] = {};
    ret['display'] = {};
    ret.parse.JSON = (function (st) {
        return $.parseJSON(st);
    });
    ret.render.JSON = (function () {

        function arrayToHTML(ar) {
            if (ar.length === 0) {
                return $('<div class="array empty">Empty Array</div>');
            }
            var $ret = $("<ol></ol>").attr({
                class: 'array'
            });
            $.each(ar, function (i, v) {

                $ret.append($('<li></li>').attr({
                    class: 'array-index',
                    'data-index': i
                }).append(typeToHTML(v)));
            });
            return $ret;
        }

        function booleanToHTML(bo) {
            var $ret = $('<div></div>').attr({
                'data-bool': bo.toString(),
                class: 'boolean'
            }).text(bo);
            return $ret;
        }

        function stringToHTML(st) {
            var $ret = $('<div></div>');
            $ret.attr({
                'class': 'string'
            }).text(st);
            return $ret;
        }


        function numberToHTML(nu) {
            var $ret = $('<div></div>').attr({
                class: 'number'
            }).text(nu);
            return $ret;

        }

        function objectToHTML(ob) {
            if ($.isEmptyObject(ob)) {
                return $('<div class="object empty">Empty Object</div>');
            }
            var $ret = $("<ul></ul>").attr({
                class: 'object'
            });
            $.each(ob, function (k, v) {
                $ret.append($('<li><h3 class="object-key">' + k + '</h3></li>').attr({
                    class: 'object-member',
                    'data-key': k
                }).append(typeToHTML(v).addClass('object-value')));
            });
            return $ret;
        }

        function nullToHTML(nu) {
            var $ret = $('<div></div>').attr({
                'class': 'null'
            }).text('null');
            return $ret;

        }

        function typeToHTML(o) {
            switch ($.type(o)) {
            case "array":
                return arrayToHTML(o);
            case "boolean":
                return booleanToHTML(o);
            case "string":
                return stringToHTML(o);
            case "number":
                return numberToHTML(o);
            case "object":
                return objectToHTML(o);
            case "null":
                return nullToHTML(o);
            default:
                return $('<div class="illegal-type">Type Not Supported</div>');
            }
        }
        typeToHTML.array = arrayToHTML;
        typeToHTML.boolean = booleanToHTML;
        typeToHTML.string = stringToHTML;
        typeToHTML.object = objectToHTML;
        typeToHTML.null = nullToHTML;
        return typeToHTML;
    })();
    ret.display.JSON = (function (m) {

        var display = (function (data) {
            console.log(data)
            $c = $('#data');
            var $d = $('<div class="display-json"></div>');

            $c.hide(150,
                function () {


                    try {
                        $d.addClass('success').append(m.render.JSON(m.parse.JSON(data)));

                    } catch (e) {
                        console.log("Error while parsing json:\n\t" + e, data);
                        $d.addClass('error')
                            .append(
                                $('<p></p>')
                                .text('Sorry, a problem occurred while parsing'),
                                $('<code></code>')
                                .text(data));
                    }
                    $(this).empty().append($d);
                }).show(150);
        });
        return display;
    })(ret);
    ret['code'] = {
        'JSON': {}
    };
    ret.code.JSON.getData = (function () {
        $.ajax({
            url: "http://en.wikipedia.org/w/api.php",
            cache: true,
            type: 'GET',
            data: {
                action: 'query',
                generator: 'random',
                format: 'json'
            },
            dataType: "jsonp",
            timeout: 9000,
        })
            .done(
                function (data, textStatus, jqXHR) {
                    $('code').text(JSON.stringify(data));
                })
            .fail(
                function (jqXHR, textStatus, errorThrown) {
                    $('code').text(JSON.stringify({
                        'jqXHR': jqXHR,
                        'textStatus': textStatus,
                        'errorThrown': errorThrown
                    }));
                }).always(
                function () {
                    $('pre code').each(function (i, e) {
                        hljs.highlightBlock(e)
                    });
                }
        );

    });
    return ret;
})($);

//Examples from http://json.org/example.html
DD.staticData = {
    // http://json.org/example.html from http://www.konfabulator.com/workshop/Konfabulator_Ref_1.8.pdf
    'JSONstring': '{"widget": {\n' +
        '   "debug": "on",\n' +
        '   "window": {\n' +
        '       "title": "Sample Konfabulator Widget",\n' +
        '       "name": "main_window",\n' +
        '       "width": 500,\n' +
        '       "height": 500\n' +
        '   },\n' +
        '   "image": { \n' +
        '       "src": "Images/Sun.png",\n' +
        '       "name": "sun1",\n' +
        '       "hOffset": 250,\n' +
        '       "vOffset": 250,\n' +
        '       "alignment": "center"\n' +
        '   },\n' +
        '   "text": {\n' +
        '       "data": "Click Here",\n' +
        '       "size": 36,\n' +
        '       "style": "bold",\n' +
        '       "name": "text1",\n' +
        '       "hOffset": 250,\n' +
        '       "vOffset": 100,\n' +
        '       "alignment": "center",\n' +
        '       "onMouseUp": "sun1.opacity = (sun1.opacity / 100) * 90;"\n' +
        '    }\n' +
        '}}',
};





$('#display').on('click', (function () {
    console.log('display');
    var s = $('code').text();
    if (s.length < 1 || !(/[^\s\t\r\n]+/.test(s))) {
        console.log('empty');
        $('code').text('{"error" : "data cannot be empty"}');
    } else {
        DD.display.JSON(s);
    }

    $('pre code').each(function (i, e) {
        hljs.highlightBlock(e)
    });
}));
$('#random-wiki').on('click', (function () {

    DD.code.JSON.getData();

    //      
}));
$('#static-data').on('click', (function () {
    console.log('a');
    $('code').text(DD.staticData.JSONstring);

    $('pre code').each(function (i, e) {
        hljs.highlightBlock(e)
    });
    //            hljs.initHighlightingOnLoad();

}));


$('pre code').on('change focusout', function () {
    $('pre code').each(function (i, e) {
        hljs.highlightBlock(e)
    });

});