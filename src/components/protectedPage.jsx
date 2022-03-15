// import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedPage = ({ children, needsLogin = false, guestOnly = false }) => {
  return children;
};

export default ProtectedPage;
