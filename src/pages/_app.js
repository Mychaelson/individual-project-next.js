import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import Link from "next/link";
import { Provider } from "react-redux";
import RootReducer from "../redux/store";
import { createStore } from "redux";
import AuthProvider from "../components/AuthProvider";
import Navbar from "../components/navbar";

const store = createStore(RootReducer);

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
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
