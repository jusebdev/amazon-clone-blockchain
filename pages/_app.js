import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
//CONNECT TO MORALIS SERVER BEFORE TO START
import { ModalProvider } from "react-simple-hook-modal";

import { AmazonProvider, AMazonProvider } from "../context/AmazonContext";

function MyApp({ Component, pageProps }) {
	return (
		<MoralisProvider
			serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER}
			appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID}>
			<AmazonProvider>
				<ModalProvider>
				<Component {...pageProps} />
				</ModalProvider>
			</AmazonProvider>
		</MoralisProvider>
	);
}

export default MyApp;
