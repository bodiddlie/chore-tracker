import React from 'react';

import { withRootRef } from './root-ref';
import { withFbApp } from './provider';

class FirebaseRef extends React.Component {
  getReferences() {
    const { path, paths, fbapp, rootPath } = this.props;

    if (path) {
      return [fbapp.database().ref(`${rootPath}/${path}`)];
    }

    return paths.map(path => fbapp.database().ref(`${rootPath}/${path}`));
  }

  render() {
    const { render, children } = this.props;

    const refs = this.getReferences();

    return render ? render(...refs) : children(...refs);
  }
}

export default withRootRef(withFbApp(FirebaseRef));
