var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Logo = function (_React$Component) {
  _inherits(Logo, _React$Component);

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

var LoginButton = function (_React$Component2) {
  _inherits(LoginButton, _React$Component2);

  function LoginButton() {
    _classCallCheck(this, LoginButton);

    return _possibleConstructorReturn(this, (LoginButton.__proto__ || Object.getPrototypeOf(LoginButton)).apply(this, arguments));
  }

  _createClass(LoginButton, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "a",
        { "class": "waves-effect waves-light btn-large", id: "authorize_button", onClick: this.props.onClick },
        "Sign in"
      );
    }
  }]);

  return LoginButton;
}(React.Component);

var LoginApp = function (_React$Component3) {
  _inherits(LoginApp, _React$Component3);

  function LoginApp(props) {
    _classCallCheck(this, LoginApp);

    return _possibleConstructorReturn(this, (LoginApp.__proto__ || Object.getPrototypeOf(LoginApp)).call(this, props));
  }

  _createClass(LoginApp, [{
    key: "login",
    value: function login() {
      location.href = "/login";
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(Logo, null),
        React.createElement(LoginButton, { onClick: this.login })
      );
    }
  }]);

  return LoginApp;
}(React.Component);

ReactDOM.render(React.createElement(LoginApp, null), document.getElementById("root"));