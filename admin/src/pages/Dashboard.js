import React, { useState } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import UserTab from "./tabs/UserTab";
import ProductTab from "./tabs/ProductTab";
import OrderTab from "./tabs/OrderTab";
import SubscriptionTab from "./tabs/SubscriptionTab";

const Dashboard = () => {
  const [tab, setTab] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/";
  };

  // 💫 Danh sách tab và component tương ứng
  const tabs = [
    { label: "👤 Người dùng", component: <UserTab /> },
    { label: "📦 Sản phẩm", component: <ProductTab /> },
    { label: "🧾 Đơn hàng", component: <OrderTab /> },
    { label: "💌 Subscription", component: <SubscriptionTab /> },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f9fafb 0%, #e0f7fa 100%)",
      }}
    >
      {/* 🔹 Thanh AppBar */}
      <AppBar
        position="static"
        color="primary"
        sx={{
          boxShadow: "0px 3px 8px rgba(0,0,0,0.2)",
          background: "linear-gradient(90deg, #1976d2, #42a5f5)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold">
            🛠️ Admin Dashboard
          </Typography>
          <Button
            onClick={handleLogout}
            variant="outlined"
            sx={{
              color: "#fff",
              borderColor: "rgba(255,255,255,0.6)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
            }}
          >
            Đăng xuất
          </Button>
        </Toolbar>

        {/* 🔹 Tabbar */}
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          centered
          textColor="inherit"
          indicatorColor="secondary"
          sx={{
            "& .MuiTabs-indicator": {
              height: "4px",
              borderRadius: "4px",
              backgroundColor: "#fff",
            },
          }}
        >
          {tabs.map((t, i) => (
            <Tab
              key={i}
              label={t.label}
              sx={{
                fontWeight: tab === i ? "bold" : "normal",
                color: tab === i ? "#fff" : "rgba(255,255,255,0.7)",
                "&:hover": { color: "#fff", transform: "scale(1.05)" },
                transition: "all 0.3s",
              }}
            />
          ))}
        </Tabs>
      </AppBar>

      {/* 🔹 Nội dung tab với animation */}
      <Box p={3}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {tabs[tab].component}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default Dashboard;
