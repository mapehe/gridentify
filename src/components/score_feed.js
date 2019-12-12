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
    if (!isMobile) {
      return (
        <ListGroup.Item>
          {this.props.username} {this.props.score}
        </ListGroup.Item>
      )
    } else {
      return (
        <p>
          <span>{this.props.username}</span> <span>{this.props.score}</span>
        </p>
      )
    }
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
    console.log(height)
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
              this.state.height != null
                ? { maxHeight: this.state.height, overlfow: "hidden" }
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
      <Container>
        <Row>
          <Col sm={5} style={!isMobile ? { paddingRight: "0" } : {}}>
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
          <Col style={!isMobile ? { paddingLeft: "0" } : {}}>
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
    if (!isMobile) {
      return (
        <>
          <Container
            className="scoreContainer"
            style={{ marginTop: "0", paddingLeft: "30px" }}
          >
            {this.feeds()}
          </Container>
        </>
      )
    } else {
      return (
        <>
          <Container className="scoreContainer">{this.feeds()}</Container>
        </>
      )
    }
  }
}

export default ScoreFeed
