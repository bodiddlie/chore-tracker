import React from 'react';
import styled from 'styled-components';

import Header from '../header';
import Chores from './chores';
import AddChore from './add-chore';
import Profiles from './profiles';
import { Width } from '../shared';

class Admin extends React.Component {
  state = {
    tab: 'profiles',
  };

  render() {
    const { profiles } = this.props;
    const { tab } = this.state;

    return (
      <Width>
        {width => (
          <Grid>
            <Header total={4000.32} />
            {width < 700 ? (
              <React.Fragment>
                <SubHead>
                  <button
                    type="button"
                    onClick={() => this.setState({ tab: 'profiles' })}
                  >
                    Profiles
                  </button>
                  <button
                    type="button"
                    onClick={() => this.setState({ tab: 'chores' })}
                  >
                    Chores
                  </button>
                </SubHead>
                {tab === 'profiles' && <Profiles profiles={profiles} />}
                {tab === 'chores' && (
                  <React.Fragment>
                    <AddChore />
                    <Chores />
                  </React.Fragment>
                )}
              </React.Fragment>
            ) : (
              <Desktop>
                <ChoreContainer>
                  <AddChore />
                  <Chores />
                </ChoreContainer>
                <Profiles profiles={profiles} />
              </Desktop>
            )}
          </Grid>
        )}
      </Width>
    );
  }
}

export default Admin;

const Grid = styled.div`
  display: grid;
`;

const SubHead = styled.div`
  background: darkgreen;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Desktop = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  width: 100%;
  align-items: start;
`;

const ChoreContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-gap: 1.5rem;
  padding: 1rem;
  border-right: 1px solid rgba(0, 0, 0, 0.2);
`;
