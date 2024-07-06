import React from "react";
import BottomNavigationBar from "../components/BottomNavigationBar";

const PageLayout = ({ children, navigation }) => {
  return (
    <>
      {children}
      <BottomNavigationBar navigation={navigation} />
    </>
  );
};

export default PageLayout;
