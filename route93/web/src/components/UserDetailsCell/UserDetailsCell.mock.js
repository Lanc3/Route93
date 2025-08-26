// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  userDetails: [
    {
      __typename: 'UserDetails',
      id: 42,
    },
    {
      __typename: 'UserDetails',
      id: 43,
    },
    {
      __typename: 'UserDetails',
      id: 44,
    },
  ],
})
