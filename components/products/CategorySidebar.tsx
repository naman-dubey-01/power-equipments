import Link from 'next/link'

interface CategorySidebarProps {
  categories: { id: string; name: string; slug: string }[]
  activeSlug?: string
}

export function CategorySidebar({ categories, activeSlug }: CategorySidebarProps) {
  return (
    <aside className="lg:w-56 shrink-0">
      <div className="card-base p-4 sticky top-24">
        <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--color-navy-900)' }}>
          Categories
        </h3>
        <ul className="flex flex-col gap-1">
          <li>
            <Link
              href="/products"
              className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                !activeSlug ? 'bg-blue-50 text-blue-600 font-medium' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              All Products
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/products/category/${cat.slug}`}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  activeSlug === cat.slug ? 'bg-blue-50 text-blue-600 font-medium' : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}