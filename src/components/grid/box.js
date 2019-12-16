import React from "react"
import { isMobile } from "react-device-detect"

const box_class = selected => {
  return "box " + (selected ? "selected " : "not-selected")
}

class Box extends React.Component {
  constructor(props) {
    super(props)
  }
  background_color() {
    return (
      "rgb(" +
      (255 - Math.min(this.props.value * 80, 50)) +
      "," +
      (255 - Math.min(this.props.value * 20, 100)) +
      "," +
      255 +
      ")"
    )
  }
  render() {
    return (
      <>
        <div
          id={`ge-${this.props.i}-${this.props.j}`}
          className={box_class(this.props.selected)}
          style={{ backgroundColor: this.background_color() }}
          ref={b => {
            this.ref = b
          }}
        >
          <div id={`gec-${this.props.i}-${this.props.j}`} className="inner">
            {this.props.value}
          </div>
        </div>
      </>
    )
  }
}

export default Box
