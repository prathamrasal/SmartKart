import { Provider } from "react-redux";
import store from "../store";
import "../styles/globals.css";
import { NotificationProvider } from "web3uikit";
import { MoralisProvider } from "react-moralis";
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import '../public/nprogress.css'
import { useEffect } from "react";


function MyApp({ Component, pageProps }) {

  const router = useRouter();
  useEffect(() => {
    const handleStart = (url) => {
      console.log(`Loading: ${url}`)
      NProgress.start()
    }
    const handleStop = () => {
      NProgress.done()
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])


  return (
    <Provider store={store}>
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <Component {...pageProps} />
        </NotificationProvider>
      </MoralisProvider>
    </Provider>
  );
}

export default MyApp;
