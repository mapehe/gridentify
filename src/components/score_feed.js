import React from "react"
import Container from "react-bootstrap/Container"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
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
        <div style={{ marginBottom: "15px" }}>
          <p style={{ margin: "0" }}>{this.props.username}</p>
          <p style={{ margin: "0" }}>{this.props.score}</p>
        </div>
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
  render() {
    return (
      <div className="realTimeScoreFeed scoreFeed">{this.props.children}</div>
    )
  }
}

class TopScoreFeed extends React.Component {
  render() {
    return (
      <div className="scoreFeed" style={{ marginBottom: "40px" }}>
        {this.props.children}
      </div>
    )
  }
}

class ScoreFeed extends React.Component {
  constructor(props) {
    super(props)
    this.state = { scores: [], daily_top: Array(5), all_top: Array(5) }
  }
  new_score(data) {
    this.setState({
      scores: this.state.scores.concat([data]),
      daily_top: this.daily_top,
      all_top: this.all_top,
    })
  }

  feeds() {
    return (
      <>
        <Col sm={5}>
          <div className="scoreFeedTitle">
            <b>Score feed</b>
          </div>
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
        <Col>
          {!isMobile ? (
            <Row>
              <Col>
                <div className="scoreFeedTitle">
                  <b>Daily high</b>
                  <TopScoreFeed>
                    {this.state.scores.slice(0, 5).map((score, index) => (
                      <TopScoreElement
                        username={score.username}
                        score={score.score}
                        index={index}
                        key={"daily-" + index.toString()}
                      />
                    ))}
                  </TopScoreFeed>
                </div>
              </Col>
              <Col>
                <div className="scoreFeedTitle">
                  <b>All time high</b>
                </div>
                <TopScoreFeed>
                  {this.state.scores.slice(0, 5).map((score, index) => (
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
          ) : (
            <>
              <div className="scoreFeedTitle">
                <b>Today's high</b>
                <TopScoreFeed>
                  {this.state.scores.slice(0, 5).map((score, index) => (
                    <TopScoreElement
                      username={score.username}
                      score={score.score}
                      index={index}
                      key={"daily-" + index.toString()}
                    />
                  ))}
                </TopScoreFeed>
              </div>
              <div className="scoreFeedTitle">
                <b>All time high</b>
              </div>
              <TopScoreFeed>
                {this.state.scores.slice(0, 5).map((score, index) => (
                  <TopScoreElement
                    username={score.username}
                    score={score.score}
                    index={index}
                    key={"alltime-" + index.toString()}
                  />
                ))}
              </TopScoreFeed>
            </>
          )}
        </Col>
      </>
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
            <Row>{this.feeds()}</Row>
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
