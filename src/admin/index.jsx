import React from 'react';
import styled from 'styled-components';

import Header from '../header';
import Chores from './chores';
import AddChore from './add-chore';
import Profiles from './profiles';

class Admin extends React.Component {
  state = {
    tab: 'profiles',
  };

  render() {
    const { profiles } = this.props;

    return (
      <Grid>
        <Header total={4000.32} />
        <Desktop>
          <ChoreContainer>
            <AddChore />
            <Chores />
          </ChoreContainer>
          <Profiles profiles={profiles} />
        </Desktop>
      </Grid>
    );
  }
}

export default Admin;

const Grid = styled.div`
  display: grid;
`;

const Desktop = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  width: 100%;
  align-items: start;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    grid-gap: 0.5rem;
  }
`;

const ChoreContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-gap: 1.5rem;
  padding: 1rem;
  border-right: 1px solid rgba(0, 0, 0, 0.2);
`;
