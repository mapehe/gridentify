import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Container from "react-bootstrap/Container"
import { Link } from "gatsby"

const PrivacyPage = () => (
  <Layout>
    <SEO title="Privacy" />
    <Container className="p-5">
      <h2>Privacy Policy</h2>
      <p className="mt-5">
        Some user data is collected on gridentio.com. This data includes the
        following:
      </p>
      <ul>
        <li>
          Your IP address, browser type, operating system type, hardware model
          (if available), language and region, screen dimensions, browser
          dimensions, etc.
        </li>
        <li>Which pages you access on the site.</li>
        <li>Session data, such as session duration.</li>
      </ul>
      <p>
        This anonymous data is provided by the server logs and Google Analytics
        (handled according to{" "}
        <a href="https://marketingplatform.google.com/about/analytics/terms/us/">
          Google Analytics Terms of Service
        </a>
        ). The data is used for providing a better service and is not shared
        with third parties other than Google.
      </p>
    </Container>
  </Layout>
)

export default PrivacyPage
