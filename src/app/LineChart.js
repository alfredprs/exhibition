import { useEffect, useState } from "react";
import { Chart } from "chart.js/auto";

const LineChart = ({ data, type }) => {
  const [chartUsed, setChartUsed] = useState(null);
  const [chartProd, setChartProd] = useState(null);

  useEffect(() => {
    const gasChart = document.getElementById(`gasChart-${type.split(" ")[1]}`);
    let chartStatus = Chart.getChart(`gasChart-${type.split(" ")[1]}`);
    var ctx = gasChart.getContext("2d");
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }

    const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const gasByHour = Array.from({ length: 24 }, () => 0);

    if (data && data.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      data.forEach((entry) => {
        const entryDate = new Date(entry.date_created);
        entryDate.setHours(entryDate.getHours() - 7);

        const comparisonDate = new Date(entryDate);
        comparisonDate.setHours(0, 0, 0, 0);

        if (comparisonDate.getTime() === today.getTime()) {
          const hour = entryDate.getHours();
          if (type === "Gas Dihasilkan") {
            gasByHour[hour] += Math.abs(entry.gas_prod);
          } else {
            gasByHour[hour] += Math.abs(entry.gas_used);
          }
        }
      });
    }

    const gradient = (ctx, chart, colorStart, colorEnd) => {
      const gradientFill = ctx.createLinearGradient(0, chart.height, 0, 0);
      gradientFill.addColorStop(1, colorStart);
      gradientFill.addColorStop(0, colorEnd);
      return gradientFill;
    };

    if (gasChart) {
      if (type === "Gas Dihasilkan") {
        setChartProd(
          new Chart(gasChart, {
            type: "line",
            data: {
              labels: labels,
              datasets: [
                {
                  label: type,
                  data: gasByHour,
                  borderColor: "rgba(255, 130, 0, 1)",
                  backgroundColor: gradient(ctx, gasChart, "rgba(255, 130, 0, 0.6)", "rgba(255, 255, 255, 0)"),
                  tension: 0,
                  fill: {
                    target: "origin",
                    below: gradient(ctx, gasChart, "rgba(255, 130, 0, 0.6)", "rgba(255, 255, 255, 0)"),
                  },
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: "Jam",
                  },
                  grid: {
                    color: "rgba(0, 0, 0, 0.3)",
                  },
                  ticks: {
                    color: "rgba(255, 130, 0, 0.7)",
                  },
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Jumlah Gas Dihasilkan",
                  },
                  grid: {
                    color: "rgba(0, 0, 0, 0.3)",
                  },
                  ticks: {
                    color: "rgba(255, 130, 0, 0.7)",
                    stepSize: 100,
                  },
                  border: {
                    dash: [16, 4],
                  },
                },
              },
            },
          })
        );
      } else {
        setChartUsed(
          new Chart(gasChart, {
            type: "line",
            data: {
              labels: labels,
              datasets: [
                {
                  label: type,
                  data: gasByHour,
                  borderColor: "rgba(0, 0, 255, 1)",
                  backgroundColor: gradient(ctx, gasChart, "rgba(0, 0, 255, 0.6)", "rgba(255, 255, 255, 0)"),
                  tension: 0,
                  fill: {
                    target: "origin",
                    below: gradient(ctx, gasChart, "rgba(0, 0, 255, 0.6)", "rgba(255, 255, 255, 0)"),
                  },
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: "Jam",
                  },
                  grid: {
                    color: "rgba(0, 0, 0, 0.3)",
                  },
                  ticks: {
                    color: "rgba(0, 0, 255, 0.7)",
                  },
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Jumlah Gas Terpakai",
                  },
                  grid: {
                    color: "rgba(0, 0, 0, 0.3)",
                  },
                  ticks: {
                    color: "rgba(0, 0, 255, 0.7)",
                    stepSize: 50,
                  },
                  border: {
                    dash: [16, 4],
                  },
                },
              },
            },
          })
        );
      }
    }
  }, [data, type]);

  if (type === "Gas Dihasilkan") {
    return (
      <>
        <canvas id={`gasChart-Dihasilkan`} width={200} height={400} />
      </>
    );
  } else {
    return (
      <>
        <canvas id={`gasChart-Terpakai`} width={200} height={400} />
      </>
    );
  }
};

export default LineChart;
