import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { AttachMoneyRounded, CampaignOutlined, Sell, AttachMoney } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { AppBar, Toolbar, Button, Link } from '@mui/material';
import Logo from './logo';
import { useAppDispatch } from '../../redux/store';
import { logout } from '../../redux/auth';

export default function MainMenu() {
    const dispatch = useAppDispatch()

    const auth = useSelector((state: RootState) => state.auth)

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout())
    }

    const username = auth.user.username as string

    return (
        <>
            <Container fixed>
                <AppBar
                    position="static"
                    color="default"
                    elevation={0}
                    sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
                >
                    <Toolbar>
                        <Box key={'div'} sx={{ minWidth: '100%' }}>
                            <Stack direction="row" spacing={2} alignItems={'center'} justifyContent={'space-between'}>
                                <Logo />
                                <nav>
                                    {/* <Link
                                    variant="button"
                                    color="text.primary"
                                    href="#"
                                    sx={{ my: 1, mx: 1.5 }}
                                >
                                    Bidding Items
                                </Link> */}
                                </nav>
                                <Tooltip title="Account settings">
                                    <IconButton
                                        onClick={handleClick}
                                        size="small"
                                        sx={{ ml: 2 }}
                                        aria-controls={open ? 'account-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                    >
                                        <Typography sx={{ minWidth: 100, marginRight: '10px' }}>Welcome, {username} </Typography>
                                        <Avatar sx={{ width: 32, height: 32, backgroundColor: 'black' }}>{username[0].toUpperCase()}</Avatar>
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleClose}>
                        <Sell />Add Item
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <AttachMoney /> Deposit
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </Container>
        </>
    );
}