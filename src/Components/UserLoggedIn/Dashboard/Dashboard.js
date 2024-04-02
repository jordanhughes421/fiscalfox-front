import React, { useState, useEffect, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import ProjectFinanceChart from '../Charts/ProjectFinanceChart';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const baseUrl = 'https://www.fiscalfoxapi.com';
    useEffect(() => {
        fetchProjectsExpensesAndRevenues();
      }, []);
    const fetchProjectsExpensesAndRevenues = async () => {
        console.log("fetchProjectsExpensesAndRevenues")
        const token = localStorage.getItem('token');
        try {
            const [expensesResponse, projectsResponse, revenuesResponse] = await Promise.all([
            fetch(`${baseUrl}/expense`, {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                },
            }),
            fetch(`${baseUrl}/projects`, {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                },
            }),
            fetch(`${baseUrl}/revenue`, {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                },
            }),
            ]);

            if (expensesResponse.ok && projectsResponse.ok && revenuesResponse.ok) {
            const expensesData = await expensesResponse.json();
            const projectsData = await projectsResponse.json();
            const revenuesData = await revenuesResponse.json();

            const projectsWithExpensesAndRevenues = projectsData.map(project => {
                const projectExpenses = expensesData.filter(expense => project.expenses.includes(expense._id));
                const projectRevenues = revenuesData.filter(revenue => project._id === revenue.project);
                const totalExpenses = projectExpenses.reduce((acc, curr) => acc + curr.amount, 0);
                const totalRevenues = projectRevenues.reduce((acc, curr) => acc + curr.amount, 0);
                const profit = totalRevenues - totalExpenses;

                return {
                ...project,
                expenses: projectExpenses,
                revenues: projectRevenues,
                profit,
                totalExpenses,
                totalRevenues,
                };
            });

            setProjects(projectsWithExpensesAndRevenues);

            } else {
            throw new Error("Failed to fetch data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

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
        <div>
        <h1>Project Financial Overview</h1>
        <ProjectFinanceChart chartData={chartData} />
        </div>
    );
};

export default Dashboard;