document.addEventListener("DOMContentLoaded", loadListeners);

let authorizeButton = document.getElementById('authorize_button');

function loadListeners() {
  authorizeButton.onclick = function() {
    location.href = "/login";
  };
}