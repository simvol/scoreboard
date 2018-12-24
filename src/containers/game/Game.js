import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spinner from '../../components/layout/Spinner';
import { fetchCurrentGame, updateGame } from '../../actions/gameActions';
import { updatePlayers } from '../../actions/playersActions';
import fireworks from '../../fireworks.gif';

class Game extends Component {
  state = {
    game: null,
    playback: [], //has previous states
    winner: null,
    results: []
  };

  mounted = false;

  static getDerivedStateFromProps(props, state) {
    const { game, gameLoading, history } = props;

    if (gameLoading === false && !game) {
      history.push('/');
    } 

    if (game && game.winner !== null && state.results.length === 0) {
      history.push('/');
    }

    if (game) {
      console.table('Derived: ', console.table(game.players));
      return { game: game, playback: [...state.playback] };
    }

    return null;
  };

  componentDidMount(){
    this.props.fetchCurrentGame(this.props.match.params.id);
  }

  componentDidUpdate(){
    if (this.state.game.players && this.state.game.players.length > 0 && this.mounted === false) {
      this.mounted = true;

      const isActiveSet = this.state.game.players.filter(p => p.isActive).length > 0;
      if (!isActiveSet) {
        this.nextPlayer();
      }
    }
  }

  setActivePlayer = (activePlayer) => {
    const { game } = this.state;
    const { updateGame } = this.props;

    const indexOfActive = activePlayer ? game.players.findIndex(p => p.name === activePlayer.name) : -1;

    // No active or ctive is last - set first, otherwise - set next
    const newIndexOfActive = !activePlayer || game.players.length - 1 === indexOfActive ? 0 : indexOfActive + 1;

    game.players[newIndexOfActive].isActive = true;

    // Firebase update
    updateGame(game);
  };

  onChange = (player, e) => {
    player.roundPoints = e.target.value;
    this.setState({game: {...this.state.game, players: [...this.state.game.players, player] }});
  };

  playback = () => {
    const { playback } = this.state;
    const newPlayback = playback.slice(0, playback.length - 1);
    const newGame = playback[playback.length - 1];

    if (newGame) {
      this.setState({ playback: [...newPlayback] });
      this.props.updateGame(JSON.parse(newGame));
    }
  };

  nextPlayer = () => {
    const activePlayer = this.state.game.players.filter(p => p.isActive)[0];

    if (activePlayer && !activePlayer.roundPoints) {
      // No roundPoints
    } else if (activePlayer) {
      
      // Save playback for "Undo" actions
      this.setState({ playback: [...this.state.playback, JSON.stringify(this.state.game)] });

      // New way
      const updatedPlayer = {
        ...activePlayer,
        totalPoints: parseInt(activePlayer.totalPoints) + parseInt(activePlayer.roundPoints),
        roundPoints: '',
        isActive: false
      };

      // Swap activePlayer with updatedPlayer
      const updatedPlayers = this.state.game.players.filter(player => player.name.toLowerCase() !== activePlayer.name.toLowerCase()).concat([updatedPlayer]);

      // Set active player to next player or first player
      const nextActivePlayer = updatedPlayers.filter(p => p.index === activePlayer.index + 1)[0] || updatedPlayers.filter(p => p.index === 1)[0];
      nextActivePlayer.isActive = true;

      // Create updated
      const updatedGame = {
        ...this.state.game,
        players: [...updatedPlayers]
      };

      // Firebase update
      this.props.updateGame(updatedGame);

    } else {
      this.setActivePlayer();
    }
  };

  //TODO change game to history[move]
  finish = () => {
    const { game } = this.state;
    const { 
      updateGame,
      updatePlayers,
      user
    } = this.props;

    const results = game.players.sort((p1,p2) => p2.totalPoints - p1.totalPoints);
    const winner = results[0];

    winner.isWinner = true;

    const updatedPlayers = game.players.map(p => ({
      name: p.name,
      adminId: user.email,
      isWinner: p.isWinner,
    }));

    const updatedGame = {
      ...game,
      winner: winner.name,
      endDate: new Date()
    }

    // Firebase update
    updatePlayers(updatedPlayers);
    updateGame(updatedGame);

    this.setState({ winner, results });
  };

  addInput = (player, number) => {
    player.roundPoints = number === 'del' ? '' : ('' + player.roundPoints + number);
    this.setState({
      game: {
        ...this.state.game,
        players: [...this.state.game.players, player]
      }
    });
  };

  inputButtons = player => {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'del'];

    const buttonStyles = {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap'
    };

    const buttonStyle = {
      marginBottom: '10px' 
    };

    return (
      <div style={buttonStyles}>
        {numbers.map(number => (
          <button
            key={number}
            type="button"
            className="btn-small teal lighten-3"
            style={buttonStyle} onClick={this.addInput.bind(this, player, number)} >
              {number}
          </button>
        ))}
      </div>
    );
  };

  playerInputs = players => {
    return players
      .sort((a,b) => a.index - b.index)
      .map(player => {
        let labelStyle;

        if (!player.isActive) {
          labelStyle = { fontSize: '1.4rem' };
        }
      
        return (
          <div key={player.name} className="row test">
            <div className="input-field col s12">
              <input
                id="name"
                type="text"
                autoComplete='off'
                disabled={!player.isActive}
                value={player.roundPoints}
                ref={(input)=>{ if (player.isActive && input) { input.focus() }}}
                readOnly
                onChange={this.onChange.bind(this, player)}/>
              <label htmlFor="name" style={labelStyle}>
                {player.name} {player.totalPoints} {player.isActive}
              </label>
              {player.isActive && this.inputButtons(player)}
            </div>
          </div>
        );
      });
  }


  render() {

    const { players } = this.state.game;
    const { results, playback } = this.state;

    if(players && players.length > 0 && results.length === 0) {

      const buttonsStyle = {
        position: 'fixed',
        left: '0',
        bottom: '10px',
        width: '100%'
      };

      return (
        <div>
          <h4 className="red-text text-lighten-2"> Game
            <button onClick={this.playback} disabled={playback.length === 0} className="btn-small grey lighten-2 right">
              <i className="material-icons left">undo</i> Undo
            </button>
          </h4>
          <div className="row">
            <form className="col s12">
            
              {this.playerInputs(players)} 

              <div className="center" style={buttonsStyle}>
                <input type="button" value="FINISH" className="btn-large red left"
                  onClick={this.finish} />
                <input type="button" value="NEXT" className="btn-large teal right"
                  onClick={this.nextPlayer}/>
              </div>
            </form>
          </div>
        </div>
      );
    } else if (results.length > 0) {
      const btnContainerStyle = { display: 'flex', justifyContent: 'space-around' };
      const imgStyle = {position:'absolute', zIndex: -1};

      return (<div>
        <h3 className='blue-text'>Congrats {results[0].name}!</h3>
        <img style={imgStyle} src={fireworks} />
        <ul className="collection">
          {results.map(p => {
            return <li key={p.name} className="collection-item">{p.name}<span className="secondary-content">{p.totalPoints}</span></li>
          })}
        </ul>
        <div style={btnContainerStyle}>
          <button className="btn red center-block" onClick={() =>  this.props.history.push('/players/add')}>New Game</button>
          <button className="btn blue center-block" onClick={() => this.props.history.push('/rankings')}>Rankings</button>
        </div>
      </div>);
    } else {
      return <Spinner />
    }
  }
}

const mapStateToProps = state => ({
  user: state.user,
  game: state.game,
  gameLoading: state.loading.game
})
  
export default connect(mapStateToProps, {
  fetchCurrentGame,
  updateGame,
  updatePlayers
})(Game);