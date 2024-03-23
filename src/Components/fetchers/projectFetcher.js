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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);const [selectedItemForDeletion, setSelectedItemForDeletion] = useState({ id: null, type: 'project' });

  useEffect(() => {
    fetchProjectsExpensesAndRevenues();
  }, []);

  const fetchProjectsExpensesAndRevenues = async () => {
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

  const handleOpenModal = (project) => {
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

  const handleDeleteOpen = (item, type = 'project') => {
    setSelectedItemForDeletion({ id: item._id, type });
    setDeleteModalOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
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






      <DataEditor
        open={editModalOpen}
        handleClose={handleEditClose}
        initialEntityType="project"
        initialEntity={selectedProject}
        // refreshEntities={refreshProjects}
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
