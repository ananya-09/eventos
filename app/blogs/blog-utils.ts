import { blog1 } from './data/blog-1'
import { blog2 } from './data/blog-2'
import { blog3 } from './data/blog-3'
import { blog4 } from './data/blog-4'
import { blog5 } from './data/blog-5'
import { Blog } from './types'

export function getAllBlogs(): Blog[] {
  return [blog1, blog2, blog3, blog4, blog5]
}

export function getFeaturedBlogs(): Blog[] {
  return getAllBlogs().filter((blog) => blog.featured)
}

export function getBlogsByCategory(category: string): Blog[] {
  return getAllBlogs().filter((blog) => blog.category === category)
}

export function getBlogBySlug(slug: string): Blog | undefined {
  return getAllBlogs().find((blog) => blog.slug === slug)
}

export function getCategories(): string[] {
  const categories = new Set(getAllBlogs().map((blog) => blog.category))
  return Array.from(categories)
}
