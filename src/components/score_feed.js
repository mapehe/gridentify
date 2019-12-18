import React from "react"
import Container from "react-bootstrap/Container"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Card from "react-bootstrap/Card"
import ListGroup from "react-bootstrap/ListGroup"
import "./score_feed.css"
import { isMobile } from "react-device-detect"
import Noty from "noty"
import "noty/lib/noty.css"
import "noty/lib/themes/semanticui.css"
import $ from "jquery"

const noty_count = !isMobile ? 10 : 2
Noty.setMaxVisible(noty_count)

class TopScoreElement extends React.Component {
  render() {
    return (
      <p>
        <span>{this.props.username}</span> <span>{this.props.score}</span>
      </p>
    )
  }
}

class TopScoreFeed extends React.Component {
  render() {
    return (
      <>
        <Card style={{ height: "100%" }}>
          <Card.Header style={{ backgroundColor: "#f9edff" }}>
            <b>{this.props.title}</b>
          </Card.Header>
          <Card.Body>{this.props.children}</Card.Body>
        </Card>
      </>
    )
  }
}

class ScoreFeed extends React.Component {
  id_counter = 0
  notys = []
  constructor(props) {
    super(props)
    this.state = {
      daily_top: null,
      all_top: null,
    }
  }
  new_score(data) {
    if (!this.props.mute_live) {
      const id1 = `noty-${this.id_counter}-username`
      const id2 = `noty-${this.id_counter}-score`
      const div_id = `noty-${this.id_counter}-container`
      const n = new Noty({
        text: `<div id="${div_id}"><b id="${id1}"></b> <span id="${id2}"></span></div>`,
        closeWith: ["click"],
        type: "info",
        theme: "semanticui",
        timeout: isMobile ? 2000 : false,
      }).on("afterShow", () => {
        try {
          $(`#${div_id}`).toggle()
          document.getElementById(id1).innerText = data.username
          document.getElementById(id2).innerText = data.score
          $(`#${div_id}`).slideDown(200)
        } catch (e) {
          console.log(e)
        }
      })
      this.notys.push(n)
      n.show()
      if (this.notys.length > noty_count) {
        this.notys
          .slice(0, Math.max(this.notys.length - noty_count, 0))
          .map(n => {
            n.close()
            return 0
          })
      }
      this.notys = this.notys.slice(Math.max(this.notys.length - noty_count, 0))
    }
    this.id_counter += 1
  }
  update_records(data) {
    this.setState({
      daily_top: data.daily,
      all_top: data.all_time,
    })
  }

  render() {
    if (this.props.mute_live) {
      Noty.closeAll()
    }
    return this.props.connected &&
      this.state.daily_top !== null &&
      this.state.all_top !== null ? (
      <>
        <Container className="scoreContainer">
          <Container
            id="scoreFeedsContainer"
            style={isMobile ? { padding: "0" } : {}}
          >
            <Row>
              <Col style={{ padding: "0" }}>
                <TopScoreFeed title="Daily High">
                  {this.state.daily_top.slice(0, 5).map((score, index) => (
                    <TopScoreElement
                      username={score.username}
                      score={score.score}
                      index={index}
                      key={"daily-" + index.toString()}
                    />
                  ))}
                </TopScoreFeed>
              </Col>
              <Col style={{ padding: "0" }}>
                <TopScoreFeed title="All Time High">
                  {this.state.all_top.slice(0, 5).map((score, index) => (
                    <TopScoreElement
                      username={score.username}
                      score={score.score}
                      index={index}
                      key={"alltime-" + index.toString()}
                    />
                  ))}
                </TopScoreFeed>
              </Col>
            </Row>
          </Container>
        </Container>
      </>
    ) : null
  }
}

export default ScoreFeed
