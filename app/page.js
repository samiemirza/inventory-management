'use client';
import { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { Box, Modal, Typography, Stack, TextField, Button } from '@mui/material';
import { collection, deleteDoc, doc, getDocs, getDoc, setDoc, query } from "firebase/firestore";
import { Add, Remove, DarkMode, LightMode } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '@fontsource/roboto'; // Importing a Google Font

// Custom Themes
const lightTheme = createTheme({
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '8px 16px',
        },
        contained: {
          backgroundColor: '#ADD8E6',
          color: '#333',
          '&:hover': {
            backgroundColor: '#9FC1D5',
          },
        },
        outlined: {
          borderColor: '#ADD8E6',
          color: '#333',
          '&:hover': {
            borderColor: '#9FC1D5',
            backgroundColor: '#f0f0f0',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#333',
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

const darkTheme = createTheme({
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    allVariants: {
      color: '#c0c0c0', // Set all text color to #c0c0c0
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '8px 16px',
        },
        contained: {
          backgroundColor: '#2a2a2a',
          color: '#c0c0c0', // Set button text color to #c0c0c0
          '&:hover': {
            backgroundColor: '#353535',
          },
        },
        outlined: {
          borderColor: '#3f3f3f',
          color: '#c0c0c0', // Set button text color to #c0c0c0
          '&:hover': {
            borderColor: '#3f3f3f',
            backgroundColor: '#333',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#c0c0c0', // Set text color to #c0c0c0 for all typography elements
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          color: '#c0c0c0', // Ensure any text inside Box uses the correct color
        },
      },
    },
  },
});


export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [darkMode, setDarkMode] = useState(false); // State for dark mode

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach(doc => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(firestore, 'inventory', item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(firestore, 'inventory', item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => { setOpen(true) }
  const handleClose = () => { setOpen(false) }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent={"center"}
        alignItems={"center"}
        p={3}
        bgcolor={darkMode ? '#161616' : 'transparent'} // Black background for dark mode
      >
        <Box
          position="absolute"
          top={16}
          right={16}
          display="flex"
          alignItems="center"
        >
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setDarkMode(!darkMode)}
            startIcon={darkMode ? <LightMode /> : <DarkMode />}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </Box>

        <Typography variant="h2" gutterBottom>
          Inventory Management
        </Typography>

        <Box mb={4}></Box> {/* Adjust 'mb={4}' to control the space size */}

        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor={darkMode ? '#333' : 'white'}
            border={`2px solid ${darkMode ? '#FFD700' : '#000'}`}
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                InputProps={{
                  style: {
                    color: darkMode ? '#FFF' : '#000',
                    backgroundColor: darkMode ? '#444' : '#FFF'
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName)
                  setItemName('')
                  handleClose()
                }}
                endIcon={<Add />}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>

        <Box
          border={`1px solid ${darkMode ? '#353535' : '#778899'}`}
          bgcolor={darkMode ? '#222' : '#f0f0f0'}
          width="800px"
          height="400px"
          p={2}
          borderRadius={2}
          boxShadow={3}
          overflow="auto"
        >
          <Box
            height="50px"
            bgcolor={darkMode ? '#2a2a2a' : '#ADD8E6'}
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius={1}
            
          >
            <Typography variant="h5">
              INVENTORY ITEMS
            </Typography>
          </Box>

          <Stack spacing={2} mt={2}>
            {
              inventory.map(({ name, quantity }) => (
                <Box
                  key={name}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  padding={2}
                  bgcolor={darkMode ? '#151515' : 'white'}
                  borderRadius={1}
                  boxShadow={1}
                >
                  <Typography variant="h6" flex={1}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="h6" textAlign="center" minWidth={60}>
                    {quantity}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      onClick={() => { addItem(name) }}
                      endIcon={<Add />}
                    >
                      Add
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => { removeItem(name) }}
                      endIcon={<Remove />}
                    >
                      Remove
                    </Button>
                  </Stack>
                </Box>
              ))
            }
          </Stack>
        </Box>

        <Box mt={4}></Box> {/* Adjust 'mt={4}' to control the space size */}

        <Button
          variant="contained"
          onClick={() => { handleOpen() }}
          endIcon={<Add />}
        >
          Add New Item
        </Button>

        <Box mt={4}></Box> {/* Adjust 'mt={4}' to control the space size */}

        {/* Footer */}
        <Box
          width="100%"
          bgcolor={darkMode ? '#333' : '#B4C2CF'}
          p={1}
          position="absolute"
          bottom={0}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="body2" color={darkMode ? '#c0c0c0' : '#000'}>
            Developed by <a href="https://samieahmad.pages.dev" target="_blank" rel="noopener noreferrer" style={{ color: darkMode ? '#dcdcdc' : '#000' }}>Samie Ahmad</a>
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}







