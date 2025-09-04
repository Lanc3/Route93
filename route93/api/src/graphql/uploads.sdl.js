export const schema = gql`
  type MediaAsset {
    id: Int!
    publicId: String!
    url: String!
    secureUrl: String!
    format: String!
    width: Int!
    height: Int!
    bytes: Int!
    originalName: String!
    altText: String
    tags: String
    folder: String
    createdAt: DateTime!
    updatedAt: DateTime!
    uploader: User!
  }

  type Query {
    mediaAssets(folder: String, limit: Int, offset: Int): [MediaAsset!]! @requireAuth(roles: ["ADMIN"])
    mediaAsset(id: Int!): MediaAsset @requireAuth(roles: ["ADMIN"])
  }

  type Mutation {
    uploadImage(file: String!, folder: String, altText: String, tags: [String!]): MediaAsset! @requireAuth(roles: ["ADMIN"])
    deleteImage(id: Int!): MediaAsset! @requireAuth(roles: ["ADMIN"])
    updateImageMetadata(id: Int!, altText: String, tags: [String!]): MediaAsset! @requireAuth(roles: ["ADMIN"])
  }
`
