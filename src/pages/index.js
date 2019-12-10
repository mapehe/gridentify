import React from "react"
import Layout from "../components/layout"
import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"
import Grid from "../components/grid/grid"
import Score from "../components/score"

const GRID_SIZE = 5

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
  }
  score = null
  increase_score(score) {
    if (this.score == null) {
    } else {
      this.score.add_score(score)
    }
  }
  render() {
    return (
      <Layout>
        <Score
          ref={b => {
            this.score = b
          }}
        />
        <div className="grid">
          <Grid grid_size={GRID_SIZE} parent={this} />
        </div>
      </Layout>
    )
  }
}

export default IndexPage
