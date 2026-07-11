import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect } from 'react';
import * as gtag from '../lib/gtag'; // gtagモジュールのインポートを確認してください
import { trackPageview } from '../lib/track';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    trackPageview(router.asPath);

    const handleRouterChange = (url: string) => {
      gtag.pageview(url);
      trackPageview(url);
    };
    router.events.on("routeChangeComplete", handleRouterChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouterChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>せんべろCheers | 大衆酒場・立ち飲み・せんべろ検索</title>
        <meta
          name="description"
          content="大衆酒場・立ち飲み・せんべろ・角打ち・昼飲みが好きな人のための飲食店検索アプリ。せんべろセットや昼飲み・朝飲みの可否など、こだわり条件からお店を探せます。"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${gtag.GA_MEASUREMENT_ID}');
          `,
        }}
      />
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}