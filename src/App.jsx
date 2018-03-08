import React from 'react';
import { ThemeProvider } from 'styled-components';

import ErrorBoundary from './error-boundary';
import Main from './main';
import { config } from './firebase';
import { FirebaseProvider, RootRef } from './fire-fetch';
import Login from './login';
import { Loading } from './shared';

class App extends React.Component {
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
            lightgray: '#cdcdcd',
          }}
        >
          <FirebaseProvider config={config}>
            {(loading, user) => (
              <React.Fragment>
                {loading ? (
                  <Loading />
                ) : (
                  <React.Fragment>
                    {user ? (
                      <RootRef path={`/families/${user.uid}`}>
                        <Main />
                      </RootRef>
                    ) : (
                      <Login />
                    )}
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </FirebaseProvider>
        </ThemeProvider>
      </ErrorBoundary>
    );
  }
}

export default App;
