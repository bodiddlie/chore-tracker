import React from 'react';
import firebase from 'firebase';
import PropTypes from 'prop-types';

class FirebaseProvider extends React.Component {
  state = {
    fbapp: null,
  };

  static childContextTypes = {
    fbapp: PropTypes.object,
  };

  getChildContext() {
    return { ...this.state };
  }

  componentDidMount() {
    const { config } = this.props;

    const fbapp = firebase.apps.length
      ? firebase.apps[0]
      : firebase.initializeApp(config);

    this.setState({ fbapp });
  }

  render() {
    return this.state.fbapp === null ? null : this.props.children;
  }
}

export default FirebaseProvider;
