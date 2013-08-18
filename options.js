// Save this script as `options.js`

// Saves options to localStorage.
function save_options() {
  var usernameInput = document.getElementById("username");
  var username = usernameInput.value;
  localStorage["username"] = username;
  var passwordInput = document.getElementById("password");
  var password = passwordInput.value;
  localStorage["password"] = password;


  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var username = localStorage["username"];
  if (username) {
    var usernameInput = document.getElementById("username");
    usernameInput.value = username;
  }

  var password = localStorage["password"];
  //console.log(password);
  if (password) {
    var passwordInput = document.getElementById("password");
    passwordInput.value = password;
  }

}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);