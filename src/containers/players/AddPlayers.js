import React, { Component } from 'react'
import { connect } from 'react-redux';
import { createNewGame } from '../../actions/gameActions';
import { fetchAllPlayers } from '../../actions/playersActions';
import Spinner from '../../components/layout/Spinner';

class AddPlayers extends Component {
  state = {
    newPlayers: [{index: 1, name: '', roundPoints: '', totalPoints: 0}]
  }

  componentDidMount() {
    this.props.fetchAllPlayers();
  }

  componentWillReceiveProps(nextProps) {
    // New game created - navigate to the game page
    if (nextProps.gameLoading === false && nextProps.game) {
      this.props.history.push(`/game/${nextProps.game.id}`);
    }
  }

  onChange = (player, e) => {
    player.name = e.target.value;
    this.setState({ newPlayers: this.state.newPlayers });
  }

  addPlayer = () => this.setState({
      newPlayers: [...this.state.newPlayers, {
          index: this.state.newPlayers.length + 1,
          name: '',
          roundPoints: '',
          totalPoints: 0
        }]
    });

  createNewGame = e => {
    e.preventDefault();

    const { user, createNewGame } = this.props;

    const newGame = {
      adminId: user.email,
      endDate: null,
      players: [...this.state.newPlayers],
      winner: null 
    };

    createNewGame(newGame);
  };

  render() {
    const { newPlayers } = this.state;
    const { playersLoading, gameLoading } = this.props;

    const playerNames = (newPlayers) => {
      return newPlayers.map(player => {
        return (
          <div key={player.index} className="row">
            <div className="input-field col s12">
              <input
                id="name"
                type="text"
                autoComplete="off"
                value={player.name}
                onChange={this.onChange.bind(this, player)}/>
              <label htmlFor="name">Player {player.index}</label>
              {newPlayers.length === player.index
                ? (<button className="btn-floating right teal" onClick={this.addPlayer}>
                    <i className="material-icons">add</i>
                  </button>)
                : null}
            </div>
          </div>
        );
      });
    }

    if (playersLoading === true || gameLoading === true) {
      return (
        <Spinner />
      )
    } else {
      return (
        <div>
          <h4 className="red-text text-lighten-2">Add Players</h4>
            <div className="row">
              <form className="col s12" onSubmit={this.createNewGame}>
                {playerNames(newPlayers)} 

                <div className="center">
                  <input type="submit" value="START" className="btn-large red"/>
                </div>
              </form>
          </div>
        </div>
      )
    }
  }
}

const mapStatetoProps = state => ({
  players: state.players,
  playersLoading: state.loading.allPlayers,
  gameLoading: state.loading.game,
  game: state.game,
  user: state.user,
});

export default connect(mapStatetoProps, { createNewGame, fetchAllPlayers })(AddPlayers);
