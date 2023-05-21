import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Stack, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import React from "react";
import { useAppDispatch } from "../../redux/store";
import { ItemStatus } from "../../type/item";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { createItem } from "../../redux/item";


export default NiceModal.create(({ }) => {
    const modal = useModal();
    const dispatch = useAppDispatch()

    const today = dayjs()
    const [dateTimePick, setDateTimePick] = React.useState<Dayjs | null>(today);

    const [status, setStatus] = React.useState(ItemStatus.DRAFT)

    const handleChangeStatus = (event: SelectChangeEvent<ItemStatus>) => {
        setStatus(event.target.value as ItemStatus);
    }

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

        dispatch(createItem({
            name: data.get('name') as string,
            description: data.get('description') as string,
            startPrice: parseFloat(data.get('start_price') as string),
            status: status,
            publishAt: dateTimePick?.toISOString() as string
        }))
    }

    return <>
        <Modal
            open={modal.visible}
            onClose={modal.hide}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div>
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
                                id="description"
                                label="Item description"
                                name="description"
                                autoComplete="description"
                                autoFocus
                                multiline
                                rows={2}
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
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 10 }}
                                autoFocus
                            />

                            {/* select box for status */}
                            <FormControl fullWidth sx={{ mt: 3, mb: 3 }}>
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select
                                    labelId="status-label"
                                    id="status-select"
                                    name="status"
                                    value={status}
                                    label="Age"
                                    onChange={handleChangeStatus}
                                >
                                    <MenuItem value={ItemStatus.DRAFT}>Draft</MenuItem>
                                    <MenuItem value={ItemStatus.PUBLISHED}>Publish</MenuItem>
                                </Select>
                            </FormControl>


                            <DateTimePicker sx={{ 'width': '100%' }} label="Choose publish time" defaultValue={today} value={dateTimePick} onChange={(newValue) => setDateTimePick(newValue)} />
                            <Stack sx={{ mt: 3 }} direction="row" spacing={2} alignItems={'center'} justifyContent={'space-between'}>
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
            </div>
        </Modal>
    </>
})