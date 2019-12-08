import React from "react"
import Layout from "../components/layout"
import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"
import Grid from "../components/grid/grid"

const GRID_SIZE = 5

const IndexPage = () => (
  <Layout>
    <div className="grid">
      <Grid grid_size={GRID_SIZE} />
    </div>
  </Layout>
)

export default IndexPage
