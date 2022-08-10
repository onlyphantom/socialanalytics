import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import faker from "faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    title: {
      display: true,
      text: "Comments Sentiment by Platform",
    },
  },
  responsive: true,
  interaction: {
    mode: "index",
    intersect: false,
  },
  // scales: {
  //   x: {
  //     stacked: true,
  //   },
  //   y: {
  //     stacked: true,
  //   },
  // },
};

const SentimentBar = ({ data }) => {
  const labels = ["POSITIVE", "NEUTRAL", "NEGATIVE"];

  const sentimentData = {
    labels,
    datasets: [
      {
        label: "Facebook",
        data: data.facebook,
        backgroundColor: "rgb(255, 99, 132)",
        // stack: "Stack 0",
      },
      {
        label: "Instagram",
        data: data.instagram,
        backgroundColor: "rgb(75, 192, 192)",
        // stack: "Stack 0",
      },
      {
        label: "Twitter",
        data: data.twitter,
        backgroundColor: "rgb(53, 162, 235)",
        // stack: "Stack 1",
      },
      {
        label: "YouTube",
        data: data.youtube,
        backgroundColor: "rgb(23, 122, 74)",
        // stack: "Stack 1",
      },
    ],
  };


  return <Bar options={options} data={sentimentData} />;
};

export default SentimentBar;
