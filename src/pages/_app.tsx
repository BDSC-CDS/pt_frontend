import { type AppType } from "next/app";
import "../styles/globals.css";
import '../../public/css/pt-theme.css';
import { Layout } from '../components/Layout'
import Script from "next/script";
import Link from "next/link";

declare global {
  interface Window {
    __APP_CONFIG__?: { API_URL: string };
  }
}

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Link rel="stylesheet" href="/css/pt-theme.css" />
      <Script
        src="/config.js"
        strategy="beforeInteractive"
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
};

export default MyApp;
