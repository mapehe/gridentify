import React from "react"
import Box from "./box"

class Grid extends React.Component {
  constructor(props) {
    super(props)
    this.state = { selection_on: false }
    this.seed = Date.now()
    this.initial_seed = this.seed
    this.touchDown = this.touchDown.bind(this)
    this.touchUp = this.touchUp.bind(this)
    this.clear_selection = this.clear_selection.bind(this)
    this.touchStart = this.touchStart.bind(this)
    this.touchEnd = this.touchEnd.bind(this)
  }
  boxes = []
  selected = []
  moves = []
  initial_status = null
  seed = null
  initial_seed = null
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
  record_selection(box) {
    this.selected.push([box.props.i, box.props.j])
  }
  selection_on() {
    return this.state.selection_on
  }
  next_pseudorandom() {
    const out = (this.seed = (this.seed * 16807) % 2147483647)
    if (this.seed <= 0) this.seed += 2147483646
    return (out % 3) + 1
  }
  random_array(n) {
    var out = []
    for (const i in Array(n).fill(1)) {
      out.push(this.next_pseudorandom())
    }
    return out
  }
  update_boxes(sum, ids) {
    const vals = this.random_array(ids.length - 1).concat(sum)
    return Promise.all(
      this.boxes
        .map(e =>
          e !== null ? e.update_value(sum, ids, vals) : Promise.resolve(1)
        )
        .filter(e => e !== undefined)
    )
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
    if (
      this.boxes.filter(e => e != null).filter(e => e.state.hovered).length > 1
    ) {
      const sum = this.boxes
        .map(e => (e != null ? e.get_value() : 0))
        .reduce((a, b) => a + b, 0)
      if (this.initial_status === null) {
        this.initial_status = this.get_state()
      }
      if (this.validate_selection()) {
        this.props.parent.increase_score(sum).then(() => {
          if (this.selected.length > 0) {
            this.moves.push(this.selected)
          }
          this.update_boxes(sum, this.selected).then(() => {
            if (this.check_game_over()) {
              this.props.parent.send_score({
                initial_state: this.initial_status,
                moves: this.moves,
                seed: this.initial_seed,
              })
              this.boxes.filter(e => e != null).forEach(e => e.init_value())
              this.props.parent.score.reset()
              this.seed = Date.now()
              this.initial_seed = this.seed
              this.moves = []
              this.initial_status = null
            }
          })

          this.clear_selection()
          this.selected = []
        })
      } else {
        this.clear_selection()
        this.selected = []
      }
    } else {
      this.clear_selection()
      this.selected = []
    }

    this.setState({ selection_on: false }, () => {
      if (clear_last) {
        this.clear_last()
      }
    })
  }
  get_state() {
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
    return vals
  }
  check_game_over() {
    const vals = this.get_state()
    var is_move = false
    const range = Array.from(Array(5)).map((_, i) => i)
    for (const i of range) {
      for (const j of range) {
        var neighbor = false

        const a = vals[i.toString() + "-" + j.toString()]
        for (const dx of [-1, 0, 1]) {
          for (const dy of [-1, 0, 1]) {
            if ((dx !== 0 && dy !== 0) || dx === dy) {
              continue
            } else {
              const b = vals[(i + dx).toString() + "-" + (j + dy).toString()]
              neighbor = a === b || neighbor
            }
          }
        }
        is_move = is_move || neighbor
      }
    }
    return !is_move
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
        () => {
          this.touchDown()
        }
      )
    }
  }
  touchEnd() {
    this.touchUp(true)
  }

  render() {
    this.boxes = []
    return (
      <div
        onMouseDown={this.touchDown}
        onMouseUp={() => {
          this.touchUp(false)
        }}
        onTouchMove={e => this.touchMove(e)}
        onTouchStart={this.touchStart}
        onTouchEnd={this.touchEnd}
        style={{
          touchAction: "none",
        }}
      >
        {Array.from(Array(this.props.grid_size)).map((_, i) => (
          <div className="row" key={"a" + i.toString()}>
            {Array.from(Array(this.props.grid_size)).map((_, j) => (
              <Box
                i={i}
                j={j}
                parent={this}
                ref={b => {
                  this.boxes.push(b)
                }}
                key={"box-" + i.toString() + "-" + j.toString()}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }
}

export default Grid
