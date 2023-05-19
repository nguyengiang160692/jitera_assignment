import { CampaignOutlined } from "@mui/icons-material";
import { Typography, Stack, Box } from "@mui/material";

const Logo = () => {
    return <>
        <Box sx={{
            minWidth: 100,
            color: 'white',
            background: 'black',
            outline: '1px solid white',
            padding: '10px',
            borderRadius: '30px 4px 30px'
        }}>
            <Stack direction={'row'} alignContent={'center'}>
                <CampaignOutlined />
                <Typography sx={{ marginLeft: 1 }}>
                    Black Market
                </Typography>
            </Stack>
        </Box>
    </>
}

export default Logo;