// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  adminUsers: [
    {
      __typename: 'AdminUsers',
      id: 42,
    },
    {
      __typename: 'AdminUsers',
      id: 43,
    },
    {
      __typename: 'AdminUsers',
      id: 44,
    },
  ],
})
