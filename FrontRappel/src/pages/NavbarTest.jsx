import { useState } from "react";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
const NavbarTest = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex">
      <div
        className={`${
          open ? "w-72 bg-black" : "w-20"
        }  h-screen relative bg-red-600`}
      >
        {!open ? (
          <IconButton
            edge="end"
            color=""
            onClick={() => {
              setOpen(!open);
            }}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <div className="ms-5">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setOpen(!open)}
            >
              <MenuIcon />
            </IconButton>
          </div>
        )}
      </div>
      <div className="p-7 text-2xl font-semibold flex-1 h-screen">
        <h1>Home Page</h1>
      </div>
    </div>
  );
};

export default NavbarTest;
