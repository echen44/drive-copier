class Signout extends React.Component {
  render() {
    return (
      <button className="waves-effect waves-light btn" onClick={() => this.props.onClick()}>
        Sign Out
      </button>
    );
  }
}

class Logo extends React.Component {
  render() {
    return (
      <h3>Drive Copier</h3>
    );
  }
}

class LinksBox extends React.Component {
  render() {
    return (
      <div id="links">
        <div className="row">
          <div className="input-field col s12">
            <textarea id="links-box" name="links" className="materialize-textarea" onChange={this.props.onChange}></textarea>
            <label htmlFor="links-box">Enter Google Drive links (one per line)</label>
          </div>
        </div>
      </div>
    );
  }
}

class PublicSwitch extends React.Component {
  render() {
    return (
      <div className="switch">
        <label>
          Make copies public? (Only to those with the link)
          <input name="public" type="checkbox" checked={this.props.public} onChange={this.props.onChange}></input>
          <span className="lever"></span>
        </label>
      </div>
    );
  }
}

class FolderSelectName extends React.Component {
  render() {
    return (
    <span>{this.props.folderSelectedName}</span>
    )
  }
}

class FolderSelectButton extends React.Component {
  render() {
    const isActive = this.props.buttonsActive;
    if (isActive) {
      return (
        <div id="folder-select">
          <button className="waves-effect waves-light btn" id="picker_button" onClick={this.props.onClick}>Pick a folder</button>
          <FolderSelectName folderSelectedName={this.props.folderSelectedName}/>
        </div>
      )
    } else {
      return (
        <div id="folder-select">
          <button className="btn disabled" id="picker_button" onClick={this.props.onClick}>Pick a folder</button>
          <FolderSelectName folderSelectedName={this.props.folderSelectedName}/>
        </div>
      );
    }
  }
}

class SubmitButton extends React.Component {
  render() {
    const className = this.props.buttonsActive ? "waves-effect waves-light btn" : "btn disabled";
    return (
      <button className={className} id="submit_button" type="submit" onClick={this.props.onClick}>Submit</button>
    )
  }
}

class ResultColumn extends React.Component {
  render() {
    return (
      <tr>
        <td>
          {this.props.item.name}
        </td>
        <td>
          {this.props.item.id
            ? <a target="_blank" href={this.props.item.webViewLink}>{this.props.item.webViewLink}</a>
            : this.props.item.error
          }
        </td>
      </tr>
    )
  }
}

class CopyButton extends React.Component {
  render() {
    return (
      <a id="copy_button" onClick={this.props.onClick} className="right nwaves-effect waves-light btn">Copy links to clipboard</a>
    )
  }
}

class Results extends React.Component {
  render() {
    if (this.props.results) {
      const columns = this.props.results.map((item, j) => {
        return <ResultColumn item={item} key={j}/>
      });

      return (
        <div id="results" style={{display: "block"}}>
          <CopyButton onClick={this.props.copyButtonOnClick}/>
          <table id="results_table">
            <thead>
              <tr>
                  <th>File Name</th>
                  <th>Copy link/Error</th>
              </tr>
            </thead>
            <tbody id="result_columns">
              {columns}
            </tbody>
          </table>
        </div>
      );
    } else {
      return null
    }
  }
}

class Spinner extends React.Component {
  render() {
    const display = this.props.visible ? "block" : "none";
    return (
      <div id="spinner" className="preloader-wrapper large active center2" style={{display: display}}>
        <div className="spinner-layer spinner-green-only">
          <div className="circle-clipper left">
            <div className="circle"></div>
          </div><div className="gap-patch">
            <div className="circle"></div>
          </div><div className="circle-clipper right">
            <div className="circle"></div>
          </div>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.signout = this.signout.bind(this);
  }

  signout() {
    location.href = "/signout";
  }

  render() {
    return (
      <div>
        <Logo/>
        <Signout onClick={this.signout}/>
        <Copier/>
      </div>
    );
  }
}

class Copier extends React.Component {
  constructor(props) {
    super(props);
    this.showPicker = this.showPicker.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.enableButtons = this.enableButtons.bind(this);
    this.disableButtons = this.disableButtons.bind(this);
    this.pickerCallback = this.pickerCallback.bind(this);
    this.submit = this.submit.bind(this);
    this.showSpinner = this.showSpinner.bind(this);
    this.hideSpinner = this.hideSpinner.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);

    this.state = {
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
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  enableButtons() {
    this.setState({
      buttonsActive: true
    })
  }

  disableButtons() {
    this.setState({
      buttonsActive: false
    })
  }

  showSpinner() {
    this.setState({
      spinnerVisible: true
    })
  }

  hideSpinner() {
    this.setState({
      spinnerVisible: false
    })
  }

  pickerCallback(data) {
    if (data.action == window.google.picker.Action.PICKED) {
      folderId = data.docs[0].id;
      this.setState({
        folderSelectedName: data.docs[0].name,
        folderSelectedId: data.docs[0].id,
        pickerVisible: false
      })
    }
    else if (data.action == window.google.picker.Action.CANCEL) {
      this.setState({
        pickerVisible: false
      })
    }
  }

  getToken() {
    return fetch('/token').
      then(function (response) {
        return response.json()
      }).
      then(function (json) {
        return json['access_token'];
      });
  }

  getLinksArray() {
    return this.state.links.split(new RegExp('\\s+'));
  }

  copyToClipboard() {

    let copyThese = [];

    this.state.results.forEach((item) => {
      if (item.id) {
        copyThese.push(item.webViewLink);
      }
    });

    let newClip = copyThese.join('\n');
    let tempInput = document.createElement("textarea");
    tempInput.value = newClip;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
  }

  submit(event) {
    if (!this.state.links) {
      window.M.toast({html: 'Enter Google Drive links'})
    } else if (!this.state.folderSelectedId) {
      window.M.toast({html: 'Pick a folder'})
    } else {
      this.disableButtons();
      this.showSpinner();
      let payload = {
        public: this.state.public,
        links: this.getLinksArray(),
        folderId: this.state.folderSelectedId,
      };
      fetch('/go', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
        'Content-Type': 'application/json'
        }
  
      }).then(function (response) {
          return response.json()
      }).then(data => {
        this.setState({
          results: data.response
        })
        this.enableButtons();
        this.hideSpinner();
      });
    }
  }

  createPicker(access_token1) {
    let view = new window.google.picker.DocsView(window.google.picker.ViewId.FOLDERS);
    view.setMode(window.google.picker.DocsViewMode.LIST);
    view.setSelectFolderEnabled(window.google.picker.DocsViewMode.LIST);
    view.setParent("root");
    view.setEnableDrives(true);
    mypicker = new window.google.picker.PickerBuilder()
      .enableFeature(window.google.picker.Feature.SUPPORT_DRIVES)
      .setOAuthToken(access_token1)
      .addView(view)
      .setCallback(pickerCallback)
      .build();
    mypicker.setVisible(false);

    this.pickerLoaderCallback();
  }

  showPicker() {
    this.setState({
      pickerVisible: true
    });
  }

  componentDidMount() {
    this.getToken().
      then((token) => this.setState({
        token: token
      }));
  }

  render() {
    return (
      <div>
        <LinksBox onChange={this.handleInputChange}/>
        <PublicSwitch public={this.state.public} onChange={this.handleInputChange}/>
        <br></br>
        <FolderSelectButton buttonsActive={this.state.buttonsActive} folderSelectedName={this.state.folderSelectedName} onClick={this.showPicker}/>
        <br></br>
        <SubmitButton buttonsActive={this.state.buttonsActive} onClick={this.submit}/>
        <br></br>
        <Spinner visible={this.state.spinnerVisible}/>
        <Results results={this.state.results} copyButtonOnClick={this.copyToClipboard}/>
        {this.state.token &&
          <GooglePicker pickerVisible={this.state.pickerVisible} token={this.state.token} pickerLoaderCallback={this.enableButtons} onChange={this.pickerCallback}/>
        }
        <pre id="content" style={{whiteSpace: "pre-wrap"}}></pre>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById("root"));
