import React from "react"

class Intro extends React.Component {
  render() {
    return (
      <div>
        <h1 id="main_title">GRIDENTIO</h1>
        <p className="lead mt-4 mb-5">
          Connect equal numbers in the grid below. The last number you select
          will be replaced by the sum of the connected numbers. The others will
          replaced by either 1, 2 or 3 at random.
        </p>
      </div>
    )
  }
}

export default Intro
