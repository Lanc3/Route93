// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  products: [
    {
      __typename: 'Product',
      id: 42,
    },
    {
      __typename: 'Product',
      id: 43,
    },
    {
      __typename: 'Product',
      id: 44,
    },
  ],
})
