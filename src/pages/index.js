import React, { useState } from "react"
import Layout from "../components/layout"
import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"

const GRID_SIZE = 5

const box_class = (hovered, last) => {
  return "box " + (hovered ? "selected " : "") + (last ? "last " : "")
}

class Box extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hovered: false, last: false, mouseLast: false }
  }

  enter = () => {
    if (this.state.hovered) {
      this.props.parent.handle_last()
    }
    this.setState({ hovered: true, last: !this.state.hovered, mouseLast: true })
  }

  leave = () => {
    this.setState({ hovered: this.state.last, last: false, mouseLast: false })
  }

  handle_last = () => {
    if (this.state.last) {
      this.setState({ hovered: false, last: false, mouseLast: false })
    }
  }

  render() {
    return (
      <>
        <div
          id={`ge-${this.props.i}-${this.props.j}`}
          onMouseEnter={this.enter}
          onMouseLeave={this.leave}
          className={box_class(this.state.hovered, this.state.last)}
        >
          <div className="inner">0</div>
        </div>
      </>
    )
  }
}

class Grid extends React.Component {
  constructor(props) {
    super(props)
    this.state = { n: 5 }
  }
  boxes = []
  handle_last() {
    this.boxes.map(e => e.handle_last())
  }
  render() {
    return Array.from(Array(this.props.grid_size)).map((_, i) => (
      <div className="row">
        {Array.from(Array(this.props.grid_size)).map((_, j) => (
          <Box
            i={i}
            j={j}
            parent={this}
            ref={b => {
              this.boxes.push(b)
            }}
          />
        ))}
      </div>
    ))
  }
}

const IndexPage = () => (
  <Layout>
    <div className="grid">
      <Grid grid_size={5} />
    </div>
  </Layout>
)

export default IndexPage
