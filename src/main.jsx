import React from 'react';

import { FirebaseQuery } from './fire-fetch';
import Admin from './admin';
import ProfileSelect from './profile-select';
import ChildScreen from './child-screen';
import Header from './header';
import { Loading } from './shared';

const profileKey = 'chore-tracker-profile-storage-key';

class Main extends React.Component {
  state = {
    selectedProfile: JSON.parse(localStorage.getItem(profileKey)),
  };

  onProfileLoad = profiles => {
    this.setState(prevState => {
      const selectedProfile =
        prevState.selectedProfile ||
        JSON.parse(localStorage.getItem(profileKey)) ||
        (profiles.length > 0 ? null : { id: 'admin', name: 'Parent' });
      localStorage.setItem(profileKey, JSON.stringify(selectedProfile));
      return { selectedProfile };
    });
  };

  selectProfile = profile => {
    localStorage.setItem(profileKey, JSON.stringify(profile));
    this.setState({ selectedProfile: profile });
  };

  clearProfile = () => {
    localStorage.removeItem(profileKey);
    this.setState({ selectedProfile: null });
  };

  render() {
    const { selectedProfile } = this.state;

    return (
      <FirebaseQuery path="profiles" on onChange={this.onProfileLoad} toArray>
        {(profiles, loading) => {
          return (
            <React.Fragment>
              <Header
                selectedProfile={selectedProfile}
                clearProfile={this.clearProfile}
              />
              {loading ? (
                <Loading />
              ) : (
                <React.Fragment>
                  {!!selectedProfile ? (
                    <ShowProfile
                      selectedProfile={selectedProfile}
                      profiles={profiles}
                    />
                  ) : (
                    <ProfileSelect
                      profiles={profiles}
                      selectProfile={this.selectProfile}
                    />
                  )}
                </React.Fragment>
              )}
            </React.Fragment>
          );
        }}
      </FirebaseQuery>
    );
  }
}

export default Main;

function ShowProfile({ selectedProfile, profiles }) {
  if (selectedProfile.id === 'admin') {
    return <Admin profiles={profiles} />;
  } else {
    return <ChildScreen profile={selectedProfile} />;
  }
}
