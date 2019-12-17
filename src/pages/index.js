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
import { Link } from "gatsby"
const Ajv = require("ajv")
const ajv = new Ajv({
  allErrors: true,
})

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
      connected: false,
    }
    this.send_score = () => {}
    this.prompt_nick = this.prompt_nick.bind(this)
  }
  componentDidMount = () => {
    const stored_nick = window.localStorage.getItem("nick")
    if (stored_nick === null) {
      this.prompt_nick("Choose a nick")
    } else {
      this.setState({
        endpoint: this.state.endpoint,
        username: stored_nick,
        connected: this.state.connected,
      })
    }
    const socket = socketIOClient(this.state.endpoint)
    socket.on("connect", () => {
      this.setConnected(true)
    })
    socket.on("disconnect", () => {
      this.setConnected(false)
    })
    socket.on("score", data => {
      this.setConnected(true)
      const sanitized = this.sanitize_score(data)
      if (sanitized !== null) {
        this.receive_score(sanitized)
      }
    })
    socket.on("record", data => {
      this.receive_record(data)
    })
    this.send_score = input => {
      return (this.state.username === undefined ||
      this.state.username === null ||
      this.state.username === "undefined"
        ? this.prompt_nick(
            "Choose a nick",
            "Your score can't be sent without a nick."
          )
        : Promise.resolve(1)
      ).then(() => {
        const data = {
          score: this.score.state.value,
          username: this.state.username,
          moves: input.moves,
          seed: input.seed,
          grid_size: input.grid_size,
        }
        socket.emit("score", data)
      })
    }
  }
  sanitize_score(data) {
    const schema = {
      type: "object",
      required: ["score", "username"],
      properties: {
        username: {
          type: "string",
          minLength: 1,
          maxLength: 20,
        },
        score: {
          type: "number",
        },
      },
      additionalProperties: false,
    }
    const validate = ajv.compile(schema)
    const valid = validate(data)
    if (valid) {
      return data
    } else {
      return null
    }
  }
  prompt_nick(title, text = "") {
    return Swal.fire({
      title: title,
      text: text,
      input: "text",

      inputAttributes: {
        maxlength: 20,
      },
      inputValidator: value => {
        return new Promise(resolve => {
          if (value.length > 0) {
            resolve()
          } else {
            resolve("Your nick can't be empty!")
          }
        })
      },
    }).then(nick => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("nick", nick.value)
      }
      this.setState({
        endpoint: this.state.endpoint,
        username: nick.value,
        connected: this.state.connected,
      })
    })
  }
  nick_text() {
    return (
      <>
        <div className="text-center mb-4" style={{ width: "100%" }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              this.prompt_nick("Choose a new nick")
            }}
          >
            Change Nick
          </button>
        </div>
      </>
    )
  }
  setConnected(value) {
    this.setState({
      endpoint: this.state.endpoint,
      username: this.state.username,
      connected: value,
    })
  }
  receive_score(data) {
    this.score_feed.new_score(data)
  }
  receive_record(data) {
    this.score_feed.update_records(data)
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
          <Row id="grid_row">
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
            {this.nick_text()}
            <ScoreFeed
              ref={b => {
                this.score_feed = b
              }}
              connected={this.state.connected}
            />
          </Row>
          <footer className="mt-5 mb-4 text-center" style={{ width: "100%" }}>
            <p>
              This site uses cookies. <Link to="/privacy">Learn more.</Link>
            </p>
            <p style={{ fontSize: "12px" }}>
              &#103;&#114;&#105;&#100;&#101;&#110;&#116;&#105;&#111;&#064;&#103;&#109;&#097;&#105;&#108;&#046;&#099;&#111;&#109;
            </p>
          </footer>
        </Container>
      </Layout>
    )
  }
}

export default IndexPage
