import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box } from "@mui/material";
import {
  ProfileHeader,
  ProfileStats,
  TabsSection,
  PostsGrid,
  FollowDialog,
} from "../components/profile";

function ProfileScreen() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();

  // Retrieve logged-in user's id and token from localStorage
  const loggedInUserId = localStorage.getItem("user_id");
  const token = localStorage.getItem("access_token");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loggedInUserId || !token) {
      toast.error("Please log in to view this profile.");
      navigate("/login");
    }
  }, [loggedInUserId, token, navigate]);

  // Determine if the profile being viewed is the logged-in user's own profile
  const isOwnProfile = loggedInUserId === userId;

  // State variables
  const [selectedTab, setSelectedTab] = useState("post");
  const [profileData, setProfileData] = useState({
    name: localStorage.getItem("profile_name") || "John Doe",
    bio: localStorage.getItem("profile_bio") || "",
    profileImage: localStorage.getItem("profile_image") || "/default-avatar.png",
  });
  const [profileFollowers, setProfileFollowers] = useState([]);
  const [profileFollowing, setProfileFollowing] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");

  // Fetch profile data and posts on component mount or when userId changes
  useEffect(() => {
    if (location.state?.profileData) {
      const { name, bio, profileImage, followers, following } = location.state.profileData;
      setProfileData({ name, bio, profileImage });
      if (followers) setProfileFollowers(followers);
      if (following) setProfileFollowing(following);
      localStorage.setItem("profile_name", name);
      localStorage.setItem("profile_bio", bio);
      localStorage.setItem("profile_image", profileImage || "/default-avatar.png");
    } else {
      fetchProfileData();
    }
    fetchUserPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, location.key]);

  // Fetch profile details from the API
  const fetchProfileData = async () => {
    try {
      if (!token) {
        toast.error("User not authenticated");
        navigate("/login");
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/profile/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        const userData = response.data.user || response.data;
        const updatedData = {
          name: userData.name || "John Doe",
          bio: userData.bio || "",
          profileImage: userData.profile_picture || "/default-avatar.png",
        };
        setProfileData(updatedData);
        setProfileFollowers(userData.followers || []);
        setProfileFollowing(userData.following || []);
        localStorage.setItem("profile_name", updatedData.name);
        localStorage.setItem("profile_bio", updatedData.bio);
        localStorage.setItem("profile_image", updatedData.profileImage);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to load profile. Please try again.");
    }
  };

  // Fetch posts from the API
  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/users/${userId}/posts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (Array.isArray(response.data)) {
        setUploadedImages(response.data);
        setTotalPosts(response.data.length);
      } else {
        setUploadedImages([]);
        setTotalPosts(0);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
      toast.error("Failed to load posts. Please try again.");
    }
  };

  // Handlers for opening the followers/following dialog
  const handleOpenDialog = async (type) => {
    if (type === "followers") {
      await fetchFollowers();
    }
    if (type === "following") {
      await fetchFollowing();
    }
    setDialogType(type);
    setOpenDialog(true);
  };

  // Fetch followers list from the API
  const fetchFollowers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/followers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (Array.isArray(response.data)) {
        setProfileFollowers(response.data);
      }
    } catch (error) {
      console.error("Error fetching followers:", error);
      toast.error("Failed to load followers. Please try again.");
    }
  };

  // Fetch following list from the API
  const fetchFollowing = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/following`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (Array.isArray(response.data)) {
        setProfileFollowing(response.data);
      }
    } catch (error) {
      console.error("Error fetching following:", error);
      toast.error("Failed to load following. Please try again.");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogType("");
  };

  return (
    <Box sx={{ p: 4 }}>
      <ToastContainer />
      <ProfileHeader profileData={profileData} userId={userId} isOwnProfile={isOwnProfile} />
      <ProfileStats
        totalPosts={totalPosts}
        followersCount={profileFollowers.length}
        followingCount={profileFollowing.length}
        onStatClick={handleOpenDialog}
      />
      <TabsSection
        selectedTab={selectedTab}
        onTabChange={(e, newValue) => setSelectedTab(newValue)}
      />
      {selectedTab === "post" && (
        <PostsGrid 
          uploadedImages={uploadedImages} 
          fetchPosts={fetchUserPosts} 
          token={token} 
          setUploadedImages={setUploadedImages}
        />
      )}
      <FollowDialog
        open={openDialog}
        type={dialogType}
        onClose={handleCloseDialog}
        followers={profileFollowers}
        following={profileFollowing}
      />
    </Box>
  );
}

export default ProfileScreen;
