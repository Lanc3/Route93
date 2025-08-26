export const schema = gql`
  type InventoryStats {
    totalProducts: Int!
    inStockProducts: Int!
    outOfStockProducts: Int!
    lowStockProducts: Int!
    totalInventoryValue: Float!
    averageStockLevel: Float!
    criticalStockProducts: Int!
    overstockedProducts: Int!
  }

  type Product {
    id: Int!
    name: String!
    description: String
    price: Float!
    salePrice: Float
    sku: String!
    slug: String!
    status: String!
    inventory: Int!
    images: String
    tags: String
    createdAt: DateTime!
    updatedAt: DateTime!
    category: Category
    categoryId: Int
  }

  type Query {
    products(
      categoryId: Int
      minPrice: Float
      maxPrice: Float
      inStock: Boolean
      status: String
      search: String
      sortBy: String
      sortOrder: String
      limit: Int
      offset: Int
    ): [Product!]! @skipAuth
    
    product(id: Int!): Product @skipAuth
    productBySlug(slug: String!): Product @skipAuth
    
    productsCount(
      categoryId: Int
      minPrice: Float
      maxPrice: Float
      inStock: Boolean
      status: String
      search: String
    ): Int! @skipAuth
    
    # Inventory-specific queries
    inventoryProducts(
      lowStockThreshold: Int
      stockStatus: String
      sortBy: String
      sortOrder: String
      limit: Int
      offset: Int
      search: String
    ): [Product!]! @requireAuth(roles: ["ADMIN"])
    
    inventoryStats: InventoryStats! @requireAuth(roles: ["ADMIN"])
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product!
      @requireAuth(roles: ["ADMIN"])
    updateProduct(id: Int!, input: UpdateProductInput!): Product!
      @requireAuth(roles: ["ADMIN"])
    deleteProduct(id: Int!): Product! @requireAuth(roles: ["ADMIN"])
    
    # Inventory-specific mutations
    updateProductInventory(id: Int!, inventory: Int!): Product! @requireAuth(roles: ["ADMIN"])
    bulkUpdateInventory(updates: [InventoryUpdateInput!]!): [Product!]! @requireAuth(roles: ["ADMIN"])
  }

  input CreateProductInput {
    name: String!
    description: String
    price: Float!
    salePrice: Float
    sku: String!
    slug: String!
    status: String
    inventory: Int
    images: String
    tags: String
    categoryId: Int
  }

  input UpdateProductInput {
    name: String
    description: String
    price: Float
    salePrice: Float
    sku: String
    slug: String
    status: String
    inventory: Int
    images: String
    tags: String
    categoryId: Int
  }

  input InventoryUpdateInput {
    id: Int!
    inventory: Int!
  }
`
