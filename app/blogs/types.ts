export interface Blog {
  id: string
  title: string
  description: string
  date: string
  category: string
  author: string
  readTime: string
  featured?: boolean
  imageUrl?: string
  slug: string
}
