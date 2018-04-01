import React from 'react';
import styled from 'styled-components';

import Chores from './chores';
import AddChore from './add-chore';
import Profiles from './profiles';

function Admin({ profiles }) {
  return (
    <Grid>
      <Desktop>
        <ChoreContainer>
          <Heading>Chores</Heading>
          <AddChore />
          <Chores />
        </ChoreContainer>
        <Profiles profiles={profiles} />
      </Desktop>
    </Grid>
  );
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

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-gap: 0.5rem;
  }
`;

const Heading = styled.h4`
  margin: 0;
  padding: 0;
`;

const ChoreContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-gap: 1.5rem;
  padding: 1rem;
`;
