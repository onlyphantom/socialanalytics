import React from "react";
import Layout from "../components/Layout";

const overview = () => {
  return (
    <Layout activePage="overview">
      <div className="grid grid-cols-3 gap-4">
        <h3>Sentiment Analysis</h3>
        <section className="grid grid-cols-3 gap-4"></section>
      </div>
    </Layout>
  );
};

export default overview;
