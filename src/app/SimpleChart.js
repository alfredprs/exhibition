import { useEffect, useState } from "react";
import { Chart} from "chart.js/auto";

const SimpleChart = ({ data, type }) => {
    const labels = JSON.parse(window.localStorage.getItem("rotatedDayList"));

    useEffect(() => {
        var dataUsed = [];

        if (type === 'Pondok Rangon') {
            dataUsed = data['Pondok Rangon'];
        } else if (type === 'Taman Jatisari') {
            dataUsed = data['Jatisari'];
        } else {
            dataUsed = data['KLHK'];
        }

        if (dataUsed && dataUsed.length > 0) {
            const options = { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' };
            
            var typename = ''
            if (type === 'Pondok Rangon') {
                typename = 'Rangon';
            } else if (type === 'Taman Jatisari') {
                typename = 'Jatisari';
            } else {
                typename = 'KLHK';
            }

            const weightChart = document.getElementById(`weightChart-${typename}`);
            let chartStatus = Chart.getChart(`weightChart-${typename}`);

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
                accDefault[isoDate] = { weight: 0 };
            }
            
            const weightByDate = dataUsed.reduce((acc, cur) => {
                const date = new Date(cur.date_created).toISOString().split("T")[0];
                acc = accDefault;

                if (acc[date]) {
                    acc[date].weight += Math.abs(cur.weight);
                }
                
                return acc;
            }, {});
            
            const weightValues = Object.values(weightByDate).map((entry) => entry.weight);
      
            if (weightChart) {
                if (type === "Pondok Rangon") {
                    new Chart(weightChart, {
                        type: "line",
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: type,
                                    data: weightValues,
                                    borderColor: "rgba(255, 130, 0, 1)",
                                    backgroundColor: "rgba(255, 130, 0, 0)",
                                    tension: 0,
                                },
                            ],
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                                x: {
                                    display: false
                                },
                                y: {
                                    display: false,
                                    beginAtZero: true,
                                }
                            },
                            layout: {
                                padding: {
                                    top: 0,
                                    right: 0,
                                    bottom: 0,
                                    left: 0
                                }
                            }
                        },
                    })
                } else if (type === 'Taman Jatisari') {
                    new Chart(weightChart, {
                        type: "line",
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: type,
                                    data: weightValues,
                                    borderColor: "rgba(0, 0, 255, 1)",
                                    backgroundColor: "rgba(255, 130, 0, 0)",
                                    tension: 0,
                                },
                            ],
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                                x: {
                                    display: false
                                },
                                y: {
                                    display: false,
                                    beginAtZero: true,
                                }
                            },
                            layout: {
                                padding: {
                                    top: 0,
                                    right: 0,
                                    bottom: 0,
                                    left: 0
                                }
                            }
                        },
                    })
                } else {
                    new Chart(weightChart, {
                        type: "line",
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: type,
                                    data: weightValues,
                                    borderColor: "rgba(255, 130, 0, 1)",
                                    backgroundColor: "rgba(255, 130, 0, 0)",
                                    tension: 0,
                                },
                            ],
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                                x: {
                                    display: false
                                },
                                y: {
                                    display: false,
                                    beginAtZero: true,
                                }
                            },
                            layout: {
                                padding: {
                                    top: 0,
                                    right: 0,
                                    bottom: 0,
                                    left: 0
                                }
                            }
                        },
                    })
                }
            }
        }
    }, [data, type]);

    if (type === "Pondok Rangon") {
        return (
            <>
                <canvas id={`weightChart-Rangon`} width={50} height={50} />
            </>
        )
    } else if (type === "Taman Jatisari") {
        return (
            <>
                <canvas id={`weightChart-Jatisari`} width={50} height={50} />
            </>
        )
    } else {
        return (
            <>
                <canvas id={`weightChart-KLHK`} width={50} height={50} />
            </>
        )
    }
};

export default SimpleChart;