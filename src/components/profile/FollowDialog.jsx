import {
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    IconButton,
    Avatar,
  } from "@mui/material";
  import CloseIcon from "@mui/icons-material/Close";
  
  export const FollowDialog = ({
    open,
    type,
    onClose,
    followers,
    following,
    posts,
  }) => {
    const getContent = () => {
      if (type === "followers" || type === "following") {
        const users = type === "followers" ? followers : following;
        return (
          <List>
            {users.map((user, index) => (
              <ListItem key={user._id || user.id || index}>
                <ListItemAvatar>
                  <Avatar src={user.profile_picture || "/default-avatar.png"} />
                </ListItemAvatar>
                <ListItemText
                  primary={user.name || "Unknown"}
                  secondary={user.email || ""}
                />
              </ListItem>
            ))}
          </List>
        );
      }
  
      if (type === "posts") {
        return (
          <List>
            {posts.map((image, index) => (
              <ListItem key={image._id || index}>
                <Avatar
                  variant="rounded"
                  src={image.image_url}
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <ListItemText primary={image.caption || "No Caption"} />
              </ListItem>
            ))}
          </List>
        );
      }
  
      return null;
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {type ? type.charAt(0).toUpperCase() + type.slice(1) : ""}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>{getContent()}</DialogContent>
      </Dialog>
    );
  };