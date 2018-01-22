import React from 'react';
import styled from 'styled-components';

import { Wrapper, Header } from './styles';
import { auth } from './firebase';

class Admin extends React.Component {
  state = {
    editProfile: { id: 'new', name: '' },
  };

  updateName = event => {
    const name = event.target.value;

    this.setState(prevState => {
      const editProfile = {
        ...prevState.editProfile,
        name,
      };
      return { editProfile };
    });
  };

  onSubmit = event => {
    event.preventDefault();
    const { editProfile } = this.state;
    this.props.saveProfile(editProfile);
    this.setState({ editProfile: { id: 'new', name: '' } });
  };

  setEditProfile = editProfile => {
    this.setState({ editProfile });
  };

  render() {
    const { profiles, deleteProfile } = this.props;
    const { editProfile } = this.state;

    return (
      <Wrapper>
        <Header>
          <span>Admin</span>
          <button onClick={() => auth.signOut()}>Sign Out</button>
        </Header>
        <ProfileList>
          <AddEdit onSubmit={this.onSubmit}>
            <input
              type="text"
              value={editProfile.name}
              onChange={this.updateName}
            />
            <button type="submit">Save</button>
          </AddEdit>
          {profiles.map(p => (
            <Profile key={p.id}>
              <button type="button" onClick={() => this.setEditProfile(p)}>
                {p.name}
              </button>
              <button type="button" onClick={() => deleteProfile(p)}>
                X
              </button>
            </Profile>
          ))}
        </ProfileList>
      </Wrapper>
    );
  }
}

export default Admin;

const ProfileList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const AddEdit = styled.form`
  display: flex;
  padding: 1rem;
  justify-content: space-between;
`;

const Profile = styled.div`
  display: flex;
  padding: 1rem;
  justify-content: space-between;
`;
