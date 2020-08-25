class GooglePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    }
  }
  
  showPicker() {
    this.state.picker.setVisible(true);
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

  createPicker(token) {
    let view = new window.google.picker.DocsView(window.google.picker.ViewId.FOLDERS);
    view.setMode(window.google.picker.DocsViewMode.LIST);
    view.setSelectFolderEnabled(window.google.picker.DocsViewMode.LIST);
    view.setParent("root");
    view.setEnableDrives(true);
    let picker = new window.google.picker.PickerBuilder()
      .enableFeature(window.google.picker.Feature.SUPPORT_DRIVES)
      .setOAuthToken(this.props.token)
      .addView(view)
      .setCallback(this.props.onChange)
      .build();
    this.setState({
      picker: picker,
      loaded: true
    })
    this.props.pickerLoaderCallback();
  }

  componentDidMount() {
    window.gapi.load('picker', () => this.createPicker(this.props.token));
  }

  render() {
    if (this.state.loaded) {
      this.state.picker.setVisible(this.props.pickerVisible);
    }
    return null
  }
}