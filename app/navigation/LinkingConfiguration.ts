export const Linking = {
  prefixes: [
    'https://cyfinity.io',
    'cyfinity://'
  ],
  config: {
    screens: {
      TabStack: {
        screens: {
          coin: {
            path: 'coin',
            screens: {
              ChangePasswordScreen: {
                path: 'change_password',
                params: {
                  user_email: String,
                  number: String,
                },
              },
            },
          },
          shop: {
            path: 'shop',
            screens: {
              ChangePasswordScreen: {
                path: 'change_password',
                params: {
                  user_email: String,
                  number: String,
                },
              },
            },
          },
          inventory: {
            path: 'inventory',
            screens: {
              ChangePasswordScreen: {
                path: 'change_password',
                params: {
                  user_email: String,
                  number: String,
                },
              },
            },
          },
        },
        NotFound: '*',
      },
    },
  },
};