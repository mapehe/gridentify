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

const noty_count = !isMobile ? 10 : 3
Noty.setMaxVisible(noty_count)

class TopScoreElement extends React.Component {
  render() {
    return (
      <ListGroup.Item>
        {this.props.username} {this.props.score}
      </ListGroup.Item>
    )
  }
}

class TopScoreFeed extends React.Component {
  render() {
    return (
      <>
        <Card>
          <Card.Header>{this.props.title}</Card.Header>
          <ListGroup>{this.props.children}</ListGroup>
        </Card>
      </>
    )
  }
}

class ScoreFeed extends React.Component {
  notys = []
  constructor(props) {
    super(props)
    this.state = {
      daily_top: [...Array(5).keys()].map(e => {
        return { username: "", score: "0" }
      }),
      all_top: [...Array(5).keys()].map(e => {
        return { username: "", score: "0" }
      }),
    }
  }
  new_score(data) {
    const n = new Noty({
      text: "<b>" + data.username + "</b> " + Number(data.score.toString()),
      closeWith: ["click"],
      type: "info",
      theme: "semanticui",
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
  feeds() {
    return (
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
    )
  }

  render() {
    return (
      <>
        <Container className="scoreContainer">{this.feeds()}</Container>
      </>
    )
  }
}

export default ScoreFeed
