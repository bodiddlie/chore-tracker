import React from 'react';
import PropTypes from 'prop-types';

import { objectToArray } from '../util';

class FirebaseQuery extends React.Component {
  static contextTypes = {
    app: PropTypes.object,
    rootPath: PropTypes.string,
  };

  state = {
    value: null,
  };

  getReference() {
    const { app, rootPath } = this.context;
    const { path, reference } = this.props;
    if (reference) {
      return reference;
    } else {
      return app.database().ref(`${rootPath}/${path}`);
    }
  }

  buildQuery() {
    const { on, toArray, onChange } = this.props;

    this.ref = this.getReference();

    if (on) {
      this.ref.on('value', snapshot => {
        const val = snapshot.val();
        const value = toArray ? objectToArray(val) : val;
        this.setState({ value });
        if (onChange) {
          onChange(value);
        }
      });
    }
  }

  componentDidMount() {
    this.buildQuery();
  }

  componentWillUnmount() {
    this.ref.off();
  }

  render() {
    const { render, children, toArray } = this.props;

    const value = toArray ? this.state.value || [] : this.state.value;

    return render ? render(value, this.ref) : children(value, this.ref);
  }
}

export default FirebaseQuery;
