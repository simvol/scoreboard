import { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as React from 'react';

class Authenticated extends Component {

  //TODO why not called?
  componentDidUpdate() {
    const { user, userLoading, history } = this.props;

    if (userLoading === false && !user) {
      history.push('/login');
    }
  }

  componentWillMount(){
    const { user, userLoading, history } = this.props;

    if (userLoading === false && !user) {
      history.push('/login');
    }
  }

  render() {
    const { user, userLoading, children } = this.props;

    if (userLoading === false && user !== null) {
      return <div>{children}</div>
    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  user: state.user,
  userLoading: state.loading.user
});

export default withRouter(connect(mapStateToProps)(Authenticated));