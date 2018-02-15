import React from 'react';
import { ThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';

import ErrorBoundary from './error-boundary';
import Main from './main';
import { auth, db } from './firebase';
import Login from './login';

class App extends React.Component {
  state = {
    user: null,
    loading: true,
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
        const { uid } = user;
        const endpoint = `/families/${user.uid}`;
        db.ref(endpoint).on('value', snapshot => {
          const saved = snapshot.val();

          if (!saved) {
            db.ref(endpoint).set({ uid });
          }
          this.setState({ user, loading: false });
        });
      } else {
        this.setState({ user: null, loading: false });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <ErrorBoundary message="Something is broken">
        <ThemeProvider
          theme={{
            white: 'white',
            blue: 'hsl(246, 83%, 50%)',
            green: 'hsl(135, 75%, 40%)',
            red: 'hsl(0, 50%, 50%)',
            yellow: 'hsl(60, 60%, 50%)',
            gray: '#676767',
          }}
        >
          {this.state.loading ? (
            <Loading />
          ) : (
            <React.Fragment>
              {!!this.state.user ? <Main /> : <Login />}
            </React.Fragment>
          )}
        </ThemeProvider>
      </ErrorBoundary>
    );
  }
}

export default App;

const Loading = () => (
  <div>
    <h1>Loading...</h1>
  </div>
);
