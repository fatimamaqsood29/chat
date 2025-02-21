import { Tabs, Tab } from "@mui/material";

export const TabsSection = ({ selectedTab, onTabChange }) => {
  return (
    <Tabs value={selectedTab} onChange={onTabChange} sx={{ mt: 4 }}>
      <Tab value="post" label="Posts" />
    </Tabs>
  );
};