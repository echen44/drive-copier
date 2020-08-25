var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GooglePicker = function (_React$Component) {
  _inherits(GooglePicker, _React$Component);

  function GooglePicker(props) {
    _classCallCheck(this, GooglePicker);

    var _this = _possibleConstructorReturn(this, (GooglePicker.__proto__ || Object.getPrototypeOf(GooglePicker)).call(this, props));

    _this.state = {
      loaded: false
    };
    return _this;
  }

  _createClass(GooglePicker, [{
    key: 'showPicker',
    value: function showPicker() {
      this.state.picker.setVisible(true);
    }
  }, {
    key: 'getToken',
    value: function getToken() {
      return fetch('/token').then(function (response) {
        return response.json();
      }).then(function (json) {
        return json['access_token'];
      });
    }
  }, {
    key: 'createPicker',
    value: function createPicker(token) {
      var view = new window.google.picker.DocsView(window.google.picker.ViewId.FOLDERS);
      view.setMode(window.google.picker.DocsViewMode.LIST);
      view.setSelectFolderEnabled(window.google.picker.DocsViewMode.LIST);
      view.setParent("root");
      view.setEnableDrives(true);
      var picker = new window.google.picker.PickerBuilder().enableFeature(window.google.picker.Feature.SUPPORT_DRIVES).setOAuthToken(this.props.token).addView(view).setCallback(this.props.onChange).build();
      this.setState({
        picker: picker,
        loaded: true
      });
      this.props.pickerLoaderCallback();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      window.gapi.load('picker', function () {
        return _this2.createPicker(_this2.props.token);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.state.loaded) {
        this.state.picker.setVisible(this.props.pickerVisible);
      }
      return null;
    }
  }]);

  return GooglePicker;
}(React.Component);