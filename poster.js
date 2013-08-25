

function postUrlWithCallback(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(data) {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        //var data = JSON.parse(xhr.responseText);
        callback(xhr.responseText);
      } else {
        callback(null);
      }
    }
  }
  // Note that any URL fetched here must be matched by a permission in
  // the manifest.json file!
  xhr.open('GET', url, true);
  xhr.send();
};