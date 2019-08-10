import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from '../../actions/userActions';

class Login extends Component {
  state = {
    email: '',
    password: ''
  };

  componentWillMount() {
    if (this.props.user) {
      this.props.history.push('/');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.props.history.push('/');
    }
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();

    const { login, notifyUser } = this.props;
    let { email, password } = this.state;

    // Login with default user for those who doesnt' have account
    email = this.state.email || 'default@user.com';
    password = this.state.password || '1234567';

    login(email, password);
  };

  render() {
    // const { message, messageType } = this.props.notify;

    return (
      <div>
        <div className="row">
          <div className="col s12 center">
            <h4 className="red-text text-lighten-2">Login</h4>
          </div>
        </div>
        <div className="row">
          <form className="col s12" onSubmit={this.onSubmit}>
            <div className="input-field col s12">
              <input
                id="email"
                type="email"
                name="email"
                className="validate"
                onChange={this.onChange}
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="input-field col s12">
              <input
                id="password"
                type="password"
                name="password"
                className="validate"
                onChange={this.onChange}
              />
              <label htmlFor="password">Password</label>
            </div>
            <div className="col s12">
              <input type="submit" value="Login" className="btn" />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Login.propTypes = {};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  { login }
)(Login);
