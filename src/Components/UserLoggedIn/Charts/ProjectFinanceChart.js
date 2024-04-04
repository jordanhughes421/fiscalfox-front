// ProjectFinanceChart.js
import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ProjectFinanceChart = ({ chartData }) => {
    
  const options = {
    chart: {
      type: 'bar',
      height: 350,
    },
    colors: ['#FF0000', '#000000', '#008000'], // Red, Black, Green
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: chartData.labels,
    },
    yaxis: {
      title: {
        text: '$'
      }
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
    }
  };

  return (
    <ReactApexChart options={options} series={chartData.series} type="bar" height={350} />
  );
};

export default ProjectFinanceChart;
