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
        db
          .ref(`/families/${user.uid}/completedChores`)
          .once('value', snapshot => {
            snapshot.forEach(snap => {
              snap.ref.update({ paid: true });
            });
          });
      });
  };

  render() {
    const { profiles } = this.props;
    const { total } = this.state;

    return (
      <Grid>
        <Header>
          <LeftSide>
            <div
              style={{ display: 'flex', alignItems: 'center', color: 'white' }}
            >
              {formatter.format(total)}
            </div>
            {total > 0 && <Button onClick={this.handleCloseout}>Payout</Button>}
          </LeftSide>
        </Header>
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

const LeftSide = styled.div`
  display: grid;
  grid-template-columns: 50px repeat(auto-fill, 70px);
`;

const Button = styled.button.attrs({
  type: 'button',
})`
  border: none;
  background: transparent;
  color: ${props => props.theme.lightgray};
  outline: none;
  box-shadow: none;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s linear;
  font-size: 1rem;
  padding: 0;

  &:hover {
    color: #efefef;
  }
`;
