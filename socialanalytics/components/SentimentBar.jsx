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
  }
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
      },
      {
        label: "Instagram",
        data: data.instagram,
        backgroundColor: "rgb(75, 192, 192)",
      },
      {
        label: "Twitter",
        data: data.twitter,
        backgroundColor: "rgb(53, 162, 235)",
      },
      {
        label: "YouTube",
        data: data.youtube,
        backgroundColor: "rgb(23, 122, 74)",
      },
    ],
  };

  return <Bar options={options} data={sentimentData} />;
};

export default SentimentBar;
