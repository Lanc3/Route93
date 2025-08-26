// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  adminProducts: [
    {
      __typename: 'AdminProducts',
      id: 42,
    },
    {
      __typename: 'AdminProducts',
      id: 43,
    },
    {
      __typename: 'AdminProducts',
      id: 44,
    },
  ],
})
