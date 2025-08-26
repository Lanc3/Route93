// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  collections: [
    {
      __typename: 'Collection',
      id: 42,
    },
    {
      __typename: 'Collection',
      id: 43,
    },
    {
      __typename: 'Collection',
      id: 44,
    },
  ],
})
