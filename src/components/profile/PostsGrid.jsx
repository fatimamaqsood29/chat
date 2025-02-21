import { Grid, Box, Typography } from "@mui/material";

export const PostsGrid = ({ uploadedImages }) => {
  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {uploadedImages.map((image) => (
        <Grid item xs={6} sm={4} md={3} key={image._id}>
          <Box
            sx={{
              border: "1px solid #ddd",
              padding: 2,
              textAlign: "center",
              borderRadius: 2,
            }}
          >
            <img
              src={image.image_url}
              alt={image.caption}
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <Typography variant="body2" mt={1}>
              {image.caption}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};