import React from "react"
import Layout from "../components/layout"
import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"
import Grid from "../components/grid/grid"
import Score from "../components/score"
import Intro from "../components/intro"
import ScoreFeed from "../components/score_feed"
import socketIOClient from "socket.io-client"
import Container from "react-bootstrap/Container"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import { isMobile } from "react-device-detect"
import Swal from "sweetalert2"

const GRID_SIZE = 5

class IndexPage extends React.Component {
  score = null
  score_feed = null
  alert_username = true
  constructor(props) {
    super(props)
    this.state = {
      endpoint: process.env.BACKEND_ENDPOINT,
      username: "username",
    }
    this.send_score = () => {}
  }
  componentDidMount = () => {
    Swal.fire({
      title: "Choose a nick",
      input: "text",

      inputAttributes: {
        maxlength: 15,
      },
      inputValidator: value => {
        return new Promise(resolve => {
          if (/^[a-zA-Z0-9 ]/.test(value)) {
            resolve()
          } else {
            resolve(
              "Your nick can only contain alphanumeric characters and spaces."
            )
          }
        })
      },
    }).then(nick => {
      this.setState({
        endpoint: this.state.endpoint,
        username: nick.value,
      })
    })

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
    socket.on("record", data => {
      this.receive_record(data)
    })
  }
  receive_score(data) {
    this.score_feed.new_score(this.sanitize_score(data))
  }
  receive_record(data) {
    this.score_feed.update_records(data)
  }
  sanitize_score(data) {
    return {
      username: data.username.replace(/[^0-9a-z ]/gi, ""),
      score: Number(data.score),
    }
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
        <Container id="main_container" className="pt-5">
          <Intro />
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
