import React from "react"
import { isMobile } from "react-device-detect"

const box_class = selected => {
  return "box " + (selected ? "selected " : "not-selected")
}

class Box extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    if (this.ref !== undefined) {
      this.ref.style = `background-color: ${this.props.color}`
    }
    return (
      <>
        <div
          id={`ge-${this.props.i}-${this.props.j}`}
          className={box_class(this.props.selected)}
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
