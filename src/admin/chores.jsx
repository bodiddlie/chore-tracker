import React from 'react';
import styled from 'styled-components';

import { FirebaseQuery } from '../fire-fetch';
import Chore from './chore';

function Chores() {
  return (
    <FirebaseQuery path="chores" on toArray>
      {chores => (
        <div>
          <Grid>
            <Heading>Name</Heading>
            <Heading>Value</Heading>
            <Heading>Last Completed</Heading>
            <Heading>Actions</Heading>
          </Grid>
          {chores.map(c => <Chore key={c.id} chore={c} />)}
        </div>
      )}
    </FirebaseQuery>
  );
}

export default Chores;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr) 80px;
  grid-column-gap: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
  margin-bottom: 0.25rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Heading = styled.div`
  font-weight: bold;
  font-size: 0.8rem;
`;
