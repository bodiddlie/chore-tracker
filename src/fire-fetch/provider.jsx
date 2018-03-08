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

export class FirebaseApp extends React.Component {
  static contextTypes = {
    fbapp: PropTypes.object,
  };

  render() {
    const { render, children } = this.props;

    if (render) {
      return render(this.context.fbapp);
    } else {
      return children(this.context.fbapp);
    }
  }
}

export function withFbApp(Component) {
  return class extends React.Component {
    render() {
      return (
        <FirebaseApp>
          {fbapp => <Component fbapp={fbapp} {...this.props} />}
        </FirebaseApp>
      );
    }
  };
}
