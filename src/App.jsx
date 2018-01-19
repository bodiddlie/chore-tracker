import React from 'react';
import PropTypes from 'prop-types';

import ErrorBoundary from './error-boundary';
import Main from './main';
import { auth, googleProvider, db } from './firebase';

class App extends React.Component {
  state = {
    user: null,
  };

  static childContextTypes = {
    user: PropTypes.object,
  };

  getChildContext() {
    return { user: this.state.user };
  }

  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, uid } = user;
        const endpoint = `/families/${user.uid}`;
        db.ref(endpoint).on('value', snapshot => {
          const saved = snapshot.val();

          if (saved) {
            this.setState({ user: saved });
          } else {
            db.ref(endpoint).set({ displayName, uid });
            this.setState({ user });
          }
        });
      } else {
        this.setState({ user: null });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <ErrorBoundary message="Something is broken">
        {!!this.state.user ? <Main /> : <Home />}
      </ErrorBoundary>
    );
  }
}

export default App;

const Home = () => (
  <div>
    <h1>Hi there</h1>
    <button
      onClick={() => {
        auth.signInWithPopup(googleProvider);
      }}
    >
      Sign In
    </button>
  </div>
);
