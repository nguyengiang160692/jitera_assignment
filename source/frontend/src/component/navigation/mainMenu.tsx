import { AttachMoney, Sell } from '@mui/icons-material';
import Logout from '@mui/icons-material/Logout';
import { AppBar, Stack, Toolbar } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { logout } from '../../redux/auth';
import { RootState, useAppDispatch, useAppSelector } from '../../redux/store';
import Logo from './logo';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import depositModal from '../modal/depositModal';
import addItemModal from '../modal/addItemModal';

export default function MainMenu() {
    const dispatch = useAppDispatch()

    const auth = useAppSelector((state: RootState) => state.auth)

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const depositModalTrigger = useModal(depositModal);
    const addItemModalTrigger = useModal(addItemModal);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout())
    }

    const showDepositModal = () => {
        depositModalTrigger.show()
    }

    const showAddItemModal = () => {
        addItemModalTrigger.show()
    }

    const username = auth.user?.username as string || ''

    return (
        <>
            <AppBar
                position="static"
                color="default"
                elevation={0}
                sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}`, background: '#66aeff' }}
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
                                    <Avatar sx={{ width: 32, height: 32, backgroundColor: 'black' }}>{username[0]?.toUpperCase()}</Avatar>
                                    <Typography sx={{ minWidth: 100, marginLeft: '10px' }}> | Balance: ${auth.user?.balance.toLocaleString()} </Typography>
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
                <MenuItem onClick={showAddItemModal}>
                    <Sell />Add Item
                </MenuItem>
                <MenuItem onClick={showDepositModal}>
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
        </>
    );
}