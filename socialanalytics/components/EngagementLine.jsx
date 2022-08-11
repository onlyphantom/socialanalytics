import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import 'chartjs-adapter-moment';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
  scales: {
    xAxis: {
      type: 'time',
    }
  }
};

const EngagementLine = ({ data, media }) => {
  const labels = data.label;
  if(media === "facebook"){
    const final_line = {
      labels,
      datasets: [
        {
          label: "Total",
          data: data.total,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "Favorites",
          data: data.favorite,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
        {
          label: "Comments",
          data: data.comment,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
        {
          label: "Shares",
          data: data.share,
          borderColor: "rgb(23, 122, 74)",
          backgroundColor: "rgba(23, 122, 74, 0.5)",
        },
      ]
    };
    return <Line options={options} data={final_line} />;
  } else if (media === "instagram") {
    const final_line = {
      labels,
      datasets: [
        {
          label: "Total",
          data: data.total,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "Likes",
          data: data.like,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
        {
          label: "Comments",
          data: data.comment,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        }
      ]
    };
    return <Line options={options} data={final_line} />;
  } else if(media === "twitter"){
    const final_line = {
      labels,
      datasets: [
        {
          label: "Total",
          data: data.total,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "Favorites",
          data: data.favorite,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
        {
          label: "Comments",
          data: data.comment,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
        {
          label: "Retweets",
          data: data.retweet,
          borderColor: "rgb(23, 122, 74)",
          backgroundColor: "rgba(23, 122, 74, 0.5)",
        },
      ]
    };
    return <Line options={options} data={final_line} />;
  } else if(media === "youtube"){
    const final_line = {
      labels,
      datasets: [
        {
          label: "Total",
          data: data.total,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "Likes",
          data: data.like,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
        {
          label: "Comments",
          data: data.comment,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
        {
          label: "Views",
          data: data.view,
          borderColor: "rgb(23, 122, 74)",
          backgroundColor: "rgba(23, 122, 74, 0.5)",
        },
      ]
    };
    return <Line options={options} data={final_line} />;
  } else {
    const final_line = {
      labels,
      datasets: [
        {
          label: "Facebook",
          data: data.facebook,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "Instagram",
          data: data.instagram,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
        {
          label: "Twitter",
          data: data.twitter,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
        {
          label: "Youtube",
          data: data.youtube,
          borderColor: "rgb(23, 122, 74)",
          backgroundColor: "rgba(23, 122, 74, 0.5)",
        },
      ]
    };
    return <Line options={options} data={final_line} />;
  }
};

export default EngagementLine;
