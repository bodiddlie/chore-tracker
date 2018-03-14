import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';

import { withFbApp } from './provider';

const providers = {
  google: new firebase.auth.GoogleAuthProvider(),
  facebook: new firebase.auth.FacebookAuthProvider(),
  twitter: new firebase.auth.TwitterAuthProvider(),
  github: new firebase.auth.GithubAuthProvider(),
};

class AuthListener extends React.Component {
  state = {
    user: null,
  };

  static childContextTypes = {
    user: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    signInProvider: PropTypes.func,
    signInEmail: PropTypes.func,
  };

  getChildContext() {
    return {
      user: this.state.user,
      signInProvider: this.signInProvider,
      signInEmail: this.signInEmail,
    };
  }

  componentDidMount() {
    const { fbapp } = this.props;

    if (!fbapp) return;

    this.unsubscribe = fbapp.auth().onAuthStateChanged(user => {
      this.setState({ user: user || false });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  signInProvider = (method, redirect) => {
    if (redirect) {
      this.props.fbapp
        .auth()
        .signInWithRedirect(providers[method])
        .catch(alert);
    } else {
      this.props.fbapp.auth().signInWithPopup(providers[method]);
    }
  };

  signInEmail = (email, password, isCreating) => {
    if (isCreating) {
      this.props.fbapp.auth().createUserWithEmailAndPassword(email, password);
    } else {
      this.props.fbapp.auth().signInWithEmailAndPassword(email, password);
    }
  };

  render() {
    const { render, children } = this.props;

    if (render) {
      return render(this.state.user);
    } else {
      return children(this.state.user);
    }
  }
}

export default withFbApp(AuthListener);

export class User extends React.Component {
  static contextTypes = {
    user: PropTypes.object,
  };

  render() {
    return this.props.children(this.context.user);
  }
}

export function withUser(Component) {
  return class extends React.Component {
    render() {
      return <User>{user => <Component user={user} {...this.props} />}</User>;
    }
  };
}

export class SignIn extends React.Component {
  static contextTypes = {
    signInProvider: PropTypes.func,
    signInEmail: PropTypes.func,
  };

  render() {
    return this.props.children({ ...this.context });
  }
}

export function withSignIn(Component) {
  return class extends React.Component {
    render() {
      return (
        <SignIn>{funcs => <Component {...funcs} {...this.props} />}</SignIn>
      );
    }
  };
}
