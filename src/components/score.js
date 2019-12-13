import React from "react"

class Score extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: 0 }
  }
  add_score(x) {
    return new Promise(resolve => {
      this.setState({ value: this.state.value + x }, resolve)
    })
  }
  reset() {
    this.setState({ value: 0 })
  }
  render() {
    return (
      <p id="score_value" className="m-4">
        {this.state.value}
      </p>
    )
  }
}

export default Score
