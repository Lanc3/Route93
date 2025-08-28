// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  userOrders: [
    {
      __typename: 'UserOrders',
      id: 42,
    },
    {
      __typename: 'UserOrders',
      id: 43,
    },
    {
      __typename: 'UserOrders',
      id: 44,
    },
  ],
})
