import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Card, CardContent, Container } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import Dashboard from './Dashboard/Dashboard';
import ProjectFetcher from '../fetchers/projectFetcher';
import DialogManager from './DialogManager/DialogManager';

function UserLoggedInHomePage() {
    const [openDialog, setOpenDialog] = useState('');
    const handleOpenDialog = (dialogName) => setOpenDialog(dialogName);
    const handleCloseDialog = () => setOpenDialog('');
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

    const refreshProjects = () => {
        fetchProjectsExpensesAndRevenues();
      };
    
    
    return (
        <Box sx={{ flexGrow: 1 }}>
            <DialogManager projects={projects} openDialog={openDialog} handleCloseDialogs={handleCloseDialog} handleOpenDialogs={handleOpenDialog} refreshProjects={refreshProjects}/>
            <Dashboard projects={projects} refreshProjects={refreshProjects}/>
        </Box>
    );
}

export default UserLoggedInHomePage;
