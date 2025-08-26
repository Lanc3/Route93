export const schema = gql`
  type CategoryCount {
    products: Int!
  }

  type Category {
    id: Int!
    name: String!
    description: String
    slug: String!
    parentId: Int
    parent: Category
    children: [Category]!
    image: String
    createdAt: DateTime!
    updatedAt: DateTime!
    products: [Product]!
    _count: CategoryCount
  }

  type Query {
    categories: [Category!]! @skipAuth
    category(id: Int!): Category @skipAuth
    categoryBySlug(slug: String!): Category @skipAuth
  }

  type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
      @requireAuth(roles: ["ADMIN"])
    updateCategory(id: Int!, input: UpdateCategoryInput!): Category!
      @requireAuth(roles: ["ADMIN"])
    deleteCategory(id: Int!): Category! @requireAuth(roles: ["ADMIN"])
  }

  input CreateCategoryInput {
    name: String!
    description: String
    slug: String!
    parentId: Int
    image: String
  }

  input UpdateCategoryInput {
    name: String
    description: String
    slug: String
    parentId: Int
    image: String
  }
`
