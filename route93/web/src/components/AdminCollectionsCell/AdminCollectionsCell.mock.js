// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  adminCollections: [
    {
      __typename: 'AdminCollections',
      id: 42,
    },
    {
      __typename: 'AdminCollections',
      id: 43,
    },
    {
      __typename: 'AdminCollections',
      id: 44,
    },
  ],
})
