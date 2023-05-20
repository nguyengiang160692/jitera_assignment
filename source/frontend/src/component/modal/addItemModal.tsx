import NiceModal, { useModal } from "@ebay/nice-modal-react";
import React from "react";
import { Modal, Box, Typography, Button, TextField, Stack } from "@mui/material";
import { useAppDispatch } from "../../redux/store";
import { deposit } from "../../redux/auth";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default NiceModal.create(({ }) => {
    const modal = useModal();
    const dispatch = useAppDispatch()

    const today = dayjs()
    const [dateTimePick, setDateTimePick] = React.useState<Dayjs | null>(today);

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const parsed = Object.fromEntries(data)

        const depositAmount: number = parseFloat(data.get('amount') as string)

        if (depositAmount) {
            dispatch(deposit(depositAmount, modal.hide))
        }
    }

    return <>
        <Modal
            open={modal.visible}
            onClose={modal.hide}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={style}>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Create new item to bid
                        </Typography>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Item name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="start_price"
                            label="Start price"
                            name="start_price"
                            autoComplete="start_price"
                            type="text"
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            autoFocus
                        />
                        <DateTimePicker sx={{ 'width': '100%' }} label="Choose publish time" defaultValue={today} value={dateTimePick} onChange={(newValue) => setDateTimePick(newValue)} />
                        <Stack sx={{ mt: 1 }} direction="row" spacing={2} alignItems={'center'} justifyContent={'space-between'}>
                            <Button
                                type="submit"
                                variant="contained"
                            >
                                Add Item
                            </Button>
                            <Button variant="outlined" onClick={modal.hide}>
                                Cancel
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </LocalizationProvider>
        </Modal>
    </>
})