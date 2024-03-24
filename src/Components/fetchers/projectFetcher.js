import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Container, 
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DataEditor from '../DataEditor/DataEditor';
import DataDeleter from '../DataDeleter/DataDeleter';

const baseUrl = 'https://projectfinancetracker-backend-2f2604a2f7f0.herokuapp.com';

const ProjectFetcher = () => {
  const [projects, setProjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentDetails, setCurrentDetails] = useState({ expenses: [], revenues: [] });
  const [selectedProject, setSelectedProject] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);const [selectedItemForDeletion, setSelectedItemForDeletion] = useState({ id: null, type: 'projects' });
  const [breakdownModalOpen, setBreakdownModalOpen] = useState(false);
  const [selectedProjectBreakdown, setSelectedProjectBreakdown] = useState(null);

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

        if (selectedProject){
          // Find the updated project data from the projectsWithExpensesAndRevenues array
          const updatedSelectedProject = projectsWithExpensesAndRevenues.find(project => project._id === selectedProject._id);
          if (updatedSelectedProject) {
            // Update currentDetails and selectedProjectBreakdown with the new data
            setCurrentDetails({ expenses: updatedSelectedProject.expenses, revenues: updatedSelectedProject.revenues });
            setSelectedProjectBreakdown(updatedSelectedProject);
          }
        };

      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setCurrentDetails({ expenses: project.expenses, revenues: project.revenues });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleEditOpen = (project) => {
    setSelectedProject(project);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
  };

  const handleDeleteOpen = (item, type = 'projects') => {
    setSelectedItemForDeletion({ id: item._id, type });
    setDeleteModalOpen(true);
  };

  const handleDeleteClose = () => {
    if (modalOpen) {
      
    }
    setDeleteModalOpen(false);
  };

  const handleBreakdownOpen = (project) => {
    setSelectedProject(project);
    setSelectedProjectBreakdown(project); // Assume the project object contains all necessary data
    setBreakdownModalOpen(true);
  };

  const handleBreakdownClose = () => {
    setBreakdownModalOpen(false);
  };

  const refreshProjects = () => {
    fetchProjectsExpensesAndRevenues();
  };

  return (
    <>
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
        <TableContainer component={Paper} sx={{ maxWidth: '80%', margin: 'auto', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }} aria-label="projects table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Project Name</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Expense</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Revenue</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Profit</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">{project.name}</TableCell>
                  <TableCell align="right">
                    ${project.totalExpenses.toFixed(2)}
                    <Button variant="outlined" sx={{ ml: 2 }} onClick={() => handleOpenModal(project)}>
                      View All
                    </Button>
                  </TableCell>
                  <TableCell align="right">${project.totalRevenues.toFixed(2)}</TableCell>
                  <TableCell align="right">${project.profit.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <Button onClick={() => handleEditOpen(project)}>
                      <EditIcon />
                    </Button>
                    <Button onClick={() => handleDeleteOpen(project)}>
                      <DeleteIcon />
                    </Button>
                    <Button onClick={() => handleBreakdownOpen(project)}>
                      View Breakdown
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
        <DialogTitle>Project Details</DialogTitle>
        <DialogContent>
          {/* Expenses Table */}
          <Typography variant="h6" gutterBottom>Expenses</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentDetails.expenses.map((expense) => (
                  <TableRow key={expense._id}>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell align="right">${expense.amount.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <Button onClick={() => handleDeleteOpen(expense, 'expense')}>
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <Button onClick={handleCloseModal} color="primary" style={{ margin: '20px' }}>
        Close
      </Button>
      
    </Dialog>

    <Dialog open={breakdownModalOpen} onClose={handleBreakdownClose} fullWidth maxWidth="md">
  <DialogTitle>Project Breakdown</DialogTitle>
  <DialogContent>
    {/* Example Table for Expenses, similar structure can be used for Revenues or other breakdown parts */}
    <Typography variant="h6" gutterBottom>Expenses</Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {selectedProjectBreakdown?.expenses.map((expense) => (
            <TableRow key={expense._id}>
              <TableCell>{expense.description}</TableCell>
              <TableCell align="right">${expense.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    {/* Include similar tables for Revenues or other breakdown parts as needed */}
    <Typography variant="h6" gutterBottom>Revenues</Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {selectedProjectBreakdown?.revenues.map((revenue) => (
            <TableRow key={revenue._id}>
              <TableCell>{revenue.description}</TableCell>
              <TableCell align="right">${revenue.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </DialogContent>
  <Button onClick={handleBreakdownClose} color="primary" style={{ margin: '20px' }}>
    Close
  </Button>
</Dialog>


      <DataEditor
        open={editModalOpen}
        handleClose={handleEditClose}
        initialEntityType="project"
        initialEntity={selectedProject}
        refreshProjects={fetchProjectsExpensesAndRevenues}
      />

{deleteModalOpen && (
        <DataDeleter
          open={deleteModalOpen}
          handleClose={handleDeleteClose}
          itemId={selectedItemForDeletion.id}
          itemType={selectedItemForDeletion.type}
          refreshProjects={fetchProjectsExpensesAndRevenues}
        />
      )}
    </>
  );
};

export default ProjectFetcher;
