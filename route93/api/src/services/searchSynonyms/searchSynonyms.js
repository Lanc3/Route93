import { db } from 'src/lib/db'

export const searchSynonyms = () => {
  return db.searchSynonym.findMany()
}

export const searchSynonym = ({ id }) => {
  return db.searchSynonym.findUnique({
    where: { id },
  })
}

export const createSearchSynonym = ({ input }) => {
  return db.searchSynonym.create({
    data: input,
  })
}

export const updateSearchSynonym = ({ id, input }) => {
  return db.searchSynonym.update({
    data: input,
    where: { id },
  })
}

export const deleteSearchSynonym = ({ id }) => {
  return db.searchSynonym.delete({
    where: { id },
  })
}
