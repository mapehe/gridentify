import React from "react"

const box_class = (hovered, last) => {
  return "box " + (hovered ? "selected " : "") + (last ? "last " : "")
}

class Box extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hovered: false, last: false }
  }

  enter = () => {
    this.setState({ hovered: this.state.hovered, last: true })
    if (this.props.parent.selection_on()) {
      if (this.state.hovered) {
        this.props.parent.clear_selection()
      }
      this.setState({ hovered: true, last: true })
    }
  }

  leave = () => {
    this.setState({ hovered: this.state.hovered, last: false })
  }
  unselect_box = () => {
    this.setState({ hovered: false, last: this.state.last })
  }
  select_if_last = () => {
    if (this.state.last) {
      this.setState({ hovered: true, last: true })
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
    this.state = { selection_on: false }
    this.touchDown = this.touchDown.bind(this)
    this.touchUp = this.touchUp.bind(this)
    this.clear_selection = this.clear_selection.bind(this)
  }
  boxes = []
  clear_selection() {
    this.boxes.forEach(e => (e != null ? e.unselect_box() : {}))
  }
  selection_on() {
    return this.state.selection_on
  }
  touchDown() {
    this.boxes.forEach(e => (e != null ? e.select_if_last() : {}))
    this.setState({ selection_on: true })
  }
  touchUp() {
    this.clear_selection()
    this.setState({ selection_on: false })
  }
  render() {
    this.boxes = []
    return Array.from(Array(this.props.grid_size)).map((_, i) => (
      <div onMouseDown={this.touchDown} onMouseUp={this.touchUp}>
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
      </div>
    ))
  }
}

export default Grid
