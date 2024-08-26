import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { Menu } from "antd";
import { useState } from "react";
export default function Navbar() {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <Menu className="flex bg-blue-700 rounded-md justify-between items-center">
        <div className={`${open} ? "w-72": "w-20" relative`}>
          <Menu.Item>
            <a href="/login" style={{ color: "white" }}>
              Login
            </a>
          </Menu.Item>
          <Menu.Item>
            <a href="/" style={{ color: "white" }}>
              Signup
            </a>
          </Menu.Item>
        </div>
        <div>
          <IconButton
            edge="start"
            className="hidden"
            color="inherit"
            aria-label="menu"
            onClick={() => setOpen()}
          >
            <MenuIcon />
          </IconButton>
        </div>
      </Menu>
    </div>
  );
}
