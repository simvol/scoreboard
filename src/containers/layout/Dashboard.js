import React, { Component } from 'react'
import { connect} from 'react-redux';
import Spinner from '../../components/layout/Spinner';
import { fetchCurrentGame } from '../../actions/gameActions';

class Dashboard extends Component {
  newGame = () => this.props.history.push('/players/add');

  componentDidMount() {
    const { gameLoading, fetchCurrentGame } = this.props;

    if (gameLoading === undefined) {
      fetchCurrentGame();
    }
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.gameLoading === false && nextProps.game) {
      this.props.history.push(`/game/${nextProps.game.id}`);
    }
  }

  render() {
    const { gameLoading, game } = this.props;

    if (gameLoading === false && !game) {
      return (
        <div className="row">
          <div className="col s12">
            <div className="valign-wrapper height-100vh">
              <button className="btn center-block" onClick={this.newGame}>New Game</button>
            </div>
          </div>
          
        </div>
      )
    } else {
      return <Spinner />
    }
  }
}

const mapStateToProps = state => ({
  game: state.game,
  gameLoading: state.loading.game
});

export default connect(mapStateToProps, { fetchCurrentGame })(Dashboard);