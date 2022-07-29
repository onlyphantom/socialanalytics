import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Engagement Rate Across Platforms",
    },
  },
};

const labels = ["Positive", "Neutral", "Negative"];

const DonutPercent = ({data}) => {

  const sentiment_count = data.sentiment_count;

  return <Doughnut data= {{
    labels,
    datasets: [
      {
        label: "Comment Sentiment",
        data: [sentiment_count.POSITIVE, sentiment_count.NEUTRAL, sentiment_count.NEGATIVE],
        backgroundColor: [
          "rgba(125, 255, 125, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 99, 132, 0.2)",
        ],
        borderColor: [
          "rgba(125, 255, 125, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }} />;
};

export default DonutPercent;
