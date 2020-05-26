// Array of API discovery doc URLs for APIs used by the quickstart
let DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
let SCOPES = 'https://www.googleapis.com/auth/drive.file';

document.addEventListener("DOMContentLoaded", loadListeners);

let signoutButton = document.getElementById('signout_button');
let pickerButton = document.getElementById('picker_button');
let linksBox = document.getElementById('links-box');
let folderSelected = document.getElementById('folder_selected');
let public = document.getElementById('public');
let submitButton = document.getElementById('submit_button');
let resultColumns = document.getElementById('result_columns');
let spinner = document.getElementById('spinner');
let resultsTable = document.getElementById('results_table');
let results = document.getElementById('results');
let copyButton = document.getElementById('copy_button');

function loadListeners() {
  signoutButton.onclick = function() {
    location.href = "/signout";
  };
  submitButton.onclick = submit;
  copyButton.onclick = copyToClipboard;
}

let mypicker;
let links;
let folderName;
let folderId;

function handleClientLoad() {
  gapi.load('picker', getToken);
}

function getToken() {
  fetch('/token').
    then(function (response) {
      return response.json()
    }).
    then(function (json) {
      createPicker(json['access_token'])
    });
}

function createPicker(access_token1) {
  let view = new google.picker.DocsView(google.picker.ViewId.FOLDERS);
  view.setMode(google.picker.DocsViewMode.LIST);
  view.setSelectFolderEnabled(true);
  view.setParent("root");
  view.setEnableDrives(true);
  mypicker = new google.picker.PickerBuilder()
    .enableFeature(google.picker.Feature.SUPPORT_DRIVES)
    .setOAuthToken(access_token1)
    .addView(view)
    .setCallback(pickerCallback)
    .build();
  mypicker.setVisible(false);
  pickerButton.onclick = showPicker;
  enableButtons();
}

function enableButtons() {
  picker_button.className = "waves-effect waves-light btn";
  submit_button.className = "waves-effect waves-light btn";
}

function disableButtons() {
  picker_button.className = "btn disabled";
  submit_button.className = "btn disabled";
}

function removeSpinner() {
  spinner.style.display = "none";
}

function showSpinner() {
  spinner.style.display = "block";
}

function removeTable() {
  results.style.display = "none";
}

function showTable() {
  results.style.display = "block";
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  let pre = document.getElementById('content');
  let textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

function showPicker() {
  if (mypicker) {
      mypicker.setVisible(true);
  }
}

function getLinksArray() {
  let raw = linksBox.value;
  return raw.split(new RegExp('\\s+'));
}

// A simple callback implementation.
function pickerCallback(data) {
  if (data.action == google.picker.Action.PICKED) {
    folderId = data.docs[0].id;
    folder_selected.innerHTML = data.docs[0].name;
  }
  else if (data.action == google.picker.Action.CANCEL) {
    mypicker.setVisible(false);

  }
}

function submit() {
  if (folderId) {
    removeTable();
    disableButtons();
    showSpinner();
    let payload = {
      public: public.checked,
      links: getLinksArray(),
      folderId: folderId,
    };
    fetch('/go', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
      'Content-Type': 'application/json'
      }

    }).then(function (response) {
        displayResponse(response);
    });
  }
  else {
    M.toast({html: 'Pick a folder'})
  }

}

function copyToClipboard() {
  let newClip = links.join('\n');
  let tempInput = document.createElement("textarea");
  tempInput.value = newClip;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
}

function displayResponse(response) {
  response.json().then(data => {
    resultColumns.innerHTML = "";
    links = [];
    for (const item of data.response) {
      if (item.copy_id) {
        links.push(item.link);
        resultColumns.innerHTML += "<tr>\n" + "<td>" + item.name + "</td>\n" + "<td>" +  "<a target=\"_blank\" href=\"" + item.link + "\">" + item.link + "</a>"  + "</td>\n"
      }
      else {
        resultColumns.innerHTML += "<tr>\n" + "<td>" + item.name + "</td>\n" + "<td>" + item.error + "</td>\n"
      }
    }
    removeSpinner();
    showTable();
    enableButtons();
  });
}