import React, { useState } from "react";
import NavbarFlux from "./NavbarFlux";
import SignUp from "./Page/LoginFlux";

export const Parent = () => {
  const [isActiveIndex, setIsActiveIndex] = useState(0);
  return (
    <div>
      <NavbarFlux
        isActive={isActiveIndex === 0}
        onshow={() => setIsActiveIndex(0)}
      >
        <SignUp />
      </NavbarFlux>
    </div>
  );
};
