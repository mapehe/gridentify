import React from "react"
import Layout from "../components/layout"
import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"
import Grid from "../components/grid/grid"
import Score from "../components/score"
import ScoreFeed from "../components/score_feed"
import socketIOClient from "socket.io-client"
import Container from "react-bootstrap/Container"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import { isMobile } from "react-device-detect"

const GRID_SIZE = 5

class IndexPage extends React.Component {
  score = null
  score_feed = null
  constructor(props) {
    super(props)
    this.state = {
      endpoint: process.env.BACKEND_ENDPOINT,
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
      socket.emit("score", data)
    }
    socket.on("score", data => {
      this.receive_score(data)
    })
  }
  receive_score(data) {
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
        <Container
          className="pt-5"
          style={{ maxWidth: "70vh", marginTop: "200px" }}
        >
          <Row>
            <Col style={{ textAlign: "center" }}>
              <div className="grid">
                <Grid grid_size={GRID_SIZE} parent={this} />
              </div>
              <Score
                ref={b => {
                  this.score = b
                }}
              />
            </Col>
          </Row>
          <Row>
            <ScoreFeed
              ref={b => {
                this.score_feed = b
              }}
            />
          </Row>
        </Container>
      </Layout>
    )
  }
}

export default IndexPage
