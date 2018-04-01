import React from 'react';
import styled from 'styled-components';
import TiPlus from 'react-icons/lib/ti/plus';
import { FirebaseQuery, FirebaseRef, withRootRef } from 'fire-fetch';

import { TextBox } from '../shared';
import { Button, SmallButton } from '../styles';
import Profile from './profile';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

class ProfileList extends React.Component {
  state = {
    name: '',
  };

  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  validate = () => {
    return !!this.state.name.length;
  };

  handlePayout = (profileRef, completedRef) => {
    if (
      !window.confirm(
        'Are you sure you are ready to pay out allowance? This will clear all completed chores.'
      )
    )
      return;

    const { rootPath } = this.props;
    profileRef.once('value').then(snapshot => {
      snapshot.forEach(child => {
        let total = 0;

        child.child('completedChores').forEach(snap => {
          total += snap.val().value;
        });

        if (total > 0) {
          const { key } = child.ref.child('payouts').push();
          const payout = { id: key, total, date: new Date() };

          const update = {
            [`${rootPath}/profiles/${child.key}/payouts/${key}`]: payout,
          };
          profileRef.root.update(update);

          child.child('completedChores').ref.remove();
        }
      });
      completedRef.once('value', snapshot => {
        snapshot.forEach(snap => {
          snap.ref.update({ paid: true });
        });
      });
    });
  };

  onSubmit = (event, profileRef) => {
    event.preventDefault();
    const { rootPath } = this.props;
    const { name } = this.state;
    if (this.validate()) {
      const { key } = profileRef.push();
      const profile = { name, id: key };
      const update = {
        [`${rootPath}/profiles/${key}`]: profile,
      };

      profileRef.root.update(update);

      this.setState({ name: '' });
    }
  };

  render() {
    const { profiles, user } = this.props;
    const { name } = this.state;

    return (
      <FirebaseQuery
        path="completedChores"
        orderByChild="paid"
        equalTo={false}
        on
        toArray
      >
        {completed => {
          const total = completed.reduce((prev, cur) => prev + cur.value, 0);
          return (
            <FirebaseRef paths={['profiles', 'completedChores']}>
              {(profileRef, completedRef) => (
                <Grid>
                  <Heading>Children</Heading>
                  {total > 0 && (
                    <SmallButton
                      color="gray"
                      onClick={() =>
                        this.handlePayout(profileRef, completedRef)
                      }
                    >
                      Payout Total - {formatter.format(total)}
                    </SmallButton>
                  )}
                  <AddEdit onSubmit={event => this.onSubmit(event, profileRef)}>
                    <TextBox
                      value={name}
                      label="New Child Name"
                      name="name"
                      onChange={this.handleChange}
                    />
                    <Button type="submit" color="green">
                      <TiPlus />
                    </Button>
                  </AddEdit>
                  <List>
                    {profiles.map(p => (
                      <Profile key={p.id} profile={p} user={user} />
                    ))}
                  </List>
                </Grid>
              )}
            </FirebaseRef>
          );
        }}
      </FirebaseQuery>
    );
  }
}

export default withRootRef(ProfileList);

const Grid = styled.div`
  display: grid;
  grid-gap: 1rem;
  padding: 1rem;
`;

const Heading = styled.h4`
  margin: 0;
  padding: 0;
`;

const List = styled.div`
  display: grid;
  grid-gap: 0.25rem;
`;

const AddEdit = styled.form`
  display: grid;
  grid-template-columns: 3fr 1fr;
  justify-items: center;
  align-items: center;
`;
