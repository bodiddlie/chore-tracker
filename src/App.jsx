import React from 'react';
import { ThemeProvider } from 'styled-components';

import ErrorBoundary from './error-boundary';
import Main from './main';
import { config } from './firebase';
import { FirebaseProvider, RootRef } from './fire-fetch';
import Login from './login';

class App extends React.Component {
  render() {
    return (
      <ErrorBoundary message="Something is broken">
        <FirebaseProvider config={config}>
          {(loading, user) => (
            <RootRef path={`/families/${user ? user.uid : ''}`}>
              <ThemeProvider
                theme={{
                  white: 'white',
                  blue: 'hsl(246, 83%, 50%)',
                  green: 'hsl(135, 75%, 40%)',
                  red: 'hsl(0, 50%, 50%)',
                  yellow: 'hsl(60, 60%, 50%)',
                  gray: '#676767',
                  lightgray: '#cdcdcd',
                }}
              >
                {loading ? (
                  <Loading />
                ) : (
                  <React.Fragment>
                    {!!user ? <Main /> : <Login />}
                  </React.Fragment>
                )}
              </ThemeProvider>
            </RootRef>
          )}
        </FirebaseProvider>
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
