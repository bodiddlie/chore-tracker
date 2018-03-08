import React from 'react';
import PropTypes from 'prop-types';

import { objectToArray } from '../util';

class FirebaseQuery extends React.Component {
  static contextTypes = {
    fbapp: PropTypes.object,
    rootPath: PropTypes.string,
  };

  state = {
    value: null,
    loading: true,
  };

  getReference() {
    const { fbapp, rootPath } = this.context;
    const { path, reference } = this.props;
    if (reference) {
      return reference;
    } else {
      return fbapp.database().ref(`${rootPath}/${path}`);
    }
  }

  buildQuery() {
    const { on, toArray, onChange, once } = this.props;

    this.ref = this.getReference();

    if (on) {
      this.ref.on('value', snapshot => {
        const val = snapshot.val();
        const value = toArray ? objectToArray(val) : val;
        this.setState({ value, loading: false });
        if (onChange) {
          onChange(value);
        }
      });
    }

    if (once) {
      this.ref.once('value', snapshot => {
        const val = snapshot.val();
        const value = toArray ? objectToArray(val) : val;
        this.setState({ value, loading: false });
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
    const { loading } = this.state;

    const value = toArray ? this.state.value || [] : this.state.value;

    return render
      ? render(value, loading, this.ref)
      : children(value, loading, this.ref);
  }
}

export default FirebaseQuery;
