import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, Container, Typography, useMediaQuery, Card, CardContent, Grid, Box
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DataEditor from '../DataEditor/DataEditor';
import DataDeleter from '../DataDeleter/DataDeleter';
import AddRevenue from '../AddRevenue/AddRevenue';
import AddExpense from '../AddExpense/AddExpense';

const baseUrl = 'https://projectfinancetracker-backend-2f2604a2f7f0.herokuapp.com';

const ProjectFetcher = () => {
  const [projects, setProjects] = useState([]);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [revenueModalOpen, setRevenueModalOpen] = useState(false);
  const [currentDetails, setCurrentDetails] = useState({ expenses: [], revenues: [] });
  const [selectedProject, setSelectedProject] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);const [selectedItemForDeletion, setSelectedItemForDeletion] = useState({ id: null, type: 'projects' });
  const [breakdownModalOpen, setBreakdownModalOpen] = useState(false);
  const [selectedProjectBreakdown, setSelectedProjectBreakdown] = useState(null);
  const [openAddRevenue, setOpenAddRevenue] = useState(false);
  const [openAddExpense, setOpenAddExpense] = useState(false);
  const handleOpenAddExpense = () => setOpenAddExpense(true);
  const handleCloseAddExpense = () => setOpenAddExpense(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const handleOpenAddRevenue = () => setOpenAddRevenue(true);
  const handleCloseAddRevenue = () => setOpenAddRevenue(false);

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

  const handleExpenseOpenModal = (project) => {
    setSelectedProject(project);
    setCurrentDetails({ expenses: project.expenses, revenues: project.revenues });
    setExpenseModalOpen(true);
  };

  const handleExpenseCloseModal = () => {
    setExpenseModalOpen(false);
  };

  const handleRevenueOpenModal = (project) => {
    setSelectedProject(project);
    setCurrentDetails({ expenses: project.expenses, revenues: project.revenues });
    setRevenueModalOpen(true);
  };

  const handleRevenueCloseModal = () => {
    setRevenueModalOpen(false);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'; // Return 'N/A' if date is not provided
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Rendering either Table or Cards based on screen size
  const renderProjects = () => {
    if (matches) {
      // Mobile view with Cards
      return (
        <Grid container spacing={2}>
          {projects.map((project) => (
            <Grid item xs={12} key={project._id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h5" component="div">{project.name}</Typography>
                    <Box textAlign="right" flexShrink={0}>
                      <Typography variant="caption" display="block" color="textSecondary">Project Creation Date: {formatDate(project.createdAt)}</Typography>
                      {project.startDate && <Typography variant="caption" display="block" color="textSecondary">Start Date: {formatDate(project.startDate)}</Typography>}
                      {project.endDate && <Typography variant="caption" display="block" color="textSecondary">End Date: {formatDate(project.endDate)}</Typography>}
                    </Box>
                  </Box>
                  <Typography>Total Expenses: ${project.totalExpenses.toFixed(2)}</Typography>
                  <Typography>Total Revenues: ${project.totalRevenues.toFixed(2)}</Typography>
                  <Typography>Profit: ${project.profit.toFixed(2)}</Typography>
                  <Button onClick={() => handleEditOpen(project)}><EditIcon /></Button>
                  <Button onClick={() => handleDeleteOpen(project)}><DeleteIcon /></Button>
                  <Button onClick={() => handleBreakdownOpen(project)}>View Breakdown</Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      );
    } else {
      // Desktop view with Table
      return (
        <TableContainer component={Paper} sx={{ maxWidth: '90%', margin: 'auto', overflowX: 'auto' }}>
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
                    <Button variant="outlined" sx={{ ml: 2 }} onClick={() => handleExpenseOpenModal(project)}>
                      View All
                    </Button>
                  </TableCell>
                  <TableCell align="right">${project.totalRevenues.toFixed(2)}
                  <Button variant="outlined" sx={{ ml: 2 }} onClick={() => handleRevenueOpenModal(project)}>
                      View All
                    </Button>
                  </TableCell>
                  
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
      );
    }
  };

  return (
    <>
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
        {renderProjects()}
      </Container>
      <Dialog open={expenseModalOpen} onClose={handleExpenseCloseModal} fullWidth maxWidth="md">
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
        <Button
          variant="contained"
          fullWidth
          onClick={handleOpenAddExpense}
          startIcon={<MoneyOffIcon />}
          sx={{
              backgroundImage: 'linear-gradient(45deg, #f44336, #e91e63)', // A red-pink gradient
              color: 'white',
              ':hover': {
              bgcolor: 'secondary.dark', // Darken the button when hovered
              boxShadow: '0 3px 5px 2px rgba(233, 30, 99, .3)', // Adjust the shadow color to match
              },
          }}
          >
          Add New Expense
        </Button>
        <Button onClick={handleExpenseCloseModal} color="primary" style={{ margin: '20px' }}>
        Close
      </Button>
    </Dialog>

    <Dialog open={revenueModalOpen} onClose={handleRevenueCloseModal} fullWidth maxWidth="md">
        <DialogTitle>Project Details</DialogTitle>
        <DialogContent>
          {/* Revenues Table */}
          <Typography variant="h6" gutterBottom>Revenues</Typography>
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
                {currentDetails.revenues.map((revenue) => (
                  <TableRow key={revenue._id}>
                    <TableCell>{revenue.description}</TableCell>
                    <TableCell align="right">${revenue.amount.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <Button onClick={() => handleDeleteOpen(revenue, 'revenue')}>
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <Button
          variant="contained"
          fullWidth
          onClick={handleOpenAddRevenue}
          startIcon={<AttachMoneyIcon />}
          sx={{
              backgroundImage: 'linear-gradient(45deg, #4caf50, #81c784)',
              color: 'white',
              ':hover': {
              bgcolor: 'success.dark',
              boxShadow: '0 3px 5px 2px rgba(129, 199, 132, .3)',
              },
          }}
          >
          Add New Revenue
        </Button>
        
        <Button onClick={handleRevenueCloseModal} color="primary" style={{ margin: '20px' }}>
        Close
      </Button>
    </Dialog>

    <Dialog open={breakdownModalOpen} onClose={handleBreakdownClose} fullWidth maxWidth="md">
  <DialogTitle>Project Breakdown</DialogTitle>
  <DialogContent>
    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
      <Typography variant="h5" component="div">{selectedProjectBreakdown?.name}</Typography>
      <Box textAlign="right" flexShrink={0}>
        <Typography variant="caption" display="block" color="textSecondary">Project Creation Date: {formatDate(selectedProjectBreakdown?.createdAt)}</Typography>
        {selectedProjectBreakdown?.startDate && <Typography variant="caption" display="block" color="textSecondary">Start Date: {formatDate(selectedProjectBreakdown?.startDate)}</Typography>}
        {selectedProjectBreakdown?.endDate && <Typography variant="caption" display="block" color="textSecondary">End Date: {formatDate(selectedProjectBreakdown?.endDate)}</Typography>}
      </Box>
    </Box>
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
    <Typography variant="h6" gutterBottom>Profit</Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell align="right">${selectedProjectBreakdown?.profit.toFixed(2)}</TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </DialogContent>
  <Button onClick={handleBreakdownClose} color="primary" style={{ margin: '20px' }}>
    Close
  </Button>
</Dialog>

{openAddRevenue && (
  <AddRevenue open={openAddRevenue} handleClose={handleCloseAddRevenue} selectedProject={selectedProject} refreshProjects={fetchProjectsExpensesAndRevenues}/>
)}
{openAddExpense && (
  <AddExpense open={openAddExpense} handleClose={handleCloseAddExpense} selectedProject={selectedProject} refreshProjects={fetchProjectsExpensesAndRevenues}/>
)}

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
