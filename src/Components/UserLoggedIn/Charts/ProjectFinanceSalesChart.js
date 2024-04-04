import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ProjectFinanceSalesChart = ({ chartData }) => {
  const { categories, series } = chartData;

  const options = {
    chart: {
      type: 'bar',
      stacked: 'true',
      height: 350,
      toolbar: {
        show: true
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      type: 'category',
      categories: categories,
      tickPlacement: 'on'
    },
    yaxis: {
      title: {
        text: 'Revenue'
      }
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy'
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0.5,
        opacityFrom: 0.7,
        opacityTo: 1,
        stops: [0, 100]
      }
    }
  };

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default ProjectFinanceSalesChart;