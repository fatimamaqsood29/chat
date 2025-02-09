// src/pages/Follow.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Follow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Use the passed state to determine the initial tab ("followers" or "following")
  const initialTab = location.state?.tab || "followers";
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    // Load existing data from localStorage (or use empty arrays)
    const storedFollowers = JSON.parse(localStorage.getItem("followers")) || [];
    const storedFollowing = JSON.parse(localStorage.getItem("following")) || [];
    setFollowers(storedFollowers);
    setFollowing(storedFollowing);
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleUnfollow = (userId) => {
    const updatedFollowing = following.filter((user) => user.id !== userId);
    setFollowing(updatedFollowing);
    localStorage.setItem("following", JSON.stringify(updatedFollowing));
    toast.success("Unfollowed successfully!");
  };

  const handleRemoveFollower = (userId) => {
    const updatedFollowers = followers.filter((user) => user.id !== userId);
    setFollowers(updatedFollowers);
    localStorage.setItem("followers", JSON.stringify(updatedFollowers));
    toast.success("Follower removed successfully!");
  };

  // --- Dummy simulation functions ---
  const simulateAddFollower = () => {
    const newFollower = {
      id: Date.now(), // unique id based on current timestamp
      username: `follower_${Date.now()}`,
      profileImage: "https://via.placeholder.com/40",
    };
    const updatedFollowers = [...followers, newFollower];
    setFollowers(updatedFollowers);
    localStorage.setItem("followers", JSON.stringify(updatedFollowers));
    toast.success("Dummy follower added!");
  };

  const simulateAddFollowing = () => {
    const newFollowing = {
      id: Date.now(), // unique id based on current timestamp
      username: `following_${Date.now()}`,
      profileImage: "https://via.placeholder.com/40",
    };
    const updatedFollowing = [...following, newFollowing];
    setFollowing(updatedFollowing);
    localStorage.setItem("following", JSON.stringify(updatedFollowing));
    toast.success("Dummy following added!");
  };

  const handleClose = () => {
    // Navigate back to the previous page (typically the ProfileScreen)
    navigate(-1);
  };

  return (
    <Box width="100%" maxWidth="600px" margin="auto" mt={4} p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Followers &amp; Following</Typography>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </Box>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Followers" value="followers" />
        <Tab label="Following" value="following" />
      </Tabs>
      <Box mt={2}>
        <List>
          {selectedTab === "followers"
            ? followers.map((user) => (
                <ListItem key={user.id}>
                  <ListItemAvatar>
                    <Avatar src={user.profileImage} />
                  </ListItemAvatar>
                  <ListItemText primary={user.username} />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemoveFollower(user.id)}
                  >
                    Remove
                  </Button>
                </ListItem>
              ))
            : following.map((user) => (
                <ListItem key={user.id}>
                  <ListItemAvatar>
                    <Avatar src={user.profileImage} />
                  </ListItemAvatar>
                  <ListItemText primary={user.username} />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleUnfollow(user.id)}
                  >
                    Unfollow
                  </Button>
                </ListItem>
              ))}
        </List>
      </Box>
      {/* --- Dummy Action Buttons for Simulation --- */}
      <Box mt={2} display="flex" justifyContent="space-around">
        <Button variant="contained" onClick={simulateAddFollower}>
          Simulate Add Follower
        </Button>
        <Button variant="contained" onClick={simulateAddFollowing}>
          Simulate Follow
        </Button>
      </Box>
    </Box>
  );
};

export default Follow;