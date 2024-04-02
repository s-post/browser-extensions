$(document).ready( function() {




    chrome.storage.local.get( { apikey: "" }, function (items) {
        // To avoid checking items.css we could specify storage.get({css: ''}) to
        // return a default value of '' if there is no css value yet.
            console.dir(items);
          $("#apikey").val(items.apikey);
        
        
      });


    $("#saveButton").on("click", save);

});

function save() {
    const apikey = $("#apikey").val();

    chrome.storage.local.set({ apikey : apikey});

}