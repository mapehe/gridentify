import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"

const GRID_SIZE = 5

const build_grid = n =>
  Array.from(Array(n)).map((_, i) => (
    <div className="row">
      {Array.from(Array(n)).map((_, j) => (
        <>
          <div id={`ge-${i}-${j}`} className="box">
            <div class="inner">0</div>
          </div>
        </>
      ))}
    </div>
  ))

const IndexPage = () => (
  <Layout>
    <div className="grid">{build_grid(GRID_SIZE)}</div>
  </Layout>
)

export default IndexPage
