import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Modal from "@mui/material/Modal";
import ProfileModal from "./Modal/ProfileModal"
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// const pages = ['Dashboard', 'Compare'];

const ResponsiveAppBar = () => {
  const [auth, setAuth] = React.useState(null);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [pages, setPages] = React.useState( ['Dashboard', 'Compare'])
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const Navigate = useNavigate();
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleNavMenu = (val) => {
    if(val == "Add Subject"){
      Navigate("/admin/addsubject");
    }
    else if(val == "Add Admin"){
      Navigate("/admin/addadmin");
    }
    else if(val == "Dashboard"){
      Navigate("/dashboard");
    }
    else if(val == "Compare"){
      Navigate("/compare");
    }
    console.log(val);
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.accessToken;
        const response = await fetch(`http://localhost:3000/admin/verifyAdmin`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        var datas = await response.json();
        // Handle the data returned from the server
        console.log(datas);
        if(datas.res == true){
          setPages(['Add Subject', 'Add Admin'])
        }
        // Update your UI or perform other actions with the data
      } catch (error) {
        // Handle errors during the fetch request
        console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once when the component mounts
 
  
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
    window.location.reload();
  }
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.accessToken;
        const response = await fetch('http://localhost:3000/checkToken', {
          method: 'GET',
          headers: {
            'authorization': `hello ${token}`
          }
        });

        if (response.status === 200) {
          setAuth(true);
        } else {
          console.error('Unauthorized');
          setAuth(false);
        }
      } catch (error) {
        console.error('Error', error);
        setAuth(false);
      }
    };

    fetchData();
  }, []);

  if (auth === null) {
    return null; // or return a loading indicator
  }

  if (!auth) {
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            STUDYPROGRESS
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }

  // If authenticated

  return (
    <AppBar position="static">
    <Container maxWidth="xl">
      <Toolbar disableGutters>
        <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="#app-bar-with-responsive-menu"
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          STUDYPROGRESS
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {pages.map((page) => (
              <MenuItem key={page} onClick={handleCloseNavMenu}>
                <Typography textAlign="center">{page}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
        <Typography
          variant="h5"
          noWrap
          component="a"
          href="#app-bar-with-responsive-menu"
          sx={{
            mr: 2,
            display: { xs: 'flex', md: 'none' },
            flexGrow: 1,
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          STUDYPROGRESS
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {pages.map((page) => (
            <Button
              key={page}
              onClick={()=> handleNavMenu(page)}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              {page}
            </Button>
          ))}
        </Box>

        <Box sx={{ flexGrow: 0 }}>
        <Button onClick={handleLogout} sx={{ my: 2, color: 'white' }}>
              logout
            </Button>
          <Tooltip title="Open settings" style={{"display":"inline-block"}}>
            <Button onClick={handleOpen} sx={{ my: 2, color: 'white', }}>
              Profile
            </Button>
          </Tooltip>
          
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <ProfileModal change={handleClose} />
            {/* <h1>Modal hai</h1> */}
          </Modal>
          
        </Box>
      </Toolbar>
    </Container>
  </AppBar>  
);
}
export default ResponsiveAppBar;
