// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  adminOrders: [
    {
      __typename: 'AdminOrders',
      id: 42,
    },
    {
      __typename: 'AdminOrders',
      id: 43,
    },
    {
      __typename: 'AdminOrders',
      id: 44,
    },
  ],
})
