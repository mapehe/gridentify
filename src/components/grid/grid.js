import React from "react"
import Box from "./box"

class Grid extends React.Component {
  constructor(props) {
    super(props)
    this.state = { selection_on: false }
    this.touchDown = this.touchDown.bind(this)
    this.touchUp = this.touchUp.bind(this)
    this.clear_selection = this.clear_selection.bind(this)
  }
  boxes = []
  check_leave() {
    if (
      !this.boxes
        .map(e => (e != null ? e.is_last() : null))
        .filter(e => !(e == null))
        .reduce((a, b) => a || b, false)
    ) {
      this.clear_selection()
      this.setState({ selection_on: false })
    }
  }
  clear_selection() {
    this.boxes.forEach(e => (e != null ? e.unselect_box() : {}))
  }
  clear_last() {
    this.boxes.forEach(e => (e != null ? e.clear_last() : {}))
  }
  selection_on() {
    return this.state.selection_on
  }
  update_boxes(sum) {
    this.boxes.forEach(e => (e != null ? e.update_value(sum) : {}))
  }
  touchDown() {
    this.boxes.forEach(e => (e != null ? e.select_if_last() : {}))
    this.setState({ selection_on: true })
  }
  validate_selection() {
    return (
      new Set(
        this.boxes
          .map(e => (e != null ? e.get_value() : null))
          .filter(e => e != null)
      ).size === 2
    )
  }
  get_last_coords() {
    const arr = this.boxes
      .map(e => (e != null ? e.get_last_coords() : null))
      .filter(e => e != null)
    return arr.length > 0 ? arr : null
  }
  touchUp() {
    const sum = this.boxes
      .map(e => (e != null ? e.get_value() : 0))
      .reduce((a, b) => a + b, 0)
    if (this.validate_selection()) {
      this.update_boxes(sum)
    } else {
      this.clear_selection()
    }
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
