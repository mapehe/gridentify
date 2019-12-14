import React from "react"
import { isMobile } from "react-device-detect"

const box_class = (hovered, last) => {
  return "box " + (hovered ? "selected " : "") + (last ? "last " : "")
}

class Box extends React.Component {
  ref = null
  componentDidMount() {
    this.set_color(this.ref)
  }
  set_color(ref) {
    ref.style.backgroundColor =
      "rgb(" +
      (255 - Math.min(this.state.value * 80, 50)) +
      "," +
      (255 - Math.min(this.state.value * 20, 100)) +
      "," +
      255 +
      ")"
  }
  constructor(props) {
    super(props)
    this.state = { hovered: false, last: false, value: this.random_value() }
  }

  init_value = () => {
    return new Promise(resolve => {
      this.setState(
        {
          hovered: this.state.hovered,
          last: this.state.last,
          value: this.random_value(),
        },
        resolve
      )
    }).then(() => {
      this.set_color(this.ref)
    })
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
      this.props.parent.record_selection(this)
      if (this.state.hovered) {
        this.props.parent.clear_selection()
      }
      this.setState({ hovered: true, last: true, value: this.state.value })
    }
  }

  mobile_enter = () => {
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
        this.props.parent.clear_last()
        this.props.parent.clear_selection()
        return
      }
    }
    if (this.props.parent.selection_on()) {
      if (this.state.hovered) {
        this.props.parent.clear_selection()
      }
      this.props.parent.record_selection(this)
      this.setState({ hovered: true, last: true, value: this.state.value })
    }
  }

  leave = () => {
    this.setState(
      {
        hovered: this.state.hovered,
        last: false,
        value: this.state.value,
      },
      () => {
        this.props.parent.check_leave()
      }
    )
  }
  is_this_element(id) {
    const ij = id
      .split("-")
      .slice(1)
      .map(x => Number(x))
    return this.props.i === ij[0] && this.props.j === ij[1]
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
    this.setState(
      {
        hovered: this.state.hovered,
        last: false,
        value: this.state.value,
      },
      () => {
        this.render()
      }
    )
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
      this.props.parent.record_selection(this)
      this.setState({ hovered: true, last: true, value: this.state.value })
    }
  }
  is_last() {
    return this.state.last
  }
  update_value(sum, ids, vals) {
    if (this.state.hovered) {
      const ind = ids
        .map(e => e[0] === this.props.i && e[1] === this.props.j)
        .indexOf(true)
      const val = vals[ind]
      return new Promise(resolve => {
        this.setState(
          {
            hovered: false,
            last: this.state.last,
            value: val,
          },
          resolve
        )
      }).then(this.set_color(this.ref))
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
          ref={b => {
            this.ref = b
          }}
          onMouseEnter={() => {
            if (!isMobile) {
              this.enter()
            } else {
            }
          }}
          onClick={() => {
            if (!isMobile) {
              this.enter()
            } else {
            }
          }}
          onMouseLeave={this.leave}
          className={box_class(this.state.hovered, this.state.last)}
        >
          <div id={`gec-${this.props.i}-${this.props.j}`} className="inner">
            {this.state.value}
          </div>
        </div>
      </>
    )
  }
}

export default Box
