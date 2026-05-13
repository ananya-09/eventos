// Copy blog utilities to the new location
import { blog1 } from './data/blog-1'
import { blog2 } from './data/blog-2'
import { blog3 } from './data/blog-3'
import { blog4 } from './data/blog-4'
import { blog5 } from './data/blog-5'
import type { Blog } from './types'

class BlogError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BlogError'
  }
}

let blogCache: Blog[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 60000

export function getAllBlogs(): Blog[] {
  try {
    const now = Date.now()
    
    if (blogCache && now - cacheTimestamp < CACHE_DURATION) {
      return blogCache
    }

    const blogs = [blog1, blog2, blog3, blog4, blog5]
    
    blogs.forEach((blog, index) => {
      if (!blog.id || !blog.slug || !blog.title) {
        throw new BlogError(`Blog at index ${index} is missing required fields`)
      }
    })

    blogCache = blogs
    cacheTimestamp = now
    return blogs
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return []
  }
}

export function getFeaturedBlogs(): Blog[] {
  try {
    return getAllBlogs()
      .filter((blog) => blog.featured)
      .slice(0, 3)
  } catch (error) {
    console.error('Error fetching featured blogs:', error)
    return []
  }
}

export function getBlogsByCategory(category: string): Blog[] {
  try {
    if (!category) {
      throw new BlogError('Category is required')
    }
    return getAllBlogs().filter((blog) => blog.category === category)
  } catch (error) {
    console.error('Error filtering blogs by category:', error)
    return []
  }
}

export function getBlogBySlug(slug: string): Blog | undefined {
  try {
    if (!slug) {
      throw new BlogError('Slug is required')
    }
    const blog = getAllBlogs().find((blog) => blog.slug === slug)
    if (!blog) {
      throw new BlogError(`Blog with slug "${slug}" not found`)
    }
    return blog
  } catch (error) {
    console.error('Error fetching blog:', error)
    return undefined
  }
}

export function getCategories(): string[] {
  try {
    const categories = new Set(getAllBlogs().map((blog) => blog.category))
    return Array.from(categories).sort()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export function searchBlogs(query: string): Blog[] {
  try {
    if (!query || query.length < 2) {
      return []
    }
    
    const lowerQuery = query.toLowerCase()
    return getAllBlogs().filter((blog) =>
      blog.title.toLowerCase().includes(lowerQuery) ||
      blog.description.toLowerCase().includes(lowerQuery) ||
      blog.content.toLowerCase().includes(lowerQuery)
    )
  } catch (error) {
    console.error('Error searching blogs:', error)
    return []
  }
}

export function sortBlogs(blogs: Blog[], sortBy: 'date' | 'title' | 'readTime' = 'date'): Blog[] {
  try {
    const sorted = [...blogs]
    
    switch (sortBy) {
      case 'date':
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'readTime':
        sorted.sort((a, b) => {
          const aTime = parseInt(a.readTime) || 0
          const bTime = parseInt(b.readTime) || 0
          return aTime - bTime
        })
        break
    }
    
    return sorted
  } catch (error) {
    console.error('Error sorting blogs:', error)
    return blogs
  }
}

export function paginateBlogs(blogs: Blog[], page: number = 1, perPage: number = 10): {
  blogs: Blog[]
  total: number
  pages: number
  currentPage: number
} {
  try {
    const total = blogs.length
    const pages = Math.ceil(total / perPage)
    const start = (page - 1) * perPage
    const end = start + perPage
    
    return {
      blogs: blogs.slice(start, end),
      total,
      pages,
      currentPage: Math.min(page, pages),
    }
  } catch (error) {
    console.error('Error paginating blogs:', error)
    return { blogs: [], total: 0, pages: 0, currentPage: 1 }
  }
}
