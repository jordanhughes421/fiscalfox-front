import React, { useState, useEffect, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Box, Typography, Button, Grid, Card, CardContent, Container } from '@mui/material';
import ProjectFinanceChart from '../Charts/ProjectFinanceChart';
import ProjectTable from '../Cards/ProjectTable';

const Dashboard = ({ projects, refreshProjects }) => {

    const prepareChartData = (projects) => {
        // Assuming projects is an array of projects with expenses, revenues, etc.
        let labels = projects.map(project => project.name);
        let expensesData = projects.map(project => -Math.abs(project.totalExpenses));
        let revenuesData = projects.map(project => project.totalRevenues);
        let profitsData = projects.map(project => project.profit);
    
        return {
        labels,
        series: [
            {
            name: "Expenses",
            data: expensesData,
            },
            {
            name: "Revenues",
            data: revenuesData,
            },
            {
            name: "Profits",
            data: profitsData,
            },
        ],
        };
    };

    const chartData = useMemo(() => prepareChartData(projects), [projects]);



    
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography>Project Financial Overview</Typography>
            <ProjectFinanceChart chartData={chartData} />
            <ProjectTable projects={projects} refreshProjects={refreshProjects}/>
        </Box>

    );
};

export default Dashboard;