import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import Link from "next/link";
import { Provider } from "react-redux";
import RootReducer from "../redux/store";
import AuthProvider from "../components/AuthProvider";
import Navbar from "../components/navbar";
import store from "../redux/store";

function MyApp({ Component, pageProps }) {
  return (
    // this is the redux
    <Provider store={store}>
      {/* authProvider used to logged in the user if there is a token */}
      <AuthProvider>
        <ChakraProvider>
          <Navbar />
          <Component {...pageProps} />
        </ChakraProvider>
      </AuthProvider>
    </Provider>
  );
}

export default MyApp;
