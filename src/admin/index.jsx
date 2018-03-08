import React from 'react';
import styled from 'styled-components';

import Chores from './chores';
import AddChore from './add-chore';
import Profiles from './profiles';
import { withUser } from '../user';
import { db } from '../firebase';
import { objectToArray } from '../util';

class Admin extends React.Component {
  state = {
    total: 0,
  };

  componentDidMount() {
    const { user } = this.props;
    this.ref = db
      .ref(`/families/${user.uid}/completedChores`)
      .orderByChild('paid')
      .equalTo(false);
    this.ref.on('value', snapshot => {
      const completed = objectToArray(snapshot.val());
      const total = completed.reduce((prev, cur) => {
        return prev + cur.value;
      }, 0);
      this.setState({ total });
    });
  }

  componentWillUnmount() {
    this.ref.off();
  }

  render() {
    const { profiles } = this.props;

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
}

export default withUser(Admin);

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
