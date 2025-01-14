import { ThirdwebProvider } from "@thirdweb-dev/react";
import { AvalancheFuji} from "@thirdweb-dev/chains";
import "../styles/globals.css";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider activeChain={AvalancheFuji}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
