import { useState } from "react";
import Layout from "../components/Layout";

import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { format } from "date-fns";

import id from "date-fns/locale/id";
registerLocale("id", id);

import "react-datepicker/dist/react-datepicker.css";
import DonutPercent from "../components/DonutPercent";
import EngagementLine from "../components/EngagementLine";

import faker from "faker";
import Table from "../components/Table";

const labels = ["January", "February", "March", "April", "May", "June", "July"];
const data = {
  labels,
  datasets: [
    {
      label: "Total",
      data: labels.map(() => faker.datatype.number({ min: 500, max: 2000 })),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Favorites",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.5)",
    },
    {
      label: "Comments",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
    {
      label: "Shares",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(23, 122, 74)",
      backgroundColor: "rgba(23, 122, 74, 0.5)",
    },
  ],
};

const facebook = () => {
  const [startDate, setStartDate] = useState(new Date("2022/01/01"));
  const [endDate, setEndDate] = useState(new Date("2022/01/14"));

  return (
    <Layout activePage="facebook">
      {/* <h1>Facebook</h1> */}
      <section className="grid grid-cols-12 my-5">
        <div className="stats shadow col-start-1 col-span-11">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Followers</div>
            <div className="stat-value">31K</div>
            <div className="stat-desc">Jan 1st - Feb 1st</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Following</div>
            <div className="stat-value">4,200</div>
            <div className="stat-desc">↗︎ 400 (22%)</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Likes</div>
            <div className="stat-value">1,200</div>
            <div className="stat-desc">↘︎ 90 (14%)</div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-12 my-5">
        <div className="col-span-4">
          <h5>Comments' Sentiment Analysis</h5>
        </div>
        <div className="col-start-7 col-span-5 flex gap-x-2 max-w-xs">
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

      <section className="grid grid-cols-12 my-5">
        <div className="col-span-4">
          <DonutPercent />
        </div>
        <div className="col-start-7 col-span-5">
          <div class="stats stats-vertical shadow">
            <div class="stat">
              <div class="stat-title">Positive Reactions</div>
              <div class="stat-value">11,614</div>
              <div class="stat-desc">
                {format(startDate, "MMMM do, yyyy")} -
                {format(endDate, "MMMM do, yyyy")}
              </div>
            </div>

            <div class="stat">
              <div class="stat-title">Positive Comments</div>
              <div class="stat-value">1,106</div>
              <div class="stat-desc">
                {format(startDate, "MMMM do, yyyy")} -
                {format(endDate, "MMMM do, yyyy")}
              </div>
            </div>

            {/* <div class="stat">
              <div class="stat-title">New Registers</div>
              <div class="stat-value">1,200</div>
              <div class="stat-desc">↘︎ 90 (14%)</div>
            </div> */}
          </div>
        </div>
      </section>
      <section className="grid grid-cols-12 my-5">
        <div className="col-span-6">
          <h5>Engagement Rate Analysis</h5>
          <EngagementLine data={data} />
        </div>
        <div className="col-span-6 ml-5">
          <h5>Significant Variables</h5>
          <div class="tabs">
            <a class="tab tab-bordered">Positive</a>
            <a class="tab tab-bordered tab-active">Negative</a>
          </div>
          <div class="tab-content">
            <Table />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default facebook;
