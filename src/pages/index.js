import React from "react"
import Layout from "../components/layout"
import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"
import Grid from "../components/grid/grid"
import Score from "../components/score"
import ScoreFeed from "../components/score_feed"
import socketIOClient from "socket.io-client"

const GRID_SIZE = 5

class IndexPage extends React.Component {
  score = null
  score_feed = null
  constructor(props) {
    super(props)
    this.state = {
      endpoint: "localhost:3000",
      username: "username",
    }
    this.send_score = () => {}
  }
  componentDidMount = () => {
    const socket = socketIOClient(this.state.endpoint)
    this.send_score = input => {
      const data = {
        score: this.score.state.value,
        username: this.state.username,
        initial_state: input.initial_state,
        moves: input.moves,
        seed: input.seed,
      }
      this.receive_score(data)
      socket.emit("score", data)
    }
    socket.on("score", data => {
      this.receive_score(data)
    })
  }
  receive_score(data) {
    console.log(data)
    this.score_feed.new_score(data)
  }
  increase_score(score) {
    if (this.score == null) {
      return Promise(1)
    } else {
      return this.score.add_score(score)
    }
  }
  render() {
    return (
      <Layout>
        <Score
          ref={b => {
            this.score = b
          }}
        />
        <div className="grid">
          <Grid grid_size={GRID_SIZE} parent={this} />
        </div>
        <ScoreFeed
          ref={b => {
            this.score_feed = b
          }}
        />
      </Layout>
    )
  }
}

export default IndexPage
