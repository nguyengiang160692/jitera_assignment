import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Modal, Box, Typography, Button, TextField, Stack, IconButton } from "@mui/material";
import { useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { bidItem } from "../../redux/item";
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import React from "react";

export default NiceModal.create(({ }) => {
    const modal = useModal();
    const dispatch = useAppDispatch()
    const selectedItem = useSelector((state: RootState) => state.item.selectedItem)

    const [bidPrice, setBidPrice] = React.useState<number>(0)
    const [threshold, setThreshold] = React.useState<number>(100)

    const handleThresHoldChange = (amount: number) => () => {
        setBidPrice(bidPrice + amount)
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

        const bidPrice: number = parseFloat(data.get('bidPrice') as string)

        if (selectedItem?.currentPrice && bidPrice > selectedItem?.currentPrice) {
            dispatch(bidItem(bidPrice, selectedItem))
        }
    }

    return <>
        <Modal
            open={modal.visible}
            onClose={modal.hide}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Typography id="modal-modal-title">
                        Bid "{selectedItem?.name}"
                    </Typography>
                    <Typography id="modal-modal-description" fontSize={'13px'} sx={{ mt: 2, color: 'red' }}>
                        {selectedItem?.description}
                    </Typography>
                    <Typography id="modal-modal-description" fontSize={'13px'} sx={{ mt: 2, color: 'grey' }}>
                        Start bidding <b>${selectedItem?.startPrice.toLocaleString()}</b>
                    </Typography>
                    <Typography>
                        Current price: <b>${selectedItem?.currentPrice?.toLocaleString()}</b>
                    </Typography>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="bidPrice"
                        label="My bid price"
                        name="bidPrice"
                        autoComplete="bidPrice"
                        autoFocus
                        value={bidPrice}
                        onInput={(event: React.ChangeEvent<HTMLInputElement>) => { setBidPrice(parseFloat(event.target.value)) }}
                    />
                    <Stack direction="row" sx={{ mt: 2, mb: 2 }} spacing={2} alignItems={'center'} justifyContent={'space-between'}>
                        <IconButton onClick={handleThresHoldChange(-1 * threshold)}>
                            <IndeterminateCheckBoxRoundedIcon />
                        </IconButton>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Threshold amount"
                            autoFocus
                            defaultValue={threshold}
                            onInput={(event: React.ChangeEvent<HTMLInputElement>) => { setThreshold(parseFloat(event.target.value)) }}
                        />
                        <IconButton onClick={handleThresHoldChange(threshold)}>
                            <AddBoxRoundedIcon />
                        </IconButton>
                    </Stack>
                    <Stack sx={{ mt: 1 }} direction="row" spacing={2} alignItems={'center'} justifyContent={'space-between'}>
                        <Button
                            type="submit"
                            variant="contained"
                        >
                            Bid
                        </Button>
                        <Button variant="outlined" onClick={modal.hide}>
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Modal>
    </>
})