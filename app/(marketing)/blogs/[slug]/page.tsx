import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getBlogBySlug, getAllBlogs } from '../blog-utils'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Calendar, User } from 'lucide-react'

// Generate static params for all blog posts
export async function generateStaticParams() {
  const blogs = getAllBlogs()
  return blogs.map((blog) => ({
    slug: blog.slug,
  }))
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const blog = getBlogBySlug(params.slug)

  if (!blog) {
    return {
      title: '404 - Blog Not Found',
    }
  }

  return {
    title: `${blog.title} – Eventos`,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: 'article',
      publishedTime: blog.date,
      authors: [blog.author],
      images: blog.imageUrl ? [{ url: blog.imageUrl }] : [],
    },
  }
}

export default function BlogPage({ params }: { params: { slug: string } }) {
  const blog = getBlogBySlug(params.slug)

  if (!blog) {
    notFound()
  }

  const allBlogs = getAllBlogs()
  const currentIndex = allBlogs.findIndex((b) => b.slug === params.slug)
  const previousBlog = currentIndex > 0 ? allBlogs[currentIndex - 1] : null
  const nextBlog = currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null

  return (
    <div className="min-h-screen">
      {/* Back button */}
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/blogs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to blogs
          </Link>
        </Button>
      </div>

      {/* Hero Image */}
      {blog.imageUrl && (
        <div className="relative w-full h-96 bg-muted mb-8">
          <Image
            src={blog.imageUrl}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article Content */}
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {blog.category}
            </span>
            <span className="text-sm text-muted-foreground">{blog.readTime}</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            {blog.title}
          </h1>

          <p className="text-xl text-muted-foreground">
            {blog.description}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-6 pt-4 border-t border-border/30 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{blog.date}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className="prose dark:prose-invert max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Navigation */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-12 border-t border-border/30">
          {previousBlog ? (
            <Link
              href={`/blogs/${previousBlog.slug}`}
              className="group rounded-lg border border-border/50 bg-card/30 p-6 hover:border-primary/50 hover:bg-card/50 transition-all"
            >
              <div className="text-sm font-medium text-muted-foreground mb-2">
                ← Previous article
              </div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                {previousBlog.title}
              </h3>
            </Link>
          ) : (
            <div />
          )}

          {nextBlog ? (
            <Link
              href={`/blogs/${nextBlog.slug}`}
              className="group rounded-lg border border-border/50 bg-card/30 p-6 hover:border-primary/50 hover:bg-card/50 transition-all text-right"
            >
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Next article →
              </div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                {nextBlog.title}
              </h3>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </article>

      {/* Related posts */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <h2 className="mb-8 text-2xl font-bold">More articles</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {allBlogs
            .filter((b) => b.slug !== params.slug)
            .slice(0, 3)
            .map((relatedBlog) => (
              <Link
                key={relatedBlog.id}
                href={`/blogs/${relatedBlog.slug}`}
                className="group rounded-lg border border-border/50 bg-card/30 overflow-hidden hover:border-primary/50 hover:bg-card/50 transition-all"
              >
                {relatedBlog.imageUrl && (
                  <div className="relative h-40 w-full overflow-hidden bg-muted">
                    <Image
                      src={relatedBlog.imageUrl}
                      alt={relatedBlog.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <span className="text-xs font-medium text-primary">
                    {relatedBlog.category}
                  </span>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {relatedBlog.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {relatedBlog.description}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  )
}
