import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spinner from '../../components/layout/Spinner';
import { fetchAllPlayers } from '../../actions/playersActions';

class Rankings extends Component {

  componentDidMount(){
    this.props.fetchAllPlayers();
  }

  render() {
    const { players, allPlayersLoading } = this.props;

    if(allPlayersLoading === false && players) {

      if(players.length > 0) {

        const records = () => {
          return (
            <table>
              <thead>
                <tr>
                    <th>Name</th>
                    <th>Played</th>
                    <th>Won</th>
                    <th>Rate</th>
                </tr>
              </thead>

              <tbody>
                {
                  players
                  .sort((a,b) => b.gamesWon - a.gamesWon)
                  .map(player => {
                    return (
                      <tr key={player.name}>
                        <td>{player.name}</td>
                        <td>{player.gamesPlayed}</td>
                        <td>{player.gamesWon}</td>
                        <td>{player.gamesWon ? (player.gamesWon / player.gamesPlayed).toFixed(2) : '-'}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          )
        }

        return (
          <div>
            <h4 className="red-text text-lighten-2">History</h4>
            <div className="row">
              <form className="col s12">

                {records()} 

              </form>
            </div>
          </div>
        );
      } else {
        return <div>No players...</div>
      }
    } else {
      return <Spinner />
    }
  }
}

Rankings.propTypes = {
};

const mapStateToProps = state => ({
  allPlayersLoading: state.loading.allPlayers,
  players: state.players,
})
  
export default connect(mapStateToProps, {
  fetchAllPlayers,
})(Rankings);