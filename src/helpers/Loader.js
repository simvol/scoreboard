import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spinner from '../components/layout/Spinner';

// React router trying to update everything on this change?
import { withRouter } from 'react-router-dom';
import { fetchUser } from '../actions/userActions';

class Loader extends Component {
  componentWillMount() {
    const { userLoading, gameLoading } = this.props;

    // User was never fetched
    if (userLoading === undefined) {
      this.props.fetchUser();
    }

  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const { userLoading, children, user } = this.props;

    if (!userLoading || user === null) {
      return(
        <div>
          {children}
        </div>
      )
    } else {
      return(
        <Spinner />
      )
    }
  }
}

const mapStateToProps = state => ({
  userLoading: state.loading.user,
  gameLoading: state.loading.game
});

export default withRouter(connect(mapStateToProps, { fetchUser })(Loader));