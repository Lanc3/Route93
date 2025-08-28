// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  orderDetails: [
    {
      __typename: 'OrderDetails',
      id: 42,
    },
    {
      __typename: 'OrderDetails',
      id: 43,
    },
    {
      __typename: 'OrderDetails',
      id: 44,
    },
  ],
})
