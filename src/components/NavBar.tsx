import React, { useEffect, useState } from "react";
import { Menu, MenuItemProps } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { Link, useLocation } from "react-router-dom";
import { authActions } from "../store/auth-slice";

const NavBar = () => {
  const dispatch = useDispatch();
  const [activeItem, setActiveItem] = useState("home");
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.split("/")[1])
      setActiveItem(location.pathname.split("/")[1]);
  }, [location.pathname]);

  const handleItemClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    { name }: MenuItemProps
  ) => {
    setActiveItem(name as string);
  };
  const handleLogout = () => {
    dispatch(authActions.signout());
  };
  return (
    <Menu size="massive" secondary>
      <Menu.Item
        as={Link}
        to="/"
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
      />
      {isLoggedIn && (
        <>
          <Menu.Item
            as={Link}
            to="/create-todo"
            name="create todo"
            active={activeItem === "create todo"}
            onClick={handleItemClick}
          />
        </>
      )}

      <Menu.Menu position="right">
        {!isLoggedIn && (
          <>
            <Menu.Item
              as={Link}
              to="/signin"
              name="signin"
              active={activeItem === "signin"}
              onClick={handleItemClick}
            />
            <Menu.Item
              as={Link}
              to="/register"
              name="register"
              active={activeItem === "register"}
              onClick={handleItemClick}
            />
          </>
        )}
        {isLoggedIn && <Menu.Item name="logout" onClick={handleLogout} />}
      </Menu.Menu>
    </Menu>
  );
};

export default NavBar;
