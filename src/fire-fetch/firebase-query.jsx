import React from 'react';

import { objectToArray } from '../util';
import { withRootRef } from './root-ref';
import { withFbApp } from './provider';

class FirebaseQuery extends React.Component {
  state = {
    value: null,
    loading: true,
  };

  getReference() {
    const { path, reference, fbapp, rootPath } = this.props;
    if (reference) {
      return reference;
    } else {
      return fbapp.database().ref(`${rootPath}/${path}`);
    }
  }

  buildQuery() {
    const {
      on,
      toArray,
      onChange,
      once,
      orderByChild,
      equalTo,
      limitToLast,
    } = this.props;

    this.ref = this.getReference();

    if (orderByChild) {
      this.ref = this.ref.orderByChild(orderByChild);
    }

    if (equalTo || equalTo === false) {
      this.ref = this.ref.equalTo(equalTo);
    }

    if (limitToLast) {
      this.ref = this.ref.limitToLast(limitToLast);
    }

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

export default withRootRef(withFbApp(FirebaseQuery));
