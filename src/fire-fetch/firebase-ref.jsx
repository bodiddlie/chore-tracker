import React from 'react';
import PropTypes from 'prop-types';

class FirebaseRef extends React.Component {
  static contextTypes = {
    fbapp: PropTypes.object,
    rootPath: PropTypes.string,
  };

  getReferences() {
    const { path, paths } = this.props;
    const { fbapp, rootPath } = this.context;

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

export default FirebaseRef;
