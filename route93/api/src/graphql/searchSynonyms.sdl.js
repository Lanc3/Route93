export const schema = gql`
  type SearchSynonym {
    id: Int!
    term: String!
    synonyms: String!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    searchSynonyms: [SearchSynonym!]! @requireAuth
    searchSynonym(id: Int!): SearchSynonym @requireAuth
  }

  input CreateSearchSynonymInput {
    term: String!
    synonyms: String!
    isActive: Boolean!
  }

  input UpdateSearchSynonymInput {
    term: String
    synonyms: String
    isActive: Boolean
  }

  type Mutation {
    createSearchSynonym(input: CreateSearchSynonymInput!): SearchSynonym!
      @requireAuth
    updateSearchSynonym(
      id: Int!
      input: UpdateSearchSynonymInput!
    ): SearchSynonym! @requireAuth
    deleteSearchSynonym(id: Int!): SearchSynonym! @requireAuth
  }
`
