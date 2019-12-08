import React from "react"

const box_class = (hovered, last) => {
  return "box " + (hovered ? "selected " : "") + (last ? "last " : "")
}

class Box extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hovered: false, last: false, value: this.random_value() }
  }

  enter = () => {
    const last = this.props.parent.get_last_coords()
    this.props.parent.clear_last()
    this.setState({
      hovered: this.state.hovered,
      last: true,
      value: this.state.value,
    })
    if (last != null) {
      const ij = last[0]
      if (Math.abs(ij.i - this.props.i) + Math.abs(ij.j - this.props.j) > 1) {
        this.props.parent.clear_selection()
        this.props.parent.clear_last()
        return
      }
    }
    if (this.props.parent.selection_on()) {
      if (this.state.hovered) {
        this.props.parent.clear_selection()
      }
      this.setState({ hovered: true, last: true, value: this.state.value })
    }
  }

  leave = () => {
    this.setState(
      {
        hovered: this.state.hovered,
        last: this.state.last,
        value: this.state.value,
      },
      () => {
        this.props.parent.check_leave()
      }
    )
  }
  random_value = () => {
    return Math.ceil(3 * Math.random())
  }
  unselect_box = () => {
    this.setState({
      hovered: false,
      last: this.state.last,
      value: this.state.value,
    })
  }
  clear_last = () => {
    this.setState({
      hovered: this.state.hovered,
      last: false,
      value: this.state.value,
    })
  }
  get_last_coords = () => {
    if (this.state.last) {
      return { i: this.props.i, j: this.props.j }
    } else {
      return null
    }
  }
  select_if_last = () => {
    if (this.state.last) {
      this.setState({ hovered: true, last: true, value: this.state.value })
    }
  }
  is_last() {
    return this.state.last
  }
  update_value(sum) {
    if (this.state.hovered) {
      if (this.state.last) {
        this.setState({
          hovered: false,
          last: this.state.last,
          value: sum,
        })
      } else {
        this.setState({
          hovered: false,
          last: this.state.last,
          value: this.random_value(),
        })
      }
    }
  }
  get_value() {
    if (this.state.hovered) {
      return this.state.value
    } else {
      return 0
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
          <div className="inner">{this.state.value}</div>
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
      ).size == 2
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
