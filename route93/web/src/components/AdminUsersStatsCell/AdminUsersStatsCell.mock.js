// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  adminUsersStats: [
    {
      __typename: 'AdminUsersStats',
      id: 42,
    },
    {
      __typename: 'AdminUsersStats',
      id: 43,
    },
    {
      __typename: 'AdminUsersStats',
      id: 44,
    },
  ],
})
