import React from "react";
import EngagementLine from "../components/EngagementLine";
import Layout from "../components/Layout";
import SentimentBar from "../components/SentimentBar";

import faker from "faker";

const labels = ["January", "February", "March", "April", "May", "June", "July"];
const data = {
  labels,
  datasets: [
    {
      label: "Facebook",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Instagram",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.5)",
    },
    {
      label: "Twitter",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
    {
      label: "YouTube",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(23, 122, 74)",
      backgroundColor: "rgba(23, 122, 74, 0.5)",
    },
  ],
};

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
          <EngagementLine data={data} />
        </div>
      </section>
    </Layout>
  );
};

export default overview;
