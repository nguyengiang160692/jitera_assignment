import { Button, Stack } from "@mui/material";
import { Container, Grid, Box } from "@mui/material";
import ItemDataTable from "./datatable/item";

function Dashboard() {
  return (
    <>
      <Container disableGutters>
        <Box sx={{ marginTop: '10px', minHeight: '80vh' }}>
          <Stack direction="column" spacing={2}>
            <Grid container>
              <Grid item>
                <Button variant="contained">Ongoing</Button>
                <Button variant="outlined" sx={{ marginLeft: 1 }}>Completed</Button>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
              <ItemDataTable />
            </Box>
          </Stack>
        </Box>
      </Container>
    </>
  );
}

export default Dashboard;
