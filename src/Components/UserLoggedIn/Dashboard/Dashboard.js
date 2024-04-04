import React, { useState, useEffect, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Box, Typography, Button, Grid, Card, CardContent, Container } from '@mui/material';
import ProjectFinanceChart from '../Charts/ProjectFinanceChart';
import ProjectTable from '../Cards/ProjectTable';
import ProjectFinancePieChart from '../Charts/ProjectFinancePieChart'; // Adjust path as necessary
import ProjectFinanceSalesChart from '../Charts/ProjectFinanceSalesChart';


const Dashboard = ({ projects, refreshProjects }) => {
    

    const prepareFinanceChartData = (projects) => {
        // Assuming projects is an array of projects with expenses, revenues, etc.
        // Calculate the total expenses, revenues, and profits across all projects
        let totalExpenses = projects.reduce((acc, project) => acc + project.totalExpenses, 0);
        let totalRevenues = projects.reduce((acc, project) => acc + project.totalRevenues, 0);
        let totalProfits = projects.reduce((acc, project) => acc + project.profit, 0);

        // Since we're summarizing for all projects, we use a single label
        let labels = ['All Projects Summary'];
        
        // Data arrays now each contain a single value representing the total
        let expensesData = [totalExpenses];
        let revenuesData = [totalRevenues];
        let profitsData = [totalProfits];
    
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

    const preparePieChartData = (projects) => {
        // Create an object to hold the sum of expenses by category
        let expensesByCategory = projects.flatMap(project => project.expenses)
        .reduce((acc, expense) => {
            // Check if the expense has a category, if not, assign it to 'Uncategorized'
            let category = expense.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + expense.amount;
            return acc;
        }, {});

        // Convert the expenses object to arrays for categories and their corresponding values
        let categories = Object.keys(expensesByCategory);
        let values = Object.values(expensesByCategory);
    
        return { categories, values };
    };

    const prepareSalesChartData = (projects) => {
        // Helper function to format date
        const formatDate = (date, byMonth = false) => {
            const d = new Date(date);
            return byMonth ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` : date;
        };

        // Step 1: Compile all unique dates and sort them
        let allDates = [];
        projects.forEach(project => {
            project.revenues.forEach(revenue => {
            allDates.push(new Date(revenue.date));
            });
        });
        allDates = [...new Set(allDates)]; // Remove duplicates
        allDates.sort((a, b) => a - b); // Sort dates

        // Determine categorization method based on the date range
        const daysDifference = (allDates[allDates.length - 1] - allDates[0]) / (1000 * 3600 * 24);
        const categorizeByMonth = daysDifference > 30;

        // Format categories based on the decision
        const categoriesSet = new Set(allDates.map(date => formatDate(date.toISOString().split('T')[0], categorizeByMonth)));
        const categories = Array.from(categoriesSet).sort();

        // Step 2: Prepare the series data, excluding projects with all zeroes
        const series = projects.map(project => {
            const data = categories.map(category => {
            // Sum revenues for each category
            const totalRevenue = project.revenues.reduce((acc, revenue) => {
                const revenueDateFormatted = formatDate(revenue.date, categorizeByMonth);
                if (revenueDateFormatted === category) {
                return acc + revenue.amount;
                }
                return acc;
            }, 0);
            return totalRevenue;
            });

            return {
            name: project.name,
            data,
            };
        }).filter(project => project.data.some(amount => amount > 0)); // Filter out projects with all data points as 0

        // Step 3: Prepare the chart data object
        const chartData = {
          categories,
          series,
        };
      
        return chartData;
      };
    

    const financeChartData = useMemo(() => prepareFinanceChartData(projects), [projects]);
    const pieChartData = useMemo(() => preparePieChartData(projects), [projects]);
    const salesChartData = useMemo(() => prepareSalesChartData(projects), [projects]);
    
    
    return (
        <Container maxWidth="xl"> {/* Adjust the maxWidth for full screen width */}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h4">Dashboard</Typography>
                </Grid>
                {/* Change from horizontal to vertical layout at the md breakpoint */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography>Project Financial Overview</Typography>
                            <ProjectFinanceChart chartData={financeChartData} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography>Expenses by Category</Typography>
                            <ProjectFinancePieChart chartData={pieChartData} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography>Sales Overview</Typography>
                            <ProjectFinanceSalesChart chartData={salesChartData} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <ProjectTable projects={projects} refreshProjects={refreshProjects} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;