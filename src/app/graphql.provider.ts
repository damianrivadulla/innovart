import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApplicationConfig, inject } from '@angular/core';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';

const PRIMARY_URI = 'https://api.innovart.agency/graphql';
const FALLBACK_URI = 'https://adrianp69.sg-host.com/graphql';

export function apolloOptionsFactory(): ApolloClientOptions<any> {
  const httpLink = inject(HttpLink);

  const httpLinkWithFallback = httpLink.create({
    uri: (operation) => operation.getContext()['uri'] ?? PRIMARY_URI,
  });

  const fallbackOnError = onError(({ operation, networkError, forward }) => {
    if (networkError && !operation.getContext()['triedFallback']) {
      operation.setContext({ uri: FALLBACK_URI, triedFallback: true });
      return forward(operation);
    }
    return undefined;
  });

  return {
    link: fallbackOnError.concat(httpLinkWithFallback),
    cache: new InMemoryCache(),
  };
}

export const graphqlProvider: ApplicationConfig['providers'] = [
  Apollo,
  {
    provide: APOLLO_OPTIONS,
    useFactory: apolloOptionsFactory,
  },
];
