import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'

export const advancedSearch = async ({
  query,
  categoryId,
  minPrice,
  maxPrice,
  minRating,
  inStock,
  sortBy = 'relevance',
  sortOrder = 'desc',
  limit = 20,
  offset = 0,
}) => {
  const startTime = Date.now()

  // Build where clause
  const where = {
    status: 'ACTIVE',
  }

  // Text search
  if (query) {
    // Expand with synonyms
    const synonymRecords = await db.searchSynonym.findMany({
      where: { OR: [{ term: { equals: query, mode: 'insensitive' } }, { isActive: true }] },
      take: 50,
    })
    const expandedTerms = new Set([query])
    for (const record of synonymRecords) {
      try {
        const list = JSON.parse(record.synonyms)
        if (Array.isArray(list)) {
          list.forEach((t) => t && expandedTerms.add(String(t)))
        }
      } catch (_) {
        // ignore bad JSON
      }
      if (record.term) expandedTerms.add(record.term)
    }

    const likeClauses = [...expandedTerms].map((term) => ({
      OR: [
        { name: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
        { tags: { contains: term, mode: 'insensitive' } },
        { sku: { contains: term, mode: 'insensitive' } },
      ],
    }))
    where.OR = likeClauses.flatMap((c) => c.OR)
  }

  // Category filter
  if (categoryId) {
    where.categoryId = categoryId
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {}
    if (minPrice !== undefined) where.price.gte = minPrice
    if (maxPrice !== undefined) where.price.lte = maxPrice
  }

  // Stock filter
  if (inStock) {
    where.inventory = { gt: 0 }
  }

  // Rating filter
  if (minRating) {
    where.reviews = {
      some: {
        rating: { gte: minRating }
      }
    }
  }

  // Sort options
  const orderBy = {}
  switch (sortBy) {
    case 'price':
      orderBy.price = sortOrder
      break
    case 'name':
      orderBy.name = sortOrder
      break
    case 'rating':
      // Sort by average rating
      orderBy.reviews = {
        _count: sortOrder
      }
      break
    case 'newest':
      orderBy.createdAt = 'desc'
      break
    case 'popularity':
      // Sort by review count as proxy for popularity
      orderBy.reviews = {
        _count: 'desc'
      }
      break
    default:
      // Relevance - if there's a query, sort by relevance
      if (query) {
        // Simple relevance: prioritize exact matches, then partial matches
        orderBy.name = 'asc'
      } else {
        orderBy.createdAt = 'desc'
      }
  }

  // Get products
  const products = await db.product.findMany({
    where,
    orderBy,
    take: limit,
    skip: offset,
    include: {
      category: true,
      reviews: {
        select: {
          rating: true,
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  })

  // Get total count
  const totalCount = await db.product.count({ where })

  // Generate facets
  const facets = await generateFacets(where)

  // Generate suggestions
  const suggestions = query ? await generateSuggestions(query) : []

  const searchTime = Date.now() - startTime

  return {
    products,
    totalCount,
    facets,
    suggestions,
    searchTime,
  }
}

export const searchSuggestions = async ({ query, limit = 10 }) => {
  if (!query || query.length < 2) return []

  // Get product name suggestions
  const productSuggestions = await db.product.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
      status: 'ACTIVE',
    },
    select: {
      name: true,
      _count: {
        select: {
          reviews: true,
        },
      },
    },
    take: limit,
    orderBy: {
      name: 'asc',
    },
  })

  // Get category suggestions
  const categorySuggestions = await db.category.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
    select: {
      name: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
    take: 3,
  })

  const suggestions = [
    ...productSuggestions.map(p => ({
      text: p.name,
      type: 'product',
      count: p._count.reviews,
    })),
    ...categorySuggestions.map(c => ({
      text: c.name,
      type: 'category',
      count: c._count.products,
    })),
  ]

  return suggestions.slice(0, limit)
}

export const popularSearchTerms = async ({ limit = 20 }) => {
  // Get most searched terms from analytics
  const popularTerms = await db.searchAnalytics.groupBy({
    by: ['query'],
    _count: {
      query: true,
    },
    orderBy: {
      _count: {
        query: 'desc',
      },
    },
    take: limit,
  })

  return popularTerms.map(term => term.query)
}

export const trackSearch = async ({
  query,
  resultCount,
  filters,
  sessionId,
  searchTime,
  userId,
  ipAddress,
  userAgent,
}) => {
  try {
    await db.searchAnalytics.create({
      data: {
        query,
        resultCount,
        filters,
        sessionId,
        searchTime,
        userId,
        ipAddress,
        userAgent,
      },
    })
    return true
  } catch (error) {
    console.error('Error tracking search:', error)
    return false
  }
}

export const trackSearchClick = async ({ query, productId, sessionId, userId }) => {
  try {
    // Find the most recent search for this query/session
    const recentSearch = await db.searchAnalytics.findFirst({
      where: {
        query,
        sessionId,
        userId,
        clickedProductId: null, // Only update if not already clicked
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (recentSearch) {
      await db.searchAnalytics.update({
        where: { id: recentSearch.id },
        data: { clickedProductId: productId },
      })
    }
    return true
  } catch (error) {
    console.error('Error tracking search click:', error)
    return false
  }
}

export const searchAnalytics = async ({ startDate, endDate, limit = 50, offset = 0 }) => {
  const where = {}
  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) where.createdAt.gte = startDate
    if (endDate) where.createdAt.lte = endDate
  }

  return db.searchAnalytics.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      clickedProduct: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: offset,
  })
}

export const searchAnalyticsStats = async () => {
  const [
    totalSearches,
    uniqueQueries,
    avgResults,
    popularTermsData,
    totalClicks,
  ] = await Promise.all([
    db.searchAnalytics.count(),
    db.searchAnalytics.findMany({
      select: { query: true },
      distinct: ['query'],
    }).then(results => results.length),
    db.searchAnalytics.aggregate({
      _avg: { resultCount: true },
    }),
    db.searchAnalytics.groupBy({
      by: ['query'],
      _count: { query: true },
      orderBy: { _count: { query: 'desc' } },
      take: 10,
    }),
    db.searchAnalytics.count({
      where: { clickedProductId: { not: null } },
    }),
  ])

  const conversionRate = totalSearches > 0 ? (totalClicks / totalSearches) * 100 : 0

  const popularTerms = popularTermsData.map(term => ({
    term: term.query,
    count: term._count.query,
    conversionRate: 0, // Could be calculated with more complex queries
  }))

  return {
    totalSearches,
    uniqueQueries,
    averageResults: avgResults._avg.resultCount || 0,
    conversionRate,
    popularTerms,
  }
}

// Helper functions
async function generateFacets(baseWhere) {
  const [categoryFacets, priceRanges, ratingFacets, availability] = await Promise.all([
    // Category facets
    db.product.groupBy({
      by: ['categoryId'],
      where: { ...baseWhere, categoryId: { not: null } },
      _count: { categoryId: true },
      take: 20,
    }).then(async (results) => {
      const categories = await db.category.findMany({
        where: {
          id: { in: results.map(r => r.categoryId) },
        },
        select: { id: true, name: true },
      })

      return results.map(result => {
        const category = categories.find(c => c.id === result.categoryId)
        return {
          value: result.categoryId.toString(),
          label: category?.name || 'Unknown',
          count: result._count.categoryId,
        }
      })
    }),

    // Price range facets
    db.product.findMany({
      where: baseWhere,
      select: { price: true },
    }).then(products => {
      const prices = products.map(p => p.price).sort((a, b) => a - b)
      if (prices.length === 0) return []

      const ranges = [
        { min: 0, max: 25 },
        { min: 25, max: 50 },
        { min: 50, max: 100 },
        { min: 100, max: 200 },
        { min: 200, max: 500 },
        { min: 500, max: Infinity },
      ]

      return ranges.map(range => {
        const count = prices.filter(p =>
          p >= range.min && (range.max === Infinity ? true : p < range.max)
        ).length

        return {
          min: range.min,
          max: range.max === Infinity ? null : range.max,
          count,
        }
      }).filter(range => range.count > 0)
    }),

    // Rating facets
    db.review.groupBy({
      by: ['productId', 'rating'],
      _count: { rating: true },
    }).then(ratingData => {
      const ratingCounts = {}
      ratingData.forEach(item => {
        ratingCounts[item.rating] = (ratingCounts[item.rating] || 0) + item._count.rating
      })

      return Object.entries(ratingCounts).map(([rating, count]) => ({
        rating: parseInt(rating),
        count,
      }))
    }),

    // Availability facets
    db.product.aggregate({
      where: baseWhere,
      _count: {
        inventory: true,
      },
    }).then(async (result) => {
      const inStock = await db.product.count({
        where: { ...baseWhere, inventory: { gt: 0 } },
      })
      const outOfStock = result._count.inventory - inStock

      return {
        inStock,
        outOfStock,
      }
    }),
  ])

  return {
    categories: categoryFacets,
    priceRanges,
    ratings: ratingFacets,
    availability,
  }
}

async function generateSuggestions(query) {
  // Get partial matches for suggestions
  const suggestions = await db.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { tags: { contains: query, mode: 'insensitive' } },
      ],
      status: 'ACTIVE',
    },
    select: {
      name: true,
      _count: { select: { reviews: true } },
    },
    take: 5,
    orderBy: {
      _count: { reviews: 'desc' },
    },
  })

  return suggestions.map(s => ({
    text: s.name,
    type: 'product',
    count: s._count.reviews,
  }))
}
