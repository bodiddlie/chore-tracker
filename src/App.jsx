import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ErrorBoundary from './error-boundary';
import Chores from './chores';
import { auth, googleProvider } from './firebase';

class App extends React.Component {
  state = {
    user: null,
  };

  static childContextType = {
    user: PropTypes.object,
  };

  getChildContext() {
    return { user: this.state.user };
  }

  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
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
        <Wrapper>{!!this.state.user ? <Chores /> : <Home />}</Wrapper>
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;
