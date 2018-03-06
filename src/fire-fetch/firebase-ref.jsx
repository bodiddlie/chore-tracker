import React from 'react';
import PropTypes from 'prop-types';

class FirebaseRef extends React.Component {
  static contextTypes = {
    app: PropTypes.object,
    rootPath: PropTypes.string,
  };

  getReferences() {
    const { path, paths } = this.props;
    const { app, rootPath } = this.context;

    if (path) {
      return [app.database().ref(`${rootPath}/${path}`)];
    }

    return paths.map(path => app.database().ref(`${rootPath}/${path}`));
  }

  render() {
    const { render, children } = this.props;

    const refs = this.getReferences();

    return render ? render(...refs) : children(...refs);
  }
}

export default FirebaseRef;
