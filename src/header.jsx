import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { auth } from './firebase';

const Header = ({ children }, { selectedProfile, clearProfile }) => {
  return (
    <Wrapper>
      <div>{children}</div>
      <div>
        {!!selectedProfile && (
          <button onClick={clearProfile}>{selectedProfile.name}</button>
        )}
        <button onClick={() => auth.signOut()}>Sign Out</button>
      </div>
    </Wrapper>
  );
};

Header.contextTypes = {
  selectedProfile: PropTypes.object,
  clearProfile: PropTypes.func,
};

export default Header;

export const Wrapper = styled.div`
  background: ${props => props.theme.gray};
  display: flex;
  justify-content: space-between;
  padding: 1rem;
`;
