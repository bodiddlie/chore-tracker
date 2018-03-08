import React from 'react';
import firebase from 'firebase';
import PropTypes from 'prop-types';

class FirebaseProvider extends React.Component {
  state = {
    user: null,
    loading: true,
    app: null,
  };

  static childContextTypes = {
    user: PropTypes.object,
    app: PropTypes.object,
  };

  getChildContext() {
    return { user: this.state.user, app: this.state.app };
  }

  componentDidMount() {
    const { config } = this.props;

    const app = firebase.apps.length
      ? firebase.apps[0]
      : firebase.initializeApp(config);

    this.unsubscribe = app.auth().onAuthStateChanged(user => {
      if (user) {
        /*
        const { uid } = user;
        const endpoint = `/families/${user.uid}`;
        app
          .database()
          .ref(endpoint)
          .on('value', snapshot => {
            const saved = snapshot.val();

            if (!saved) {
              app
                .database()
                .ref(endpoint)
                .set({ uid });
            }
            this.setState({ user, loading: false });
          });
          */
        this.setState({ user, loading: false });
      } else {
        this.setState({ user: null, loading: false });
      }
      //this.setState({ user, loading: false });
    });

    this.setState({ app });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { render, children } = this.props;
    const { loading, user } = this.state;

    if (!!render) {
      return render(loading, user);
    } else {
      return children(loading, user);
    }
  }
}

export default FirebaseProvider;
