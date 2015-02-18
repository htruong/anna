var dict = new ViDict();


function getDict() {
    $.getJSON( "viet.json", function( data ) {
        $.each( data.dict, function( key, val ) {
            dict.add(val.w, val.attr);
        });
    });      
}



function V(w) {
    return new ViWord(w);
}

function submitQuery() {
    try {
        var ret = [];
        var q = $("#q").val();
        q = q.split("\n").join("").split("\t").join(" ");
        console.log(q)
        eval("ret = " + q + ";");
        console.log(ret);
        var rettext = "";
        if (ret.length == 0) {
            $("#results").text("Word not found.");
            return false;
        }
        for (var i = 0; i < ret.length; i++) {
            rettext += ret[i].w + "\n";
        }
        $("#results").text("" + ret.length + " results found.\n" + rettext);
    } catch(err) {
        alert("You have an error in your query, please try again.");
    }
    

    return false;
}


function enableTabsOnTextbox() {

    $(document).delegate('#q', 'keydown', function(e) {
      var keyCode = e.keyCode || e.which;

      if (keyCode == 9) {
        e.preventDefault();
        var start = $(this).get(0).selectionStart;
        var end = $(this).get(0).selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        $(this).val($(this).val().substring(0, start)
                    + "\t"
                    + $(this).val().substring(end));

        // put caret at right position again
        $(this).get(0).selectionStart =
        $(this).get(0).selectionEnd = start + 1;
      }
    });

}


function prep() {
    enableTabsOnTextbox();
    getDict();
    $('#samples').toggle();
}

function showSamples() {
    $('#samples').toggle();
    return false;
}

$( document ).ready( prep )