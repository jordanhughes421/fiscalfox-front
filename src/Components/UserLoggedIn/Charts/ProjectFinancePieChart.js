import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ProjectFinancePieChart = ({ chartData }) => {
  // Assume chartData has the structure: { categories: ['Category 1', 'Category 2', ...], values: [value1, value2, ...] }

  const options = {
    chart: {
      type: 'donut',
    },
    labels: chartData.categories, // Using categories from chartData for pie chart labels
    //colors: ['#FF4560', '#00E396', '#008FFB', '#FEB019', '#775DD0'], // An array of colors for the slices
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    legend: {
      position: 'bottom',
      offsetY: 0,
      height: 0,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0.5,
        opacityFrom: 0.7,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val
        }
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '22px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              color: '#000000',
              offsetY: -5,
              formatter: function (val) {
                return val;
              }
            },
            value: {
              show: true,
              fontSize: '16px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              color: undefined,
              offsetY: 5,
              formatter: function (val) {
                return "$" + val;
              }
            },
            total: {
              show: true,
              showAlways: false,
              label: 'Total',
              formatter: function (w) {
                return "$" + w.globals.seriesTotals.reduce((a, b) => {
                  return a + b
                }, 0)
              }
            }
          }
        }
      }
    }
  };

  return (
    <ReactApexChart options={options} series={chartData.values} type="donut" height={400} />
  );
};

export default ProjectFinancePieChart;
