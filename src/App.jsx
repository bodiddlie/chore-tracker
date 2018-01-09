import React from 'react';
import styled from 'styled-components';
import format from 'date-fns/format';
import faker from 'faker';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const data = {
  chores: [
    { id: 1, name: 'Clean Room', value: 1.0 },
    { id: 2, name: 'Feed Dog', value: 0.25 },
    { id: 3, name: 'Put Away Dishes', value: 0.25 },
    { id: 4, name: 'Pick up living room', value: 0.5 },
    { id: 5, name: 'Clean bathrom', value: 1.0 },
  ],
};

class App extends React.Component {
  state = {
    name: 'Josh',
    completedChores: [
      { id: 1, choreId: 1, value: 1.0, completedDate: faker.date.past() },
      { id: 2, choreId: 1, value: 1.0, completedDate: faker.date.past() },
      { id: 3, choreId: 2, value: 0.25, completedDate: faker.date.past() },
      { id: 4, choreId: 4, value: 0.5, completedDate: faker.date.past() },
    ],
    nextId: 5,
  };

  onComplete = chore => {
    this.setState(prevState => {
      const newChore = {
        id: prevState.nextId,
        choreId: chore.id,
        value: chore.value,
        completedDate: new Date(),
      };
      const completedChores = [...prevState.completedChores, newChore];
      const nextId = prevState.nextId + 1;
      return { completedChores, nextId };
    });
  };

  render() {
    const total = this.state.completedChores.reduce(
      (sum, cur) => sum + cur.value,
      0
    );

    return (
      <Wrapper>
        <Header>
          <span>{this.state.name}</span>
          <span>{formatter.format(total)}</span>
        </Header>
        <ChoreList>
          {data.chores.map(c => (
            <Chore key={c.id}>
              <Row>
                <Col>{c.name}</Col>
                <Col>{formatter.format(c.value)}</Col>
              </Row>
              <Row>
                <Completed>
                  {this.state.completedChores
                    .filter(cc => c.id === cc.choreId)
                    .map(ch => (
                      <Mark>{format(ch.completedDate, 'MM/DD')}</Mark>
                    ))}
                </Completed>
                <Col>
                  <button type="button" onClick={() => this.onComplete(c)}>
                    +
                  </button>
                </Col>
              </Row>
            </Chore>
          ))}
        </ChoreList>
      </Wrapper>
    );
  }
}

export default App;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

const Header = styled.div`
  background: green;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 1rem;
`;

const ChoreList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Chore = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid black;
  margin-bottom: 0.75rem;

  &:last-child {
    border-bottom: none;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
`;

const Col = styled.div``;

const Completed = styled.div`
  display: flex;
`;

const Mark = styled.span`
  background: blue;
  color: white;
  padding: 0.5rem;
  margin-right: 0.25rem;
`;
