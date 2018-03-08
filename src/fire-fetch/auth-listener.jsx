import React from 'react';
import PropTypes from 'prop-types';

class AuthListener extends React.Component {
  state = {
    user: null,
  };

  static childContextTypes = {
    user: PropTypes.object,
  };

  static contextTypes = {
    fbapp: PropTypes.object,
  };

  getChildContext() {
    return { ...this.state };
  }

  componentDidMount() {
    const { fbapp } = this.context;

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

export default AuthListener;
