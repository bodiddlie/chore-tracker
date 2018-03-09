import React from 'react';
import PropTypes from 'prop-types';

import { withFbApp } from './provider';

class AuthListener extends React.Component {
  state = {
    user: null,
  };

  static childContextTypes = {
    user: PropTypes.object,
  };

  getChildContext() {
    return { ...this.state };
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
