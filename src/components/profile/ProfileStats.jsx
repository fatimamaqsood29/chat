import { Box, Typography } from "@mui/material";

export const ProfileStats = ({ totalPosts, followersCount, followingCount, onStatClick }) => {
  return (
    <Box display="flex" gap={3} mt={3}>
      {[
        { count: totalPosts, label: "Posts", type: "posts" },
        { count: followersCount, label: "Followers", type: "followers" },
        { count: followingCount, label: "Following", type: "following" },
      ].map((stat) => (
        <Box
          key={stat.type}
          sx={{ cursor: "pointer" }}
          onClick={() => onStatClick(stat.type)}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {stat.count}
          </Typography>
          <Typography variant="body2">{stat.label}</Typography>
        </Box>
      ))}
    </Box>
  );
};