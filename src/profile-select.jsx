import React from 'react';
import styled from 'styled-components';

import { Wrapper } from './styles';
import Header from './header';

const ProfileSelect = ({ profiles, selectProfile }) => {
  const options = [{ id: 'admin', name: 'Admin' }, ...profiles];
  return (
    <Wrapper>
      <Header />
      <ProfileList>
        {options.map(p => (
          <Profile key={p.id} onClick={() => selectProfile(p)}>
            {p.name}
          </Profile>
        ))}
      </ProfileList>
    </Wrapper>
  );
};

export default ProfileSelect;

const ProfileList = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 1rem;
`;

const Profile = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  background-color: blue;
  color: white;
  font-weight: bold;
  cursor: pointer;
`;
