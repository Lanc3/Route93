// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  categories: [
    {
      __typename: 'Category',
      id: 42,
    },
    {
      __typename: 'Category',
      id: 43,
    },
    {
      __typename: 'Category',
      id: 44,
    },
  ],
})
