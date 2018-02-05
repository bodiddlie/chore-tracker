import React from 'react';
import styled from 'styled-components';
import format from 'date-fns/format';

import { db } from './firebase';
import { objectToArray } from './util';
import { withUser } from './user';
import Header from './header';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

class ChildScreen extends React.Component {
  state = {
    chores: [],
    completedChores: [],
  };

  componentDidMount() {
    const { user, profile } = this.props;
    this.choreRef = db.ref(`/families/${user.uid}/chores`);
    this.completeRef = db.ref(
      `/families/${user.uid}/profiles/${profile.id}/completedChores`
    );

    this.choreRef.on('value', snapshot => {
      const chores = objectToArray(snapshot.val());
      this.setState({ chores });
    });

    this.completeRef.on('value', snapshot => {
      const completedChores = objectToArray(snapshot.val());
      this.setState({ completedChores });
    });
  }

  handleComplete = chore => {
    const { user, profile } = this.props;

    const { key } = this.completeRef.push();
    const newChore = {
      id: key,
      choreId: chore.id,
      value: chore.value,
      completedDate: new Date(),
    };
    const update = {
      [`/families/${user.uid}/profiles/${
        profile.id
      }/completedChores/${key}`]: newChore,
    };

    db.ref().update(update);
  };

  render() {
    const { chores, completedChores } = this.state;

    const total = this.state.completedChores.reduce(
      (sum, cur) => sum + cur.value,
      0
    );

    return (
      <Grid>
        <Header total={total} />
        <ChoreList>
          {chores.map(c => (
            <Chore key={c.id}>
              <Details>
                {c.name} - {formatter.format(c.value)}
              </Details>
              <Completed>
                {completedChores
                  .filter(cc => c.id === cc.choreId)
                  .map(ch => (
                    <Mark key={ch.id}>{format(ch.completedDate, 'MM/DD')}</Mark>
                  ))}
              </Completed>
              <CompleteButton onClick={() => this.handleComplete(c)}>
                +
              </CompleteButton>
            </Chore>
          ))}
        </ChoreList>
      </Grid>
    );
  }
}

export default withUser(ChildScreen);

const Grid = styled.div`
  display: grid;
`;

const ChoreList = styled.div`
  display: grid;
`;

const Chore = styled.div`
  display: grid;
  grid-template-columns: 1fr 50px;
  grid-template-rows: auto;
  /* prettier-ignore */
  grid-template-areas:
    "details button"
    "completed button";
  grid-gap: 0.5rem;
  border-bottom: 1px solid black;
`;

const Details = styled.div`
  grid-area: details;
`;

const CompleteButton = styled.button.attrs({
  type: 'button',
})`
  grid-area: button;
`;

const Completed = styled.div`
  grid-area: completed;
  display: flex;
`;

const Mark = styled.span`
  background: blue;
  color: white;
  padding: 0.5rem;
  margin-right: 0.25rem;
`;
