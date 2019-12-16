import React from "react"
import Box from "./box"
import Swal from "sweetalert2"

const zip = (xs, ys) => xs.map((k, i) => [k, ys[i]])

class Grid extends React.Component {
  /****************************************************************
    React stuff 
  ****************************************************************/
  constructor(props) {
    super(props)

    // Binding methods
    this.box_from_client_coordinates = this.box_from_client_coordinates.bind(
      this
    )
    this.mouse_move = this.mouse_move.bind(this)
    this.mouse_up = this.mouse_up.bind(this)
    this.mouse_down = this.mouse_down.bind(this)
    this.mouse_leave = this.mouse_leave.bind(this)
    this.touch_move = this.touch_move.bind(this)
    this.touch_start = this.touch_start.bind(this)
    this.touch_end = this.touch_end.bind(this)

    // Class variables
    this.is_mouse_down = false
    this.seed = Date.now()
    this.initial_seed = this.seed
    this.state = { selected: [], grid: this.init_grid(this.props.grid_size) }
    this.moves = []
  }
  componentDidMount() {
    this.grid.addEventListener(
      "touchmove",
      e => {
        e.preventDefault()
        this.touch_move(e)
      },
      { passive: false }
    )
  }
  render() {
    const box_color = value => {
      return (
        "rgb(" +
        (255 - Math.min(value * 80, 50)) +
        "," +
        (255 - Math.min(value * 20, 100)) +
        "," +
        255 +
        ")"
      )
    }
    return (
      <div
        onMouseDown={this.mouse_down}
        onTouchStart={this.touch_start}
        onTouchEnd={this.touch_end}
        onMouseUp={this.mouse_up}
        onMouseMove={this.mouse_move}
        onTouchMove={this.box_from_event}
        onMouseLeave={this.mouse_leave}
        ref={g => {
          this.grid = g
        }}
      >
        {Array.from(Array(this.props.grid_size)).map((_, i) => (
          <div className="row" key={"row-" + i.toString()}>
            {Array.from(Array(this.props.grid_size)).map((_, j) => (
              <Box
                i={i}
                j={j}
                key={"box-" + i.toString() + "-" + j.toString()}
                selected={this.is_selected(i, j)}
                grid={this}
                value={this.state.grid[i][j]}
                color={box_color(this.state.grid[i][j])}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }

  /****************************************************************
    Selection 
  ****************************************************************/
  select(i, j, timestamp = new Date()) {
    const index = this.state.selected
      .map(x => {
        return { i: x.i, j: x.j }
      })
      .map(JSON.stringify)
      .indexOf(JSON.stringify({ i: i, j: j }))
    if (index < 0) {
      if (this.state.selected.length == 0) {
        return new Promise(resolve => {
          this.setState(
            {
              selected: this.state.selected
                .concat({
                  i: i,
                  j: j,
                  timestamp: timestamp,
                })
                .sort((a, b) => (a["timestamp"] < b["timestamp"] ? -1 : 1)),
              grid: this.state.grid,
            },
            resolve
          )
        })
      } else {
        const last = this.state.selected.slice(-1).flatMap(x => [x.i, x.j])
        if (this.manhattan_distance(last, [i, j]) > 1) {
          return this.clear_selection()
        } else {
          return new Promise(resolve => {
            this.setState(
              {
                selected: this.state.selected
                  .concat({
                    i: i,
                    j: j,
                    timestamp: timestamp,
                    grid: this.state.grid,
                  })
                  .sort((a, b) => (a["timestamp"] < b["timestamp"] ? -1 : 1)),
              },
              resolve
            )
          })
        }
      }
    } else if (index == this.state.selected.length - 1) {
      return Promise.resolve(1)
    } else {
      return new Promise(resolve => {
        this.setState(
          {
            selected: this.state.selected.slice(0, index),
            grid: this.state.grid,
          },
          resolve
        )
      })
    }
  }
  clear_selection() {
    return new Promise(resolve => {
      this.setState(
        {
          selected: [],
          grid: this.state.grid,
        },
        resolve
      )
    })
  }
  is_selected(i, j) {
    return (
      this.state.selected
        .map(x => {
          return { i: x.i, j: x.j }
        })
        .map(JSON.stringify)
        .indexOf(JSON.stringify({ i: i, j: j })) >= 0
    )
  }
  eval_selection() {
    if (
      new Set(this.state.selected.map(p => this.state.grid[p.i][p.j])).size ==
        1 &&
      this.state.selected.length > 1
    ) {
      var grid = JSON.parse(JSON.stringify(this.state.grid))
      const sum = this.state.selected
        .map(p => this.state.grid[p.i][p.j])
        .reduce((a, b) => a + b, 0)
      zip(
        this.state.selected,
        this.random_array(this.state.selected.length - 1).concat(sum)
      ).forEach(z => {
        const ij = z[0]
        const val = z[1]
        grid[ij.i][ij.j] = val
      })
      this.moves.push(this.state.selected.map(p => [p.i, p.j]))
      return this.props.parent
        .increase_score(sum)
        .then(() => {
          return this.update_grid(grid)
        })
        .then(() => {
          let activeEnv =
            process.env.GATSBY_ACTIVE_ENV ||
            process.env.NODE_ENV ||
            "development"

          if (activeEnv == "development") {
            this.props.parent.send_score({
              moves: this.moves,
              seed: this.initial_seed,
              grid_size: this.props.grid_size,
            })
          }
          if (this.is_game_over()) {
            Swal.fire({
              title: "Game Over",
              text: `You scored ${this.props.parent.score.state.value}`,
              showConfirmButton: false,
            }).then(() => {
              this.props.parent.send_score({
                moves: this.moves,
                seed: this.initial_seed,
                grid_size: this.props.grid_size,
              })
              this.props.parent.score.reset()

              this.seed = Date.now()
              this.initial_seed = this.seed
              this.moves.length = 0
              this.update_grid(this.init_grid(this.props.grid_size))
            })
          }
        })
    } else {
      return Promise.resolve(1)
    }
  }

  /****************************************************************
     Grid state
  ****************************************************************/
  init_grid(n) {
    var state = [...Array(n)].map(x => [...Array(n)])
    for (var i = 0; i < n; i++) {
      for (var j = 0; j < n; j++) {
        state[i][j] = this.next_pseudorandom()
      }
    }
    return state
  }
  update_grid(grid) {
    return new Promise(resolve => {
      this.setState(
        {
          selected: this.state.selected,
          grid: grid,
        },
        resolve
      )
    })
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
  is_game_over() {
    const n = this.props.grid_size
    const grid = this.state.grid
    const range = Array.from(Array(n)).map((_, i) => i)
    const ds = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]

    var test_vector = []
    for (const i of range) {
      for (const j of range) {
        for (const d of ds) {
          const dx = d[0]
          const dy = d[1]
          // If not in grid, don't do anything
          if (i + dx < 0 || i + dx >= n || j + dy < 0 || j + dy >= n) {
            continue
          } else {
            test_vector.push(grid[i][j] === grid[i + dx][j + dy])
          }
        }
      }
    }
    return !test_vector.reduce((a, b) => a || b, false)
  }

  /****************************************************************
    Utils 
  ****************************************************************/
  box_from_client_coordinates(x, y) {
    const id = document.elementFromPoint(x, y).id
    const matches = id.match(/ge-[0-9]+-[0-9]+|gec-[0-9]+-[0-9]+/g)
    return matches !== null
      ? matches[0]
          .split("-")
          .slice(1)
          .map(x => Number(x))
      : matches
  }
  manhattan_distance(xs, ys) {
    return zip(xs, ys)
      .map(p => Math.abs(p[1] - p[0]))
      .reduce((a, b) => a + b, 0)
  }

  /****************************************************************
    Mouse event handlers
  ****************************************************************/
  mouse_up(e) {
    this.eval_selection().then(() => {
      this.is_mouse_down = false
      this.clear_selection()
    })
  }
  mouse_down(e) {
    this.is_mouse_down = true
    const ij = this.box_from_client_coordinates(e.clientX, e.clientY)
    if (ij !== null) {
      this.select(ij[0], ij[1])
    }
  }
  mouse_move(e) {
    if (this.is_mouse_down) {
      const ij = this.box_from_client_coordinates(e.clientX, e.clientY)
      if (ij !== null) {
        this.select(ij[0], ij[1])
      }
    }
  }
  mouse_leave(e) {
    this.clear_selection()
    this.is_mouse_down = false
  }

  /****************************************************************
    Touch event handlers
  ****************************************************************/
  touch_start(e) {
    const ij = this.box_from_client_coordinates(
      e.touches[0].clientX,
      e.touches[0].clientY
    )
    if (ij !== null) {
      this.select(ij[0], ij[1])
    }
  }
  touch_move(e) {
    const ij = this.box_from_client_coordinates(
      e.touches[0].clientX,
      e.touches[0].clientY
    )
    if (ij !== null) {
      this.select(ij[0], ij[1])
    } else {
      this.clear_selection()
    }
  }
  touch_end(e) {
    this.eval_selection().then(() => {
      this.clear_selection()
    })
  }
}

export default Grid
