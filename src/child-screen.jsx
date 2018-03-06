import React from 'react';
import styled from 'styled-components';
import format from 'date-fns/format';
import TiCancel from 'react-icons/lib/ti/cancel';
import GoCheck from 'react-icons/lib/go/check';

import { FirebaseRef, FirebaseQuery } from './fire-fetch';
import { withUser } from './user';
import Header from './header';
import { Button } from './styles';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

class ChildScreen extends React.Component {
  state = {
    total: 0,
  };

  onCompleteChange = completed => {
    const total = completed.reduce((prev, cur) => {
      return prev + cur.value;
    }, 0);
    this.setState({ total });
  };

  handleComplete = (completeRef, chore) => {
    const { user, profile } = this.props;

    const { key } = completeRef.push();
    const newChore = {
      id: key,
      choreId: chore.id,
      value: chore.value,
      completedDate: new Date(),
      completedBy: profile.id,
      paid: false,
    };
    const update = {
      [`/families/${user.uid}/profiles/${
        profile.id
      }/completedChores/${key}`]: newChore,
      [`/families/${user.uid}/completedChores/${key}`]: newChore,
    };

    completeRef.root.update(update);
  };

  handleDelete = (chore, completeRef, adminCompleteRef) => {
    completeRef.child(chore.id).remove();
    adminCompleteRef.child(chore.id).remove();
  };

  render() {
    const { profile } = this.props;
    const { total } = this.state;

    return (
      <FirebaseQuery path="/chores" on toArray>
        {chores => (
          <FirebaseQuery
            path={`/profiles/${profile.id}/completedChores`}
            on
            toArray
            onChange={this.onCompleteChange}
          >
            {(completedChores, completeRef) => (
              <FirebaseRef path="completedChores">
                {adminCompleteRef => (
                  <Grid>
                    <Header />
                    <Earnings>
                      You have earned {formatter.format(total)} so far!
                    </Earnings>
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
                                <Mark key={ch.id}>
                                  <span>
                                    {format(
                                      ch.completedDate || new Date(),
                                      'MM/DD'
                                    )}{' '}
                                  </span>
                                  <MarkButton
                                    onClick={() =>
                                      this.handleDelete(
                                        ch,
                                        completeRef,
                                        adminCompleteRef
                                      )
                                    }
                                  >
                                    <TiCancel />
                                  </MarkButton>
                                </Mark>
                              ))}
                          </Completed>
                          <CompleteButton
                            onClick={() => this.handleComplete(completeRef, c)}
                            color="green"
                          >
                            <GoCheck />
                          </CompleteButton>
                        </Chore>
                      ))}
                    </ChoreList>
                  </Grid>
                )}
              </FirebaseRef>
            )}
          </FirebaseQuery>
        )}
      </FirebaseQuery>
    );
  }
}

export default withUser(ChildScreen);

const Grid = styled.div`
  display: grid;
`;

const Earnings = styled.div`
  font-size: 1.1rem;
  padding: 0.5rem;
`;
const ChoreList = styled.div`
  display: grid;
  padding: 0.5rem;
  grid-gap: 0.25rem;
`;

const Chore = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  grid-template-areas:
    'details button'
    'completed completed';
  grid-gap: 0.5rem;
  padding: 0.5rem;
  border: 2px solid ${props => props.theme.gray};
  border-radius: 5px;
  font-size: 0.9rem;
`;

const Details = styled.div`
  grid-area: details;
`;

const CompleteButton = Button.extend`
  grid-area: button;
  font-size: 0.7rem;
`;

const Completed = styled.div`
  grid-area: completed;
  display: flex;
  flex-wrap: wrap;
`;

const Mark = styled.div`
  display: flex;
  align-items: center;
  color: white;
  padding: 0.1rem;
  margin-right: 0.25rem;
  font-size: 0.8rem;
  background: ${props => props.theme.gray};
  border-radius: 5px;
  margin-bottom: 0.1rem;
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
  font-size: 0.8rem;
  cursor: pointer;
  color: white;
  padding: 0;

  &:hover {
    color: red;
  }
`;
