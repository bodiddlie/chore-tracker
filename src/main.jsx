import React from 'react';
import PropTypes from 'prop-types';

import { Wrapper } from './styles';
import { withUser } from './user';
import { db } from './firebase';
import { objectToArray } from './util';
import Admin from './admin';
import ProfileSelect from './profile-select';
import Header from './header';

const profileKey = 'chore-tracker-profile-storage-key';

class Main extends React.Component {
  static childContextTypes = {
    selectedProfile: PropTypes.object,
    clearProfile: PropTypes.func,
  };

  getChildContext() {
    return {
      selectedProfile: this.state.selectedProfile,
      clearProfile: this.clearProfile,
    };
  }

  state = {
    profiles: [],
    selectedProfile: null,
  };

  componentDidMount() {
    const { user } = this.props;
    this.ref = db.ref(`/families/${user.uid}/profiles`);
    this.ref.on('value', snapshot => {
      const profiles = objectToArray(snapshot.val());
      this.setState(prevState => {
        const selectedProfile =
          prevState.selectedProfile ||
          JSON.parse(localStorage.getItem(profileKey)) ||
          (profiles.length > 0 ? null : { id: 'admin', name: 'Admin' });
        localStorage.setItem(profileKey, JSON.stringify(selectedProfile));
        return { profiles, selectedProfile };
      });
    });
  }

  componentWillUnmount() {
    this.ref.off();
  }

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

  selectProfile = profile => {
    localStorage.setItem(profileKey, JSON.stringify(profile));
    this.setState({ selectedProfile: profile });
  };

  clearProfile = () => {
    this.setState(prevState => {
      let selectedProfile = null;
      if (prevState.profiles.length > 0) {
        localStorage.removeItem(profileKey);
      } else {
        selectedProfile = { id: 'admin', name: 'Admin' };
        localStorage.setItem(profileKey, JSON.stringify(selectedProfile));
      }
      return { selectedProfile };
    });
  };

  render() {
    const { profiles, selectedProfile } = this.state;

    return (
      <React.Fragment>
        {!!selectedProfile ? (
          <React.Fragment>
            {selectedProfile.id === 'admin' ? (
              <Admin
                profiles={profiles}
                saveProfile={this.saveProfile}
                deleteProfile={this.deleteProfile}
              />
            ) : (
              <Wrapper>
                <Header total={32.25} />
                <h1>Profile selected - {selectedProfile.name}!</h1>
              </Wrapper>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {profiles.length > 0 ? (
              <ProfileSelect
                profiles={profiles}
                selectProfile={this.selectProfile}
              />
            ) : (
              <Admin
                profiles={profiles}
                saveProfile={this.saveProfile}
                deleteProfile={this.deleteProfile}
              />
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default withUser(Main);
