import { type AppType } from "next/app";
import "../styles/globals.css";
import { AuthProvider } from '../utils/AuthContext';

// MyApp component acts as the root component for all pages in the Next.js application
const MyApp: AppType = ({ Component, pageProps }) => {
  // Wraps all page components with the AuthProvider context to provide authentication state
  return (
    <AuthProvider>
      {/* Component represents the active page, and pageProps contains its props */}
      <Component {...pageProps} />
    </AuthProvider>
  );
};

export default MyApp;
