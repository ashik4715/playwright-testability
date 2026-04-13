export const config = {
  baseUrl: 'https://conduit.bondaracademy.com',
  apiUrl: 'https://conduit.bondaracademy.com/api',
  timeout: {
    default: 30000,
    action: 10000,
    navigation: 30000,
  },
  retry: {
    count: 2,
    delay: 1000,
  },
};