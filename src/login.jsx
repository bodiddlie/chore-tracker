import React from 'react';
import styled from 'styled-components';
import FaGoogle from 'react-icons/lib/fa/google';
import FaFacebookSquare from 'react-icons/lib/fa/facebook-square';
import FaTwitter from 'react-icons/lib/fa/twitter';
import FaGithub from 'react-icons/lib/fa/github';

import {
  auth,
  googleProvider,
  facebookProvider,
  twitterProvider,
  githubProvider,
} from './firebase';
import { TextBox } from './shared';

class Login extends React.Component {
  state = {
    onLoginForm: true,
    email: '',
    password: '',
    confirm: '',
    displayName: '',
    showErrors: false,
  };

  handleSubmit = event => {
    event.preventDefault();

    const { email, password, displayName } = this.state;
    this.setState({ showErrors: true });

    if (!this.validateForm()) return;

    if (this.state.onLoginForm) {
      auth.signInWithEmailAndPassword(email, password);
    } else {
      auth.createUserWithEmailAndPassword(email, password).then(user => {
        user.updateProfile({
          displayName,
        });
      });
    }
  };

  validateForm = () => {
    if (this.state.onLoginForm) {
      return this.state.email.length > 0 && this.state.password.length >= 0;
    } else {
      return (
        this.state.email.length > 0 &&
        this.state.displayName.length > 0 &&
        this.state.password.length >= 6 &&
        this.state.password === this.state.confirm
      );
    }
  };

  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  handleGoogle = () => {
    if (window.innerWidth > 768) {
      auth.signInWithPopup(googleProvider);
    } else {
      auth.signInWithRedirect(googleProvider).catch(alert);
    }
  };

  handleFacebook = () => {
    if (window.innerWidth > 768) {
      auth.signInWithPopup(facebookProvider);
    } else {
      auth.signInWithRedirect(facebookProvider);
    }
  };

  handleTwitter = () => {
    if (window.innerWidth > 768) {
      auth.signInWithPopup(twitterProvider);
    } else {
      auth.signInWithRedirect(twitterProvider);
    }
  };

  handleGithub = () => {
    if (window.innerWidth > 768) {
      auth.signInWithPopup(githubProvider);
    } else {
      auth.signInWithRedirect(githubProvider);
    }
  };

  toggleForm = () => {
    this.setState(prevState => {
      return { onLoginForm: !prevState.onLoginForm };
    });
  };

  render() {
    const { onLoginForm, email, password, confirm, displayName } = this.state;

    return (
      <Wrapper>
        <h1 style={{ marginBottom: '0.25rem' }}>Chore Tracker</h1>
        <p style={{ margin: '0.25rem' }}>
          A chore/allowance tracking app for families. Using it is simple:
        </p>
        <ol style={{ margin: '0.25rem' }}>
          <ListItem>Register/Sign in below</ListItem>
          <ListItem>Create child profiles for your kids to use</ListItem>
          <ListItem>Add chores and their values</ListItem>
          <ListItem>
            Have kids sign in and mark when they complete chores
          </ListItem>
          <ListItem>
            When it's time to pay allowance, see at a glance how much each child
            has earned, then pay them and start over
          </ListItem>
        </ol>
        <Form onSubmit={this.handleSubmit}>
          <TextBox
            label="Email"
            value={email}
            name="email"
            onChange={this.handleChange}
          />
          {onLoginForm ? (
            <React.Fragment>
              <TextBox
                label="Password"
                value={password}
                name="password"
                type="password"
                onChange={this.handleChange}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <TextBox
                label="Display Name"
                value={displayName}
                name="displayName"
                onChange={this.handleChange}
              />
              <TextBox
                label="Password"
                value={password}
                name="password"
                onChange={this.handleChange}
                type="password"
              />
              <TextBox
                label="Confirm Password"
                value={confirm}
                name="confirm"
                type="password"
                onChange={this.handleChange}
              />
            </React.Fragment>
          )}
          <SubmitRow>
            <SubmitButton>{onLoginForm ? 'Log In' : 'Register'}</SubmitButton>
            <ToggleButton
              onClick={() => this.setState({ onLoginForm: !onLoginForm })}
            >
              {onLoginForm ? 'Sign Up' : 'Log In'}
            </ToggleButton>
          </SubmitRow>
          <ButtonRow>
            <ProviderButton bg="#DD4B39" onClick={() => this.handleGoogle()}>
              <FaGoogle /> Log In with Google
            </ProviderButton>
            <ProviderButton bg="#4267B2" onClick={() => this.handleFacebook()}>
              <FaFacebookSquare /> Log In with Facebook
            </ProviderButton>
            <ProviderButton bg="#55ACEE" onClick={() => this.handleTwitter()}>
              <FaTwitter /> Log In with Twitter
            </ProviderButton>
            <ProviderButton bg="#444444" onClick={() => this.handleGithub()}>
              <FaGithub /> Log In with GitHub
            </ProviderButton>
          </ButtonRow>
        </Form>
      </Wrapper>
    );
  }
}

export default Login;

const Wrapper = styled.div`
  display: grid;
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  justify-items: center;
  padding: 0.25rem;
`;

const ListItem = styled.li`
  margin-bottom: 0.25rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #efefef;
  border-radius: 5px;
  width: 100%;
`;

const SubmitRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const SubmitButton = styled.button.attrs({
  type: 'submit',
})`
  padding: 5px;
  background: green;
  border: none;
  outline: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
`;

const ToggleButton = styled.button.attrs({
  type: 'button',
})`
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ButtonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1.75rem 1.75rem;
  grid-gap: 0.5rem;
  border-top: 1px solid #676767;
  padding-top: 0.25rem;
`;

const ProviderButton = styled.button.attrs({
  type: 'button',
})`
  outline: none;
  box-shadow: none;
  background: ${props => props.bg || 'white'};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;
