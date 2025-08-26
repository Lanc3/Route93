// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  featuredCollections: [
    {
      __typename: 'FeaturedCollections',
      id: 42,
    },
    {
      __typename: 'FeaturedCollections',
      id: 43,
    },
    {
      __typename: 'FeaturedCollections',
      id: 44,
    },
  ],
})
