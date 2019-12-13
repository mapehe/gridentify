import React from "react"
import Container from "react-bootstrap/Container"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Card from "react-bootstrap/Card"
import ListGroup from "react-bootstrap/ListGroup"
import "./score_feed.css"
import { isMobile } from "react-device-detect"

class RealTimeScoreElement extends React.Component {
  render() {
    return (
      <>
        <p>
          {this.props.username}: {this.props.score}
        </p>
      </>
    )
  }
}

class TopScoreElement extends React.Component {
  render() {
    return (
      <ListGroup.Item>
        {this.props.username} {this.props.score}
      </ListGroup.Item>
    )
  }
}

class RealTimeScoreFeed extends React.Component {
  ref = null
  constructor(props) {
    super(props)
    this.state = {
      height: null,
    }
  }
  componentDidMount() {
    const height = this.ref.clientHeight
    this.setState({
      height: height,
    })
  }
  render() {
    return (
      <>
        <Card style={{ height: "100%" }}>
          <Card.Header>Score Feed</Card.Header>
          <Card.Body
            ref={b => {
              this.ref = b
            }}
            style={
              this.state.height != null && !isMobile
                ? { maxHeight: this.state.height, overlfow: "hidden" }
                : isMobile
                ? { height: "60vh" }
                : {}
            }
            className="overflow-auto"
          >
            {this.props.children}
          </Card.Body>
        </Card>
      </>
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
  constructor(props) {
    super(props)
    this.state = {
      scores: [],
      daily_top: [...Array(5).keys()].map(e => {
        return { username: "", score: "0" }
      }),
      all_top: [...Array(5).keys()].map(e => {
        return { username: "", score: "0" }
      }),
    }
  }
  new_score(data) {
    this.setState({
      scores: this.state.scores.concat([data]),
      daily_top: this.state.daily_top,
      all_top: this.state.all_top,
    })
  }
  feeds() {
    return (
      <Container
        id="scoreFeedsContainer"
        style={isMobile ? { padding: "0" } : {}}
      >
        <Row>
          <Col style={{ padding: "0" }} xs={12} sm={6}>
            <RealTimeScoreFeed>
              {this.state.scores
                .map((score, index) => (
                  <RealTimeScoreElement
                    username={score.username}
                    score={score.score}
                    key={"realtime-" + index.toString()}
                  />
                ))
                .reverse()}
            </RealTimeScoreFeed>
          </Col>
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
