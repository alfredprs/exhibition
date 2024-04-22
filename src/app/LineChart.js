import { useEffect, useState } from "react";
import { Chart} from "chart.js/auto";

const LineChart = ({ data, type }) => {
  const [chartUsed, setChartUsed] = useState(null);
  const [chartProd, setChartProd] = useState(null);
  const labels = JSON.parse(window.localStorage.getItem("rotatedDayList"));

  useEffect(() => {
    if (data && data.length > 0) {
        const options = { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' };

        const gasChart = document.getElementById(`gasChart-${type.split(" ")[1]}`);
        let chartStatus = Chart.getChart(`gasChart-${type.split(" ")[1]}`);
        var ctx = gasChart.getContext("2d");
        if (chartStatus != undefined) {
            chartStatus.destroy();
        }
        const oneWeekAgo = new Date(Date.now() - 6 * 864e5).toLocaleDateString('en-CA', options);

        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999)

        const accDefault = {};

        for (
            let date = new Date(oneWeekAgo);
            date <= endDate;
            date.setDate(date.getDate() + 1)
        ) {
            const isoDate = date.toLocaleDateString('en-CA', options);;
            accDefault[isoDate] = { gas: 0 };
        }
        
        const gasByDate = data.reduce((acc, cur) => {
            const date = new Date(cur.date_created).toISOString().split("T")[0];
            acc = accDefault;
            if (type === "Gas Dihasilkan") {
                if (acc[date]) {
                    acc[date].gas += Math.abs(cur.gas_prod);
                }
            } else {
                if (acc[date]) {
                    acc[date].gas += Math.abs(cur.gas_used);
                }
            }
            return acc;
        }, {});
      
        const gasValues = Object.values(gasByDate).map((entry) => entry.gas);
        
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
                                data: gasValues,
                                borderColor: "rgba(255, 130, 0, 1)",
                                backgroundColor: gradient(ctx, gasChart, "rgba(255, 130, 0, 0.6)", "rgba(255, 255, 255, 0)"),
                                tension: 0,
                                fill: {
                                    target: "origin",
                                    below: gradient(ctx, gasChart, "rgba(255, 130, 0, 0.6)", "rgba(255, 255, 255, 0)")
                                }
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
                                  text: "Hari",
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
                                },
                                border: {
                                    dash: [16,4]
                                }
                            }
                        }
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
                                data: gasValues,
                                borderColor: "rgba(0, 0, 255, 1)",
                                backgroundColor: gradient(ctx, gasChart, "rgba(0, 0, 255, 0.6)", "rgba(255, 255, 255, 0)"),
                                tension: 0,
                                fill: {
                                    target: "origin",
                                    below: gradient(ctx, gasChart, "rgba(0, 0, 255, 0.6)", "rgba(255, 255, 255, 0)")
                                }
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
                                  text: "Hari",
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
                                },
                                border: {
                                    dash: [16,4]
                                }
                            }
                        }
                    },
                    })
                );
            }
        }
    }
  }, [data, type]);

  if (type === "Gas Dihasilkan") {
    return (
        <>
            <canvas id={`gasChart-Dihasilkan`} width={200} height={400} />
        </>
    )
  } else {
    return (
        <>
            <canvas id={`gasChart-Terpakai`} width={200} height={400} />
        </>
    )
  }
};

export default LineChart;
