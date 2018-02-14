import React from 'react';
import styled from 'styled-components';

import Header from '../header';
import Chores from './chores';
import AddChore from './add-chore';
import Profiles from './profiles';
import { withUser } from '../user';
import { db } from '../firebase';
import { objectToArray } from '../util';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

class Admin extends React.Component {
  state = {
    total: 0,
  };

  componentDidMount() {
    const { user } = this.props;
    this.ref = db.ref(`/families/${user.uid}/completedChores`);
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

  handleCloseout = () => {
    const { user } = this.props;
    db
      .ref(`/families/${user.uid}/profiles`)
      .once('value')
      .then(snapshot => {
        snapshot.forEach(child => {
          let total = 0;

          child.child('completedChores').forEach(snap => {
            total += snap.val().value;
          });

          if (total > 0) {
            const { key } = child.ref.child('payouts').push();
            const payout = { id: key, total, date: new Date() };

            const update = {
              [`/families/${user.uid}/profiles/${
                child.key
              }/payouts/${key}`]: payout,
            };
            db.ref().update(update);

            child.child('completedChores').ref.remove();
          }
        });
        db.ref(`/families/${user.uid}/completedChores`).remove();
      });
  };

  render() {
    const { profiles } = this.props;
    const { total } = this.state;

    return (
      <Grid>
        <Header>
          {formatter.format(total)}{' '}
          <button type="button" onClick={this.handleCloseout}>
            Close
          </button>
        </Header>
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

export default withUser(Admin);

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
