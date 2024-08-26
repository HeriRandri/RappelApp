/* eslint-disable react/prop-types */
import { Button } from "@mui/material";

export default function NavbarFlux({ children, isActive, onshow }) {
  return (
    <div>{isActive ? { children } : <Button onClick={onshow}></Button>}</div>
  );
}
