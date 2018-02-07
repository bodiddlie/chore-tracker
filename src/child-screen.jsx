import React from 'react';
import styled from 'styled-components';
import format from 'date-fns/format';
import { TiCancel } from 'react-icons/lib/ti';

import { db } from './firebase';
import { objectToArray } from './util';
import { withUser } from './user';
import Header from './header';
import { Button } from './styles';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

class ChildScreen extends React.Component {
  state = {
    chores: [],
    completedChores: [],
    total: 0,
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
      const total = completedChores.reduce((prev, cur) => {
        return prev + cur.value;
      }, 0);
      this.setState({ completedChores, total });
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
      paid: false,
    };
    const update = {
      [`/families/${user.uid}/profiles/${
        profile.id
      }/completedChores/${key}`]: newChore,
    };

    db.ref().update(update);
  };

  handleDelete = chore => {
    this.completeRef.child(chore.id).remove();
  };

  render() {
    const { profile } = this.props;
    const { chores, completedChores, total } = this.state;

    return (
      <Grid>
        <Header>
          <HeaderText>
            {profile.name} - Earned {formatter.format(total)}
          </HeaderText>
        </Header>
        <ChoreList>
          {chores.map(c => (
            <Chore key={c.id}>
              <Details>
                {c.name} - {formatter.format(c.value)}
              </Details>
              <Completed>
                {completedChores.filter(cc => c.id === cc.choreId).map(ch => (
                  <Mark key={ch.id}>
                    {format(ch.completedDate || new Date(), 'MM/DD')}{' '}
                    <MarkButton onClick={() => this.handleDelete(ch)}>
                      <TiCancel />
                    </MarkButton>
                  </Mark>
                ))}
              </Completed>
              <CompleteButton
                onClick={() => this.handleComplete(c)}
                color="green"
              >
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

const HeaderText = styled.span`
  color: white;
`;

const ChoreList = styled.div`
  display: grid;
`;

const Chore = styled.div`
  display: grid;
  grid-template-columns: 1fr 50px;
  grid-template-rows: 1rem 1.5rem;
  grid-template-areas:
    'details button'
    'completed button';
  grid-gap: 0.5rem;
  border-bottom: 1px solid black;
  padding: 0.5rem;
`;

const Details = styled.div`
  grid-area: details;
`;

const CompleteButton = Button.extend`
  grid-area: button;
`;

const Completed = styled.div`
  grid-area: completed;
  display: flex;
`;

const Mark = styled.span`
  display: flex;
  align-items: center;
  color: white;
  padding: 0.3rem;
  margin-right: 0.25rem;
  font-size: 0.8rem;
  background: ${props => props.theme.gray};
  border-radius: 10px;
`;

const MarkButton = styled.button.attrs({
  type: 'button',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  border: none;
  background: transparent;
  font-size: 0.9rem;
  cursor: pointer;
  color: white;

  &:hover {
    color: red;
  }
`;
