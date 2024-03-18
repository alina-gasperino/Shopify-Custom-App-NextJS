import '../styles/globals.css'
import { AppProvider } from "@shopify/polaris";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Provider, useAppBridge } from "@shopify/app-bridge-react";
import translations from "@shopify/polaris/locales/en.json";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import App from "next/app";

function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}

function MyProvider(props) {
  const app = useAppBridge(); 

  const client = new ApolloClient({
    fetch: userLoggedInFetch(app),
    fetchOptions: {
      credentials: "include",
    },
  });

  const Component = props.Component;

  return (
    <ApolloProvider client={client}>
      <Component {...props} />
    </ApolloProvider>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <AppProvider i18n={translations}>
      <Provider
          config={{
            apiKey: "3cf301e854c5724bb40296cf57dadb4c",
            host: "Y3VzdG9tLWRpc2NvdW50LW1hbmFnZW1lbnQubXlzaG9waWZ5LmNvbS9hZG1pbg",
            forceRedirect: true,
          }}
        >
        <Component {...pageProps} />
      </Provider>
    </AppProvider>
  )
}

export default MyApp
