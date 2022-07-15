import React from "react";
import EngagementLine from "../components/EngagementLine";
import Layout from "../components/Layout";
import SentimentBar from "../components/SentimentBar";

const overview = () => {
  return (
    <Layout activePage="overview">
      <h3>Sentiment Analysis</h3>
      <section className="grid grid-cols-12 my-4">
        <div class="col-start-2 col-span-9">
          <SentimentBar />
        </div>
      </section>

      <h3>Total Engagement Rate</h3>
      <section className="grid grid-cols-12 my-4">
        <div class="col-start-2 col-span-9">
          <EngagementLine />
        </div>
      </section>
    </Layout>
  );
};

export default overview;
