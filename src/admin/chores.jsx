import React from 'react';
import styled from 'styled-components';

import { db } from '../firebase';
import { objectToArray } from '../util';
import { withUser } from '../user';
import Chore from './chore';

class Chores extends React.Component {
  state = {
    chores: [],
  };

  componentDidMount() {
    const { user } = this.props;
    this.ref = db.ref(`/families/${user.uid}/chores`);
    this.ref.on('value', snapshot => {
      const chores = objectToArray(snapshot.val());
      this.setState({ chores });
    });
  }

  componentWillUnmount() {
    this.ref.off();
  }

  render() {
    const { chores } = this.state;

    return (
      <div>
        <Grid>
          <Heading>Name</Heading>
          <Heading>Value</Heading>
          <Heading>Last Completed</Heading>
          <Heading>Actions</Heading>
        </Grid>
        {chores.map(c => <Chore key={c.id} chore={c} />)}
      </div>
    );
  }
}

export default withUser(Chores);

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
