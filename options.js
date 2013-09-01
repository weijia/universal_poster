// Save this script as `options.js`

// Saves options to localStorage.
function save_options(e) {
  var field = $(e.target).parents(".input-fields");
  $.each($("input", field), function(key, value){
    localStorage[value.id] = value.value;
  });
  
  // Update status to let user know options were saved.
  var status = $(".status", field)[0];
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  $.each($("input"), function(key, value){
    console.log(key, value, value.id, value.value);
    if(localStorage[value.id])
        value.value = localStorage[value.id];
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
//document.querySelector('.save').addEventListener('click', save_options);
$(".save").click(save_options);