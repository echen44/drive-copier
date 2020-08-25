class Logo extends React.Component {
  render() {
    return (
      <h3>Drive Copier</h3>
    );
  }
}

class LoginButton extends React.Component {
  render() {
    return (
      <a class="waves-effect waves-light btn-large" id="authorize_button" onClick={this.props.onClick}>Sign in</a>
    );
  }
}

class LoginApp extends React.Component {
  constructor(props) {
    super(props);
  }

  login() {
    location.href = "/login";
  }

  render() {
    return (
      <div>
        <Logo/>
        <LoginButton onClick={this.login}/>
      </div>
    );
  }
}

ReactDOM.render(<LoginApp/>, document.getElementById("root"));