import React from "react"
import Box from "./box"

class Grid extends React.Component {
  constructor(props) {
    super(props)
    this.state = { selection_on: false }
    this.touchDown = this.touchDown.bind(this)
    this.touchUp = this.touchUp.bind(this)
    this.clear_selection = this.clear_selection.bind(this)
    this.touchStart = this.touchStart.bind(this)
    this.touchEnd = this.touchEnd.bind(this)
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
  touchDown(event) {
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
  touchUp(clear_last) {
    const sum = this.boxes
      .map(e => (e != null ? e.get_value() : 0))
      .reduce((a, b) => a + b, 0)
    if (this.validate_selection()) {
      this.update_boxes(sum)
      if (
        this.boxes.filter(e => e != null).filter(e => e.state.hovered).length >
        1
      ) {
        this.props.parent.increase_score(sum)
        if (this.check_game_over()) {
          this.boxes.filter(e => e != null).forEach(e => e.random_value())
          this.props.parent.score.reset()
        }
      }
    } else {
      this.clear_selection()
    }

    this.setState({ selection_on: false }, () => {
      if (clear_last) {
        this.clear_last()
      }
    })
  }
  check_game_over() {
    var vals = {}
    const range = Array.from(Array(5)).map((_, i) => i)
    for (const i of range) {
      for (const j of range) {
        const val = this.boxes
          .filter(e => e != null)
          .filter(e => e.props.i === i && e.props.j === j)
          .map(e => e.state.value)[0]
        vals[i.toString() + "-" + j.toString()] = val
      }
    }
    var game_over = true
    for (var h of range) {
      for (var k of range) {
        var has_neighbor = false
        for (var dx of [-1, 1]) {
          for (var dy of [-1, 1]) {
            if (dx === dy) {
              continue
            } else {
              has_neighbor =
                has_neighbor ||
                vals[h.toString() + "-" + k.toString()] ===
                  vals[(h + dx).toString() + "-" + (k + dy).toString()]
            }
          }
        }
        console.log([h, k, has_neighbor])
        game_over = game_over && !has_neighbor
      }
    }
    console.log(game_over)
  }
  boxFromEvent(e) {
    const p = [e.touches[0].clientX, e.touches[0].clientY]
    try {
      const s = document.elementFromPoint(p[0], p[1])
      return this.boxes
        .filter(e => e != null)
        .filter(e => e.is_this_element(s.id))
    } catch (err) {
      console.log(err)
      return []
    }
  }
  get_last() {
    return this.boxes.filter(e => e != null).filter(e => e.is_last())
  }
  touchMove(e) {
    const bs = this.boxFromEvent(e)
    if (bs.length > 0) {
      bs.forEach(b => (!b.state.last ? b.mobile_enter() : {}))
    } else {
      this.clear_selection()
      this.setState({ selection_on: false }, () => {
        this.clear_last()
      })
    }
  }
  touchStart(e) {
    const bs = this.boxFromEvent(e)
    if (bs.length > 0) {
      const b = bs[0]
      b.setState(
        {
          hovered: true,
          last: true,
          value: b.state.value,
        },
        this.touchDown()
      )
    }
  }
  touchEnd() {
    this.touchUp(true)
  }

  render() {
    this.boxes = []
    return Array.from(Array(this.props.grid_size)).map((_, i) => (
      <div
        onMouseDown={this.touchDown}
        onMouseUp={() => {
          this.touchUp(false)
        }}
        onTouchMove={e => this.touchMove(e)}
        onTouchStart={this.touchStart}
        onTouchEnd={this.touchEnd}
        key={"a" + i.toString()}
      >
        <div className="row">
          {Array.from(Array(this.props.grid_size)).map((_, j) => (
            <Box
              i={i}
              j={j}
              parent={this}
              ref={b => {
                this.boxes.push(b)
              }}
              key={i.toString() + "-" + j.toString()}
            />
          ))}
        </div>
      </div>
    ))
  }
}

export default Grid
