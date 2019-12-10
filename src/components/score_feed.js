import React from "react"

class ScoreFeed extends React.Component {
  constructor(props) {
    super(props)
    this.state = { scores: [] }
  }
  new_score(data) {
    this.setState({ scores: this.state.scores.concat([data]) })
  }

  render() {
    return this.state.scores.map((score, index) => null)
  }
}

export default ScoreFeed
