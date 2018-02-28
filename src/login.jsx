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
import { TextBox, Width } from './shared';

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

  handleGoogle = width => {
    if (width > 768) {
      auth.signInWithPopup(googleProvider);
    } else {
      auth.signInWithRedirect(googleProvider).catch(alert);
    }
  };

  handleFacebook = width => {
    if (width > 768) {
      auth.signInWithPopup(facebookProvider);
    } else {
      auth.signInWithRedirect(facebookProvider);
    }
  };

  handleTwitter = width => {
    if (width > 768) {
      auth.signInWithPopup(twitterProvider);
    } else {
      auth.signInWithRedirect(twitterProvider);
    }
  };

  handleGithub = width => {
    if (width > 768) {
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
      <Width>
        {width => (
          <Wrapper>
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
                <SubmitButton>
                  {onLoginForm ? 'Log In' : 'Register'}
                </SubmitButton>
                <ToggleButton
                  onClick={() => this.setState({ onLoginForm: !onLoginForm })}
                >
                  {onLoginForm ? 'Sign Up' : 'Log In'}
                </ToggleButton>
              </SubmitRow>
              <ButtonRow>
                <ProviderButton
                  bg="#DD4B39"
                  onClick={() => this.handleGoogle(width)}
                >
                  <FaGoogle /> Log In with Google
                </ProviderButton>
                <ProviderButton
                  bg="#4267B2"
                  onClick={() => this.handleFacebook(width)}
                >
                  <FaFacebookSquare /> Log In with Facebook
                </ProviderButton>
                <ProviderButton
                  bg="#55ACEE"
                  onClick={() => this.handleTwitter(width)}
                >
                  <FaTwitter /> Log In with Twitter
                </ProviderButton>
                <ProviderButton
                  bg="#444444"
                  onClick={() => this.handleGithub(width)}
                >
                  <FaGithub /> Log In with GitHub
                </ProviderButton>
              </ButtonRow>
            </Form>
          </Wrapper>
        )}
      </Width>
    );
  }
}

export default Login;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #efefef;
  border-radius: 5px;
  max-width: 800px;
  min-width: 300px;
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
