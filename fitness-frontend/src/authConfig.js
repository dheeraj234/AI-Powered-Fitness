// export const authConfig = {
//     clientId: 'oauth2-pkce-client',
//     authorizationEndpoint: 'http://localhost:8181/realms/fitness-app/protocol/openid-connect/auth',
//     tokenEndpoint: 'http://localhost:8181/realms/fitness-app/protocol/openid-connect/token',
//     redirectUri: 'http://localhost:5173',
//     scope: 'openid profile email offline_access',
//     onRefreshTokenExpire: (event) => event.logIn(),
//   }


export const authConfig = {
  clientId: 'oauth2-pkce-client',
  authorizationEndpoint: 'https://keycloak-server-8qaj.onrender.com/realms/fitness-app/protocol/openid-connect/auth',
  tokenEndpoint: 'https://keycloak-server-8qaj.onrender.com/realms/fitness-app/protocol/openid-connect/token',
  redirectUri: 'https://ai-powered-fitness.netlify.app',
  scope: 'openid profile email offline_access',
  onRefreshTokenExpire: (event) => event.logIn(),
};
