import { Typography, Link } from "@mui/material"

const Copyright = () => {
    return
    <>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Myself
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    </>
}

