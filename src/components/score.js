import React from "react"

class Score extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: 0 }
  }
  add_score(score) {
    this.setState({ value: this.state.value + Number(score) })
  }
  reset() {
    this.setState({ value: 0 })
  }
  render() {
    return <p>{this.state.value}</p>
  }
}

export default Score
