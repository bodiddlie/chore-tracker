import React from 'react';
import styled from 'styled-components';

import { withUser } from './user';
import { db } from './firebase';
import { objectToArray } from './util';
import Admin from './admin';

class Main extends React.Component {
  state = {
    profiles: [],
  };

  saveProfile = profile => {
    if (profile.id === 'new') {
      const newProfile = this.ref.push();
      newProfile.set({
        name: profile.name,
        id: newProfile.key,
      });
    } else {
      this.ref.child(profile.id).set(profile);
    }
  };

  deleteProfile = profile => {
    this.ref.child(profile.id).remove();
  };

  componentDidMount() {
    const { user } = this.props;
    this.ref = db.ref(`/families/${user.uid}/profiles`);
    this.ref.on('value', snapshot => {
      const profiles = objectToArray(snapshot.val());
      this.setState({ profiles });
    });
  }

  componentWillUnmount() {
    this.ref.off();
  }

  render() {
    const { profiles } = this.state;

    return (
      <React.Fragment>
        <Admin
          profiles={profiles}
          saveProfile={this.saveProfile}
          deleteProfile={this.deleteProfile}
        />
      </React.Fragment>
    );
  }
}

export default withUser(Main);
