var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Signout = function (_React$Component) {
  _inherits(Signout, _React$Component);

  function Signout() {
    _classCallCheck(this, Signout);

    return _possibleConstructorReturn(this, (Signout.__proto__ || Object.getPrototypeOf(Signout)).apply(this, arguments));
  }

  _createClass(Signout, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return React.createElement(
        "button",
        { className: "waves-effect waves-light btn", onClick: function onClick() {
            return _this2.props.onClick();
          } },
        "Sign Out"
      );
    }
  }]);

  return Signout;
}(React.Component);

var Logo = function (_React$Component2) {
  _inherits(Logo, _React$Component2);

  function Logo() {
    _classCallCheck(this, Logo);

    return _possibleConstructorReturn(this, (Logo.__proto__ || Object.getPrototypeOf(Logo)).apply(this, arguments));
  }

  _createClass(Logo, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "h3",
        null,
        "Drive Copier"
      );
    }
  }]);

  return Logo;
}(React.Component);

var LinksBox = function (_React$Component3) {
  _inherits(LinksBox, _React$Component3);

  function LinksBox() {
    _classCallCheck(this, LinksBox);

    return _possibleConstructorReturn(this, (LinksBox.__proto__ || Object.getPrototypeOf(LinksBox)).apply(this, arguments));
  }

  _createClass(LinksBox, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { id: "links" },
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "div",
            { className: "input-field col s12" },
            React.createElement("textarea", { id: "links-box", name: "links", className: "materialize-textarea", onChange: this.props.onChange }),
            React.createElement(
              "label",
              { htmlFor: "links-box" },
              "Enter Google Drive links (one per line)"
            )
          )
        )
      );
    }
  }]);

  return LinksBox;
}(React.Component);

var PublicSwitch = function (_React$Component4) {
  _inherits(PublicSwitch, _React$Component4);

  function PublicSwitch() {
    _classCallCheck(this, PublicSwitch);

    return _possibleConstructorReturn(this, (PublicSwitch.__proto__ || Object.getPrototypeOf(PublicSwitch)).apply(this, arguments));
  }

  _createClass(PublicSwitch, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "switch" },
        React.createElement(
          "label",
          null,
          "Make copies public? (Only to those with the link)",
          React.createElement("input", { name: "public", type: "checkbox", checked: this.props.public, onChange: this.props.onChange }),
          React.createElement("span", { className: "lever" })
        )
      );
    }
  }]);

  return PublicSwitch;
}(React.Component);

var FolderSelectName = function (_React$Component5) {
  _inherits(FolderSelectName, _React$Component5);

  function FolderSelectName() {
    _classCallCheck(this, FolderSelectName);

    return _possibleConstructorReturn(this, (FolderSelectName.__proto__ || Object.getPrototypeOf(FolderSelectName)).apply(this, arguments));
  }

  _createClass(FolderSelectName, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "span",
        null,
        this.props.folderSelectedName
      );
    }
  }]);

  return FolderSelectName;
}(React.Component);

var FolderSelectButton = function (_React$Component6) {
  _inherits(FolderSelectButton, _React$Component6);

  function FolderSelectButton() {
    _classCallCheck(this, FolderSelectButton);

    return _possibleConstructorReturn(this, (FolderSelectButton.__proto__ || Object.getPrototypeOf(FolderSelectButton)).apply(this, arguments));
  }

  _createClass(FolderSelectButton, [{
    key: "render",
    value: function render() {
      var isActive = this.props.buttonsActive;
      if (isActive) {
        return React.createElement(
          "div",
          { id: "folder-select" },
          React.createElement(
            "button",
            { className: "waves-effect waves-light btn", id: "picker_button", onClick: this.props.onClick },
            "Pick a folder"
          ),
          React.createElement(FolderSelectName, { folderSelectedName: this.props.folderSelectedName })
        );
      } else {
        return React.createElement(
          "div",
          { id: "folder-select" },
          React.createElement(
            "button",
            { className: "btn disabled", id: "picker_button", onClick: this.props.onClick },
            "Pick a folder"
          ),
          React.createElement(FolderSelectName, { folderSelectedName: this.props.folderSelectedName })
        );
      }
    }
  }]);

  return FolderSelectButton;
}(React.Component);

var SubmitButton = function (_React$Component7) {
  _inherits(SubmitButton, _React$Component7);

  function SubmitButton() {
    _classCallCheck(this, SubmitButton);

    return _possibleConstructorReturn(this, (SubmitButton.__proto__ || Object.getPrototypeOf(SubmitButton)).apply(this, arguments));
  }

  _createClass(SubmitButton, [{
    key: "render",
    value: function render() {
      var className = this.props.buttonsActive ? "waves-effect waves-light btn" : "btn disabled";
      return React.createElement(
        "button",
        { className: className, id: "submit_button", type: "submit", onClick: this.props.onClick },
        "Submit"
      );
    }
  }]);

  return SubmitButton;
}(React.Component);

var ResultColumn = function (_React$Component8) {
  _inherits(ResultColumn, _React$Component8);

  function ResultColumn() {
    _classCallCheck(this, ResultColumn);

    return _possibleConstructorReturn(this, (ResultColumn.__proto__ || Object.getPrototypeOf(ResultColumn)).apply(this, arguments));
  }

  _createClass(ResultColumn, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "tr",
        null,
        React.createElement(
          "td",
          null,
          this.props.item.name
        ),
        React.createElement(
          "td",
          null,
          this.props.item.id ? React.createElement(
            "a",
            { target: "_blank", href: this.props.item.webViewLink },
            this.props.item.webViewLink
          ) : this.props.item.error
        )
      );
    }
  }]);

  return ResultColumn;
}(React.Component);

var CopyButton = function (_React$Component9) {
  _inherits(CopyButton, _React$Component9);

  function CopyButton() {
    _classCallCheck(this, CopyButton);

    return _possibleConstructorReturn(this, (CopyButton.__proto__ || Object.getPrototypeOf(CopyButton)).apply(this, arguments));
  }

  _createClass(CopyButton, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "a",
        { id: "copy_button", onClick: this.props.onClick, className: "right nwaves-effect waves-light btn" },
        "Copy links to clipboard"
      );
    }
  }]);

  return CopyButton;
}(React.Component);

var Results = function (_React$Component10) {
  _inherits(Results, _React$Component10);

  function Results() {
    _classCallCheck(this, Results);

    return _possibleConstructorReturn(this, (Results.__proto__ || Object.getPrototypeOf(Results)).apply(this, arguments));
  }

  _createClass(Results, [{
    key: "render",
    value: function render() {
      if (this.props.results) {
        var columns = this.props.results.map(function (item, j) {
          return React.createElement(ResultColumn, { item: item, key: j });
        });

        return React.createElement(
          "div",
          { id: "results", style: { display: "block" } },
          React.createElement(CopyButton, { onClick: this.props.copyButtonOnClick }),
          React.createElement(
            "table",
            { id: "results_table" },
            React.createElement(
              "thead",
              null,
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  null,
                  "File Name"
                ),
                React.createElement(
                  "th",
                  null,
                  "Copy link/Error"
                )
              )
            ),
            React.createElement(
              "tbody",
              { id: "result_columns" },
              columns
            )
          )
        );
      } else {
        return null;
      }
    }
  }]);

  return Results;
}(React.Component);

var Spinner = function (_React$Component11) {
  _inherits(Spinner, _React$Component11);

  function Spinner() {
    _classCallCheck(this, Spinner);

    return _possibleConstructorReturn(this, (Spinner.__proto__ || Object.getPrototypeOf(Spinner)).apply(this, arguments));
  }

  _createClass(Spinner, [{
    key: "render",
    value: function render() {
      var display = this.props.visible ? "block" : "none";
      return React.createElement(
        "div",
        { id: "spinner", className: "preloader-wrapper large active center2", style: { display: display } },
        React.createElement(
          "div",
          { className: "spinner-layer spinner-green-only" },
          React.createElement(
            "div",
            { className: "circle-clipper left" },
            React.createElement("div", { className: "circle" })
          ),
          React.createElement(
            "div",
            { className: "gap-patch" },
            React.createElement("div", { className: "circle" })
          ),
          React.createElement(
            "div",
            { className: "circle-clipper right" },
            React.createElement("div", { className: "circle" })
          )
        )
      );
    }
  }]);

  return Spinner;
}(React.Component);

var App = function (_React$Component12) {
  _inherits(App, _React$Component12);

  function App(props) {
    _classCallCheck(this, App);

    var _this13 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this13.signout = _this13.signout.bind(_this13);
    return _this13;
  }

  _createClass(App, [{
    key: "signout",
    value: function signout() {
      location.href = "/signout";
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(Logo, null),
        React.createElement(Signout, { onClick: this.signout }),
        React.createElement(Copier, null)
      );
    }
  }]);

  return App;
}(React.Component);

var Copier = function (_React$Component13) {
  _inherits(Copier, _React$Component13);

  function Copier(props) {
    _classCallCheck(this, Copier);

    var _this14 = _possibleConstructorReturn(this, (Copier.__proto__ || Object.getPrototypeOf(Copier)).call(this, props));

    _this14.showPicker = _this14.showPicker.bind(_this14);
    _this14.handleInputChange = _this14.handleInputChange.bind(_this14);
    _this14.enableButtons = _this14.enableButtons.bind(_this14);
    _this14.disableButtons = _this14.disableButtons.bind(_this14);
    _this14.pickerCallback = _this14.pickerCallback.bind(_this14);
    _this14.submit = _this14.submit.bind(_this14);
    _this14.showSpinner = _this14.showSpinner.bind(_this14);
    _this14.hideSpinner = _this14.hideSpinner.bind(_this14);
    _this14.copyToClipboard = _this14.copyToClipboard.bind(_this14);

    _this14.state = {
      buttonsActive: false,
      public: true,
      folderSelectedName: null,
      folderSelectedId: null,
      pickerVisible: false,
      spinnerVisible: false,
      token: null,
      links: null,
      results: null
    };
    return _this14;
  }

  _createClass(Copier, [{
    key: "handleInputChange",
    value: function handleInputChange(event) {
      var target = event.target;
      var value = target.type === 'checkbox' ? target.checked : target.value;
      var name = target.name;
      this.setState(_defineProperty({}, name, value));
    }
  }, {
    key: "enableButtons",
    value: function enableButtons() {
      this.setState({
        buttonsActive: true
      });
    }
  }, {
    key: "disableButtons",
    value: function disableButtons() {
      this.setState({
        buttonsActive: false
      });
    }
  }, {
    key: "showSpinner",
    value: function showSpinner() {
      this.setState({
        spinnerVisible: true
      });
    }
  }, {
    key: "hideSpinner",
    value: function hideSpinner() {
      this.setState({
        spinnerVisible: false
      });
    }
  }, {
    key: "pickerCallback",
    value: function pickerCallback(data) {
      if (data.action == window.google.picker.Action.PICKED) {
        folderId = data.docs[0].id;
        this.setState({
          folderSelectedName: data.docs[0].name,
          folderSelectedId: data.docs[0].id,
          pickerVisible: false
        });
      } else if (data.action == window.google.picker.Action.CANCEL) {
        this.setState({
          pickerVisible: false
        });
      }
    }
  }, {
    key: "getToken",
    value: function getToken() {
      return fetch('/token').then(function (response) {
        return response.json();
      }).then(function (json) {
        return json['access_token'];
      });
    }
  }, {
    key: "getLinksArray",
    value: function getLinksArray() {
      return this.state.links.split(new RegExp('\\s+'));
    }
  }, {
    key: "copyToClipboard",
    value: function copyToClipboard() {

      var copyThese = [];

      this.state.results.forEach(function (item) {
        if (item.id) {
          copyThese.push(item.webViewLink);
        }
      });

      var newClip = copyThese.join('\n');
      var tempInput = document.createElement("textarea");
      tempInput.value = newClip;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
    }
  }, {
    key: "submit",
    value: function submit(event) {
      var _this15 = this;

      if (!this.state.links) {
        window.M.toast({ html: 'Enter Google Drive links' });
      } else if (!this.state.folderSelectedId) {
        window.M.toast({ html: 'Pick a folder' });
      } else {
        this.disableButtons();
        this.showSpinner();
        var payload = {
          public: this.state.public,
          links: this.getLinksArray(),
          folderId: this.state.folderSelectedId
        };
        fetch('/go', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json'
          }

        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          _this15.setState({
            results: data.response
          });
          _this15.enableButtons();
          _this15.hideSpinner();
        });
      }
    }
  }, {
    key: "createPicker",
    value: function createPicker(access_token1) {
      var view = new window.google.picker.DocsView(window.google.picker.ViewId.FOLDERS);
      view.setMode(window.google.picker.DocsViewMode.LIST);
      view.setSelectFolderEnabled(window.google.picker.DocsViewMode.LIST);
      view.setParent("root");
      view.setEnableDrives(true);
      mypicker = new window.google.picker.PickerBuilder().enableFeature(window.google.picker.Feature.SUPPORT_DRIVES).setOAuthToken(access_token1).addView(view).setCallback(pickerCallback).build();
      mypicker.setVisible(false);

      this.pickerLoaderCallback();
    }
  }, {
    key: "showPicker",
    value: function showPicker() {
      this.setState({
        pickerVisible: true
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this16 = this;

      this.getToken().then(function (token) {
        return _this16.setState({
          token: token
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(LinksBox, { onChange: this.handleInputChange }),
        React.createElement(PublicSwitch, { "public": this.state.public, onChange: this.handleInputChange }),
        React.createElement("br", null),
        React.createElement(FolderSelectButton, { buttonsActive: this.state.buttonsActive, folderSelectedName: this.state.folderSelectedName, onClick: this.showPicker }),
        React.createElement("br", null),
        React.createElement(SubmitButton, { buttonsActive: this.state.buttonsActive, onClick: this.submit }),
        React.createElement("br", null),
        React.createElement(Spinner, { visible: this.state.spinnerVisible }),
        React.createElement(Results, { results: this.state.results, copyButtonOnClick: this.copyToClipboard }),
        this.state.token && React.createElement(GooglePicker, { pickerVisible: this.state.pickerVisible, token: this.state.token, pickerLoaderCallback: this.enableButtons, onChange: this.pickerCallback }),
        React.createElement("pre", { id: "content", style: { whiteSpace: "pre-wrap" } })
      );
    }
  }]);

  return Copier;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById("root"));