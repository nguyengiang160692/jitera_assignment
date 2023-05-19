import { Button } from "@mui/material";
import { Container, Grid, Box } from "@mui/material";

function Dashboard() {
  return (
    <>
      <Container fixed>
        <Box sx={{ marginTop: '10px', minHeight: '80vh' }}>
          <Grid container>
            <Grid item>
              <Button variant="contained">Ongoing</Button>
              <Button variant="outlined" sx={{ marginLeft: 1 }}>Completed</Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default Dashboard;
