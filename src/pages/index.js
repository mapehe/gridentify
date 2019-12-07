import React, { useState } from "react"
import Layout from "../components/layout"
import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"

const GRID_SIZE = 5

const Row = (_, j, i) => {
  const [hovered, setHovered] = useState(false)
  const toggleHover = () => setHovered(!hovered)
  return (
    <>
      <div
        id={`ge-${i}-${j}`}
        onMouseEnter={toggleHover}
        onMouseLeave={toggleHover}
        className={"box " + (hovered ? "selected" : "")}
      >
        <div class="inner">0</div>
      </div>
    </>
  )
}

const build_grid = n =>
  Array.from(Array(n)).map((_, i) => (
    <div className="row">
      {Array.from(Array(n)).map((_, j) => Row(_, j, i))}
    </div>
  ))

const IndexPage = () => (
  <Layout>
    <div className="grid">{build_grid(GRID_SIZE)}</div>
  </Layout>
)

export default IndexPage
