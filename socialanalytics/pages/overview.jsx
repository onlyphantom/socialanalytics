import React, { useState } from "react";
import EngagementLine from "../components/EngagementLine";
import Layout from "../components/Layout";
import SentimentBar from "../components/SentimentBar";

import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import id from "date-fns/locale/id";
registerLocale("id", id);

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

  const [startDate, setStartDate] = useState(new Date("2022/01/01"));
  const [endDate, setEndDate] = useState(new Date("2022/01/14"));

  return (
    <Layout activePage="overview">
      <section className="grid grid-cols-12">
        <div className="col-start-8 col-span-4 flex gap-x-2 max-w-xs">
          {/* https://github.com/Hacker0x01/react-datepicker */}
          <DatePicker
            dateFormat="dd/MM/yyyy"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            locale="id"
            showMonthDropdown
            className="col-span-1 max-w-xxs"
          />
          <DatePicker
            dateFormat="dd/MM/yyyy"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            locale="id"
            showMonthDropdown
            className="col-span-1 max-w-xxs"
          />
        </div>
      </section>

      <h3>Sentiment Analysis</h3>
      <section className="grid grid-cols-12 my-4">
        <div className="col-start-2 col-span-9">
          <SentimentBar />
        </div>
      </section>

      <h3>Total Engagement Rate</h3>
      <section className="grid grid-cols-12 my-4">
        <div className="col-start-2 col-span-9">
          <EngagementLine data={data} />
        </div>
      </section>
    </Layout>
  );
};

export default overview;
