import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { connect} from 'react-redux';
import { logout } from '../../actions/userActions';

class AppNavbar extends Component {

  render() {
    const { user, userLoading } = this.props;    

      if (userLoading === false) {
        setTimeout(function(){
          window.M.AutoInit();
        }, 500);
      }

    return (
      <div>
        { user ?
          (
            <div>
              <nav>
                <div className="nav-wrapper">

                  <ul className="hide-on-med-and-down">
                    <li><Link to="/">Game</Link></li>
                    <li><Link to="/rankings">Rankings</Link></li>
                  </ul>

                  <a href="#!" className="brand-logo hide-on-med-and-down">ScoreBoard</a>

                  <a href="#" data-target="mobile-demo" className="sidenav-trigger">
                    <i className="material-icons">menu</i>
                  </a>

                  <ul className="right">
                    <li><a href="#" className="">{user.email}</a></li>
                    <li><a href="#" className="" onClick={this.props.logout}>Logout</a></li>
                  </ul>
                </div>
              </nav>
              
              <ul className="sidenav" id="mobile-demo">
                  <li><Link to="/">Game</Link></li>
                  <li><Link to="/rankings">Rankings</Link></li>
              </ul>
            </div>

          ) : (

            <nav>
              <div className="nav-wrapper">
                <a href="#!" className="brand-logo hide-on-med-and-down">ScoreBoard</a>
                <ul className="right">
                  <li><Link to="/login">Login</Link></li>
                </ul>
              </div>
            </nav>
          )
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  userLoading: state.loading.user
});

export default connect(mapStateToProps, { logout })(AppNavbar);