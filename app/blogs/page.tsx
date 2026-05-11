'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getAllBlogs, getFeaturedBlogs, getCategories } from './blog-utils'
import { Button } from '@/components/ui/button'

export default function BlogsPage() {
  const blogs = getAllBlogs()
  const featuredBlogs = getFeaturedBlogs()
  const categories = getCategories()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredBlogs = selectedCategory
    ? blogs.filter((blog) => blog.category === selectedCategory)
    : blogs

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Eventos Blog
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Insights, tips, and guides for event management and planning.
          </p>
        </div>
      </section>

      {/* Featured Blogs Section */}
      {featuredBlogs.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8 lg:px-10">
          <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
            Featured Articles
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {featuredBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.slug}`}
                className="group overflow-hidden rounded-2xl border border-border/50 bg-card/50 transition-all hover:border-primary/50 hover:bg-card/80 hover:shadow-lg"
              >
                <div className="flex h-full flex-col overflow-hidden">
                  {blog.imageUrl && (
                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                      <Image
                        src={blog.imageUrl}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                          {blog.category}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {blog.readTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold leading-snug group-hover:text-primary transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {blog.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-border/30">
                      <span className="text-xs text-muted-foreground">
                        By {blog.author} • {blog.date}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8 lg:px-10">
        <h3 className="mb-4 text-lg font-semibold">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(null)}
            className="rounded-full"
          >
            All Articles
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* All Blogs Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8 lg:px-10">
        <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
          {selectedCategory ? `${selectedCategory} Articles` : 'All Articles'}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card/50 transition-all hover:border-primary/50 hover:bg-card/80 hover:shadow-md"
            >
              {blog.imageUrl && (
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                  <Image
                    src={blog.imageUrl}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {blog.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {blog.readTime}
                    </span>
                  </div>
                  <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {blog.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 mt-auto border-t border-border/30">
                  <span className="text-xs text-muted-foreground">
                    {blog.date}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {blog.author}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="rounded-lg border border-dashed border-border bg-background/50 py-12 text-center">
            <p className="text-muted-foreground">No articles found in this category.</p>
          </div>
        )}
      </section>
    </div>
  )
}
