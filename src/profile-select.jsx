import React from 'react';
import styled from 'styled-components';
import { FirebaseQuery } from 'fire-fetch';

import { objectToArray } from './util';
import { Loading } from './shared';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function printAmount(amount) {
  const val = formatter.format(amount);
  return val === 'NaN' ? '' : val;
}

class ProfileSelect extends React.Component {
  state = {
    profiles: [],
  };

  handleTotal = serverProfiles => {
    const profiles = serverProfiles.map(p => {
      const total = objectToArray(p.completedChores).reduce(
        (prev, cur) => prev + cur.value,
        0
      );
      return { id: p.id, name: p.name, total };
    });
    this.setState({ profiles });
  };

  render() {
    const { profiles } = this.state;
    const { selectProfile } = this.props;
    const options = [{ id: 'admin', name: 'Parent' }, ...profiles];
    return (
      <FirebaseQuery on toArray path="profiles" onChange={this.handleTotal}>
        {(_, loading) => {
          if (loading) return <Loading />;

          return (
            <ProfileList>
              {options.map(p => (
                <Profile key={p.id} onClick={() => selectProfile(p)}>
                  <span style={{ textAlign: 'center' }}>{p.name}</span>
                  <span>{printAmount(p.total)}</span>
                </Profile>
              ))}
            </ProfileList>
          );
        }}
      </FirebaseQuery>
    );
  }
}

export default ProfileSelect;

const ProfileList = styled.div`
  padding: 0.5rem;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  grid-auto-rows: 100px;
  grid-gap: 0.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 200px;
    grid-auto-rows: 100px;
    grid-gap: 0.5rem;
    justify-content: center;
  }
`;

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.gray};
  color: white;
  font-weight: bold;
  cursor: pointer;
  border-radius: 10px;
  padding: 0.25rem;

  &:hover {
    transition: all 0.3s ease;
    box-shadow: 2px 2px 4px 5px #cdcdcd;
  }
`;
