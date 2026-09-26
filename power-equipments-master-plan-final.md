# Power Equipments — Master Build & Migration Plan

## 0. Mission

Build a **new, production-grade website from scratch** for Power Equipments.

The old site is only a **content/reference source**. Do not reproduce its technical stack and do not make any part of the new system depend on the old site.

### Non-negotiable goals

- No Wix
- No WordPress
- No PHP
- No vendor-specific page builder
- No hard-coded product/catalog content in source code
- Client must be able to manage products, images, gallery items, certificates and company/contact information without a developer
- Consistent visual system across every page
- Excellent mobile experience
- Professional B2B/industrial/electrical-company presentation
- Strong SEO foundations
- Fast loading and optimized images
- Secure admin area
- Easy future maintenance
- Hosting compatible with the client's Hostinger environment
- Clear separation between presentation, business logic, data and admin functionality

---



# 0A. Final Navigation Contract

The primary header shown in the current reference image is:

```text
Home | About Us | Our Product ▼ | Gallery | Certificate | Contact Us
```

This navigation must be fully functional in the new website, not just visually reproduced.

## Required routes

| Header item | Route | Behavior |
|---|---|---|
| Home | `/` | Opens the fully designed landing page |
| About Us | `/about` | Company overview, history, capabilities and trust information |
| Our Product | `/products` | Opens the main product catalogue |
| Our Product ▼ | dynamic category menu | Shows active product categories from Supabase |
| Gallery | `/gallery` | Shows the managed company/project/product gallery |
| Certificate | `/certificates` | Shows managed certificates and supporting documents |
| Contact Us | `/contact` | Contact details, offices and enquiry form |

## Header requirements

The header is a shared site component and must be implemented once and reused on every public page.

It must include:

- Logo/brand mark supplied by the client
- Desktop navigation
- `Our Product` dropdown populated from active product categories in Supabase
- Current-page/active-state styling
- Keyboard-accessible dropdown behavior
- Click-outside / Escape handling for the dropdown
- Responsive mobile navigation
- Sticky or appropriately persistent behavior if it improves usability
- Clear hover, focus and active states
- A prominent contact/enquiry action where it fits the final visual design

### Product dropdown behavior

Do not hard-code product category names into the header.

The menu should be generated from active categories in the database:

```text
Supabase categories
        ↓
active categories
        ↓
Header dropdown
        ↓
/products/category/{slug}
```

Adding a new category through the admin panel must automatically make it available in the product navigation when the category is active.

If there are many categories, the dropdown should remain usable rather than becoming a very tall list. Grouping, columns or an expandable mega-menu may be used only when justified by the actual catalog size.

### Header mobile behavior

On mobile:

```text
[Logo]                         [Menu]

--------------------------------------

Home
About Us
Our Product      > / expand
Gallery
Certificate
Contact Us
```

The mobile menu must be a real navigation system, not a desktop navigation squeezed into a narrow screen.

### Footer navigation

The footer should repeat the important routes and display current company/contact information from the database. It must not contain stale hard-coded phone numbers, email addresses or branch information.

---

# 0B. Final Home Page / Landing Page Design

The Home page is a **first-class page** and must be designed from scratch. The existing site's broken/unavailable landing page must not be carried into the new architecture.

The objective is to communicate, within the first viewport, that Power Equipments is a credible electrical/industrial supplier and to drive visitors toward products or an enquiry.

## Home page design direction

Visual character:

- premium industrial B2B
- clean engineering aesthetic
- strong typography
- restrained use of brand color
- high-quality industrial/electrical imagery
- strong grid alignment
- generous whitespace
- clear technical information hierarchy
- subtle interaction, not flashy animation

The page should feel like a serious supplier/solutions partner, not a generic corporate template.

## Home page section order

```text
HEADER
  ↓
HERO
  ↓
TRUST / CREDIBILITY STRIP
  ↓
PRODUCT CATEGORIES
  ↓
FEATURED PRODUCTS
  ↓
ABOUT / COMPANY INTRODUCTION
  ↓
INDUSTRIES SERVED
  ↓
WHY POWER EQUIPMENTS
  ↓
BRANDS / PARTNERSHIPS
  ↓
CERTIFICATES / CREDENTIALS
  ↓
GALLERY PREVIEW
  ↓
ENQUIRY CTA
  ↓
FOOTER
```

Not every section must be visible in every future version, but the first implementation should support this full information hierarchy and allow content to be reduced after client review.

## 1. Hero

The hero must answer four questions immediately:

- What does Power Equipments provide?
- Who is it for?
- Where does it operate?
- What should the visitor do next?

Suggested structure:

```text
------------------------------------------------------------
|                                                         |
|  ELECTRICAL & INDUSTRIAL SOLUTIONS                      |
|                                                         |
|  Reliable electrical products for industrial            |
|  applications and businesses.                           |
|                                                         |
|  [Explore Products]   [Enquire Now]                     |
|                                                         |
|                                   INDUSTRIAL IMAGE      |
|                                   / PRODUCT DETAIL      |
|                                                         |
------------------------------------------------------------
```

The actual wording must be based on verified client claims. Do not invent performance guarantees or unsupported industry credentials.

Hero requirements:

- Strong H1
- Short supporting paragraph
- Primary CTA → `/products`
- Secondary CTA → `/contact`
- Professionally selected image or visual
- Responsive crop/stacking
- Accessible text contrast
- No giant decorative background that harms readability

## 2. Trust / credibility strip

A compact section immediately below the hero should establish credibility using facts that the client confirms.

Examples of content types:

- Central India presence
- Bhopal + Indore offices
- years established / years in business if verified
- industries served
- authorized partnerships if currently valid

The implementation must be data-driven so the client can change the content later without editing JSX.

## 3. Product Categories

This is one of the most important home-page sections.

Show a curated set of active product categories from Supabase, for example:

- VFDs
- Motors
- LED Lighting
- Wires & Cables
- Switchgears

These are reference categories from the current site, not permanent hard-coded truth. The final categories must come from the database.

Each category card should contain:

- category image/icon
- category name
- short description if available
- `View Products` action

Clicking a category must navigate to:

```text
/products/category/{slug}
```

Adding or removing categories in the admin should automatically update this section.

## 4. Featured Products

Display a curated number of products marked `featured = true` in Supabase.

Recommended initial layout:

- 3 cards on desktop
- 2 on tablet
- 1 on mobile

Each product card should have:

- primary image
- name
- category/brand where useful
- short description
- `View Product`

Include a `View All Products` action.

Do not hard-code featured product names.

## 5. Company introduction

A concise, professionally rewritten introduction to Power Equipments.

Layout suggestion:

```text
[Company image / industrial visual] | [Story + key facts]
```

Include a clear link to the full About page.

Do not repeat the entire About page on Home.

## 6. Industries served

Use a visual grid or horizontal set of industry cards.

Examples may include industries currently referenced by the company, but every item must be validated before publication.

This section is for demonstrating breadth without making unsupported customer claims.

## 7. Why Power Equipments

Use 3–5 strong, evidence-based reasons.

Examples of categories:

- product range
- technical understanding
- regional presence
- industrial experience
- responsive enquiry support

Do not use fake numbers such as customer counts, delivery percentages or uptime guarantees unless the client supplies evidence.

## 8. Brands / Partnerships

If the client confirms current authorization/partnership relationships, show selected brand logos or names in a restrained logo wall.

The logos should be manageable in admin rather than embedded permanently into the component.

If authorization expires or changes, the client must be able to remove the brand without a code change.

## 9. Certificates / credentials

Show a small preview of active certificates.

Each item should link to `/certificates` or open an accessible preview.

Only publish certificates the client authorizes.

## 10. Gallery preview

Use a curated 4–6 image preview from the gallery table.

Add `View Full Gallery`.

Images must be optimized and lazy-loaded when below the fold.

## 11. Final enquiry CTA

End the page with a strong, simple contact section:

```text
Need the right electrical product for your application?
Talk to Power Equipments.

[Contact Us]    [Call Now]
```

Phone/email values should come from company settings.

## Home page responsive behavior

Desktop:
- wide hero composition
- multi-column category/product grids
- generous section spacing

Tablet:
- reduce grid columns
- preserve hierarchy
- simplify image compositions

Mobile:
- stacked hero
- one/two-column cards as appropriate
- horizontal logo/brand overflow avoided
- no text placed over unreadable images
- CTA buttons remain easy to tap

## Home page performance

The Home page must not become a media-heavy landing page.

Rules:

- optimize hero image
- use responsive image sizes
- lazy-load below-fold media
- avoid auto-playing video unless there is a compelling reason
- use Server Components for content sections
- keep animations subtle and non-blocking


# 1. Current Website: What We Are Replacing

Use the current public site as the source of truth for **existing content, products, company information, contact details and assets**, not as the design or architecture to copy.

The current site presents Power Equipments as a Bhopal-based electrical products and solutions business, with operations in Central India and an Indore branch. It currently lists product categories including VFDs, motors, LED lighting, wires/cables and switchgears. The About page also describes the company history, founder, industries served, panel-building expertise, authorized-channel relationships and office/contact information. The current certificate page is primarily a certificate collection. 

Reference pages:

- https://powerequipments.in/
- https://powerequipments.in/about_us.php
- https://powerequipments.in/certificate.php
- https://powerequipments.in/contact_us.php

Current content includes:
- Bhopal head office
- Indore branch
- Phone/mobile numbers
- Office hours
- Public email
- Company history
- Founder/leadership information
- Industries served
- Product categories
- Certificates
- Gallery

Do not blindly copy weak/dated wording. Rewrite and structure the content professionally after validating it with the client.

---

# 2. Recommended Final Stack

## Frontend / Application

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- ESLint
- Prettier

## Backend / Data

- Supabase
  - PostgreSQL database
  - Storage buckets
  - Authentication
  - Row Level Security
  - Optional database functions when genuinely useful

## Hosting

- Hostinger for the website/application, subject to the exact hosting plan's support for the chosen Next.js deployment model.
- Domain remains under the client's existing control.

## Email

Use a proper transactional email provider rather than relying on a custom mail server.

Examples:
- Resend
- Postmark
- Brevo

The contact form should send to the company's configured email address.

## Analytics / monitoring

Add only after the core website is stable:
- Google Search Console
- Google Analytics or an equivalent privacy-conscious analytics solution
- Error monitoring if needed

---

# 3. High-Level Architecture

```text
                         PUBLIC USERS
                              |
                              v
                    +-------------------+
                    |     Next.js       |
                    |  Public Website   |
                    +---------+---------+
                              |
                +-------------+--------------+
                |                            |
                v                            v
         Supabase Database             Supabase Storage
                |                            |
                |                            |
                +-------------+--------------+
                              |
                              v
                    +-------------------+
                    |   Next.js Admin   |
                    |     /admin        |
                    +---------+---------+
                              |
                              v
                       Authenticated
                           Admin
```

The public website and admin can live in the same Next.js application.

---

# 4. Repository Structure

Recommended structure:

```text
power-equipments/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   │
│   ├── about/
│   │   └── page.tsx
│   │
│   ├── products/
│   │   ├── page.tsx
│   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   └── category/
│   │       └── [slug]/
│   │           └── page.tsx
│   │
│   ├── gallery/
│   │   └── page.tsx
│   │
│   ├── certificates/
│   │   └── page.tsx
│   │
│   ├── contact/
│   │   └── page.tsx
│   │
│   ├── search/
│   │   └── page.tsx
│   │
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   ├── gallery/
│   │   │   └── page.tsx
│   │   ├── certificates/
│   │   │   └── page.tsx
│   │   ├── company/
│   │   │   └── page.tsx
│   │   ├── contact-settings/
│   │   │   └── page.tsx
│   │   ├── media/
│   │   │   └── page.tsx
│   │   └── users/
│   │       └── page.tsx
│   │
│   └── api/
│       ├── contact/
│       │   └── route.ts
│       ├── revalidate/
│       │   └── route.ts
│       └── ...
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── DesktopNav.tsx
│   │   ├── MobileNav.tsx
│   │   ├── Footer.tsx
│   │   ├── Breadcrumbs.tsx
│   │   └── Container.tsx
│   │
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Tabs.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── FileUpload.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingState.tsx
│   │   └── ConfirmDialog.tsx
│   │
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── ProductCategories.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── Industries.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── CertificationsPreview.tsx
│   │   ├── GalleryPreview.tsx
│   │   └── ContactCTA.tsx
│   │
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── ProductSearch.tsx
│   │   └── ProductDetail.tsx
│   │
│   ├── gallery/
│   │   ├── GalleryGrid.tsx
│   │   └── Lightbox.tsx
│   │
│   ├── certificates/
│   │   ├── CertificateGrid.tsx
│   │   └── CertificateViewer.tsx
│   │
│   ├── contact/
│   │   ├── ContactForm.tsx
│   │   ├── OfficeCard.tsx
│   │   └── MapEmbed.tsx
│   │
│   └── admin/
│       ├── AdminSidebar.tsx
│       ├── AdminHeader.tsx
│       ├── DashboardStat.tsx
│       ├── DataTable.tsx
│       ├── Pagination.tsx
│       ├── ProductForm.tsx
│       ├── CategoryForm.tsx
│       ├── GalleryForm.tsx
│       ├── CertificateForm.tsx
│       ├── ImageUploader.tsx
│       ├── RichTextEditor.tsx
│       └── AdminGuard.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── auth/
│   │   ├── permissions.ts
│   │   └── session.ts
│   ├── validation/
│   │   ├── product.ts
│   │   ├── category.ts
│   │   ├── gallery.ts
│   │   ├── certificate.ts
│   │   └── contact.ts
│   ├── seo/
│   │   └── metadata.ts
│   ├── email/
│   │   └── sendContactEmail.ts
│   └── utils.ts
│
├── data/
│   └── static.ts
│
├── types/
│   ├── database.ts
│   ├── product.ts
│   ├── gallery.ts
│   ├── certificate.ts
│   └── company.ts
│
├── public/
│   ├── icons/
│   └── brand/
│
├── styles/
│   └── globals.css
│
├── supabase/
│   ├── migrations/
│   └── seed.sql
│
├── middleware.ts
├── next.config.ts
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── .env.local.example
└── README.md
```

---

# 5. Design System — Establish This BEFORE Building Pages

Do not design page-by-page independently.

Create a single visual system first.

## Brand direction

Position the company as:
- Established
- Technical
- Reliable
- Industrial
- Professional
- Safety-conscious
- B2B
- High quality

Avoid:
- Generic startup gradients
- Excessive animation
- Huge rounded cards everywhere
- Overly playful typography
- Template-looking sections
- Clutter
- Low-information hero sections

The website should look like a credible electrical engineering / industrial solutions company.

## Typography

Pick:
- One highly legible primary sans-serif
- One optional display/heading weight family

Use a strict type scale.

Example:
- Display
- H1
- H2
- H3
- Body Large
- Body
- Small
- Caption

Never invent font sizes independently for each section.

## Spacing

Define spacing tokens:
- 4
- 8
- 12
- 16
- 24
- 32
- 48
- 64
- 80
- 96

Use these consistently.

## Layout

Use:
- Responsive max-width container
- Consistent page gutters
- Predictable section spacing
- Consistent card padding
- Consistent grid gaps

## Components

The same:
- buttons
- cards
- headings
- badges
- form controls
- navigation
- breadcrumbs
- modals

must look identical throughout the application.

---

# 6. Public Website Information Architecture

## Home

The home page is not a placeholder. It is the primary landing page described in **Section 0B — Final Home Page / Landing Page Design** and must be implemented as a polished production page.

Its content must be data-driven, while its visual design and layout remain controlled by reusable code/components.

The final page must contain the approved hero, trust strip, product categories, featured products, company introduction, industries, reasons to choose the company, verified partnerships/brands, certificates preview, gallery preview, enquiry CTA and footer.

The hero must answer:
- What does the company do?
- What products/solutions does it provide?
- Where does it operate?
- Why should a buyer trust it?
- What should the visitor do next?

Primary CTA:
- Enquire Now / Contact Us

Secondary CTA:
- Explore Products

## About

Sections:
- Company overview
- History / timeline
- Founder / leadership
- Capabilities
- Industries served
- Locations
- Trust indicators
- CTA

Do not repeat the same paragraph several times.

## Products

Main page:
- Category navigation
- Search
- Filters if product volume justifies them
- Product grids
- CTA

Product detail:
- Product name
- Brand
- Category
- Main image
- Image gallery
- Description
- Technical/specification content if available
- Datasheet/download if available
- Enquiry CTA
- Related products

## Gallery

Use:
- categories
- responsive image grid
- lightbox
- proper captions where useful

Avoid loading every original image at full resolution.

## Certificates

Each certificate:
- Title
- Issuing organization
- Date / validity if available
- Preview
- Full image or PDF
- Optional download

## Contact

Include:
- contact form
- direct phone links
- email link
- office cards
- hours
- map/location links
- clear enquiry CTA

Contact form should be anti-spam protected.

---

# 7. Supabase Data Model

Start simple and keep the schema normalized.

## profiles

```text
id
email
full_name
role
created_at
updated_at
```

Roles:
- admin
- editor (optional future role)

For a single-client launch, `admin` is enough.

## categories

```text
id
name
slug
description
image_url
sort_order
is_active
created_at
updated_at
```

## products

```text
id
category_id
name
slug
short_description
description
brand
sku
featured
is_active
sort_order
created_at
updated_at
```

Do NOT make fields mandatory unless the business actually needs them.

## product_images

```text
id
product_id
storage_path
alt_text
sort_order
is_primary
created_at
```

## gallery_items

```text
id
title
description
category
storage_path
alt_text
sort_order
is_active
created_at
updated_at
```

## certificates

```text
id
title
issuer
description
image_path
document_path
valid_from
valid_until
sort_order
is_active
created_at
updated_at
```

## company_settings

A singleton row.

```text
id
company_name
tagline
email
primary_phone
secondary_phone
whatsapp
office_hours
about_short
about_long
updated_at
```

## offices

```text
id
name
address
city
state
postal_code
phone
email
latitude
longitude
map_url
sort_order
is_active
```

## contact_submissions

```text
id
name
email
phone
company
subject
message
status
created_at
```

Statuses:
- new
- read
- replied
- archived

## site_settings

For lightweight global configuration:

```text
id
setting_key
setting_value
```

Use cautiously. Do not turn this into an unstructured database.

---

# 8. Authentication

Authentication is required only for the administrative application.

## Public site

No login required.

Visitors can:
- browse products
- view images
- view certificates
- submit contact forms

## Admin

Use Supabase Auth.

Recommended initial setup:
- Email + password
- One admin account
- Email confirmation
- Secure session cookies
- Protected `/admin/*`
- Middleware/session validation

Do NOT create public user registration.

The website does not need customer accounts unless a future requirement appears.

## Authorization

The application must enforce:
- unauthenticated users cannot enter admin screens
- authenticated non-admins cannot perform admin operations
- database RLS must enforce the same rules even if someone bypasses the frontend

Never rely only on hiding an admin button.

---

# 9. Supabase Row Level Security

Enable RLS on all tables containing application data.

Recommended policy model:

### Public reads

Allow anonymous/public read access only for records explicitly marked active/public.

Examples:
- active products
- active categories
- active gallery items
- active certificates
- public company settings

### Admin writes

Only admin users may:
- insert
- update
- delete
- upload/manage corresponding records

### Contact submissions

Anonymous visitors may:
- INSERT contact submission

Anonymous visitors must NOT:
- SELECT submissions
- UPDATE submissions
- DELETE submissions

Admin can:
- SELECT
- UPDATE status
- archive/delete if required

Storage buckets must use similarly restrictive policies.

---

# 10. Supabase Storage Design

Create separate buckets:

```text
product-images
gallery-images
certificate-files
site-assets
```

Rules:
- public read for public website assets when appropriate
- authenticated/admin write
- authenticated/admin delete
- validate MIME type
- validate file size
- generate safe file paths
- avoid user-controlled arbitrary paths

Suggested naming:

```text
products/{productId}/{uuid}.webp
gallery/{uuid}.webp
certificates/{certificateId}/{uuid}.webp
certificates/{certificateId}/{uuid}.pdf
```

Do not put everything into one giant folder.

---

# 11. Media/Image Rules

The admin uploader should automatically:
- validate type
- validate dimensions when appropriate
- reject oversized files
- generate reasonable image variants when needed
- preserve original PDFs
- save alt text
- show upload progress
- show preview
- support replace/delete

Preferred web image formats:
- WebP
- AVIF where practical

Do not force the client to optimize images manually.

---

# 12. Admin Panel — UX Plan

The admin panel should feel like a polished business application, not a developer dashboard.

## Overall layout

Desktop:

```text
+-------------------------------------------------------+
| Logo | Search | Notifications | Admin | Avatar      |
+----------+--------------------------------------------+
| Sidebar  |                                            |
|          |         Main Content Area                   |
| Dashboard|                                            |
| Products |                                            |
| Categories                                           |
| Gallery  |                                            |
| Certificates                                        |
| Company  |                                            |
| Contact  |                                            |
| Media    |                                            |
| Settings |                                            |
+----------+--------------------------------------------+
```

Mobile:
- compact top bar
- slide-out sidebar
- touch-friendly actions
- no wide desktop tables forced onto mobile

## Dashboard

Show:
- total products
- active products
- gallery count
- certificate count
- unread enquiries
- recently updated content
- quick actions

Quick actions:
- Add Product
- Add Gallery Image
- Add Certificate
- View Enquiries

Do not fill the dashboard with meaningless analytics.

## Products admin

Features:
- search
- category filter
- status filter
- featured filter
- pagination
- sort
- create
- edit
- duplicate
- archive
- restore
- delete with confirmation

Product editor sections:

### Basic Information
- name
- category
- brand
- SKU
- short description

### Content
- long description
- specifications

### Media
- main image
- additional images
- drag-and-drop reordering

### Visibility
- active
- featured
- sort order

### SEO
- SEO title
- meta description
- optional social image

Do not expose unnecessary technical database fields to the client.

## Gallery admin

- upload multiple images
- drag-and-drop
- reorder
- captions
- categories
- bulk delete
- publish/unpublish

## Certificates admin

- title
- issuer
- date/validity
- preview image
- PDF
- active/inactive
- ordering

## Company settings

One clean form:
- business name
- tagline
- description
- phones
- email
- WhatsApp
- office hours
- address
- social links

Separate office records when multiple branches exist.

## Contact submissions

Table:
- Name
- Company
- Phone
- Email
- Date
- Status

Actions:
- view
- mark read
- mark replied
- archive
- click-to-call
- click-to-email

Never expose this data publicly.

---

# 13. Admin Form Quality

Every admin form must have:
- labels
- placeholders only when helpful
- required/optional indication
- inline validation
- useful error messages
- unsaved-change warning where appropriate
- disabled submit state during save
- success feedback
- rollback/error handling
- confirmation for destructive actions

Example:

Bad:
> Error 400

Good:
> Product could not be saved. Please check that a product name and category are provided.

---

# 14. Website Components

Build reusable components, not page-specific clones.

Core shared components:

- Header
- Navbar
- Mobile menu
- Footer
- Container
- Section
- SectionHeading
- Button
- LinkButton
- Card
- Badge
- Breadcrumbs
- ImageGallery
- Modal
- ContactCTA
- LoadingState
- EmptyState
- ErrorState

Product-specific:
- ProductCard
- ProductGrid
- ProductFilters
- ProductSearch
- ProductDetail
- RelatedProducts

Admin-specific:
- Sidebar
- AdminHeader
- DataTable
- Pagination
- SearchInput
- FilterBar
- ImageUploader
- FormField
- ConfirmDialog
- Toast
- RichTextEditor
- EmptyState

Do not duplicate components just because two pages look similar.

---

# 15. Consistency Rules

Create reusable page patterns.

Every major public page should follow:

```text
Header
↓
Page Hero / Breadcrumb
↓
Main Content
↓
Relevant Supporting Content
↓
Contact CTA
↓
Footer
```

Cards must share:
- border treatment
- radius
- padding
- typography
- hover behavior
- image ratio

Buttons must share:
- height
- radius
- font weight
- icon spacing
- hover/focus states

Never make:
- one page use sharp cards
- another page use huge pills
- another page use random shadows

unless there is an intentional design reason.

---

# 16. Responsive Design

Design from mobile upward.

Breakpoints should be intentional, not based on random device names.

Test at minimum:
- 360px
- 390px
- 768px
- 1024px
- 1280px
- 1440px+

Check:
- navigation
- product grids
- tables
- image galleries
- forms
- admin panel
- typography
- buttons
- spacing

No horizontal scrolling on normal pages.

---

# 17. Accessibility

Target WCAG 2.2 AA as the working standard.

Implement:
- semantic HTML
- keyboard navigation
- visible focus states
- proper labels
- accessible buttons
- alt text
- sufficient contrast
- reduced-motion support
- logical heading order
- modal focus management

Do not use images of text where real text should exist.

---

# 18. SEO

Every public route should have:
- page title
- meta description
- canonical URL
- Open Graph metadata
- Twitter/social metadata where useful
- semantic headings

Generate:
- sitemap.xml
- robots.txt
- favicon
- structured data where appropriate

Useful structured data:
- Organization
- LocalBusiness where accurate
- Product where appropriate
- BreadcrumbList

Each product should get a stable:
```text
/products/{slug}
```

Do not use IDs in public URLs if a meaningful slug is available.

---

# 19. Search

Only build advanced product search if the number of products justifies it.

Initial version:
- search by product name
- filter by category
- filter by brand when useful

Search should be:
- fast
- case-insensitive
- mobile-friendly

Avoid overengineering search infrastructure prematurely.

---

# 20. Contact Form

Fields:

- name
- company
- email
- phone
- subject
- message

Flow:

```text
Visitor
  |
  v
Contact Form
  |
  v
Validation
  |
  v
Server endpoint
  |
  +--> Save submission in Supabase
  |
  +--> Send notification email
  |
  v
Success response
```

Security:
- server-side validation
- rate limiting
- anti-spam protection
- honeypot and/or CAPTCHA where appropriate
- never trust client-provided values

Do not send email directly from browser code using secret credentials.

---

# 21. Content Migration Workflow

Before rebuilding content:

1. Inventory all current pages.
2. Inventory all images.
3. Inventory all products.
4. Inventory certificates.
5. Inventory company/contact information.
6. Identify duplicate/outdated content.
7. Confirm correct phone numbers, email, addresses and office hours with client.
8. Ask the client for the original high-resolution logo and brand assets.
9. Ask for product datasheets/specifications that should be publicly shown.
10. Confirm which products are currently active.

Create a migration sheet:

```text
Content Type | Old Source | New Location | Verified | Notes
```

Do not publish unverified business information.

---

# 22. Professional Content Strategy

Do not carry old grammar/copy errors into the new website.

Examples of the current site's dated/incorrect wording should be rewritten during content migration.

Use:
- concise B2B language
- clear value propositions
- technically accurate product descriptions
- benefit-oriented headings
- strong calls to action
- evidence/trust where available

Never invent:
- certifications
- authorized partnerships
- product specifications
- years of experience
- client logos
- industry claims

Only publish claims confirmed by the client.

---

# 23. Performance

Targets:
- fast first render
- optimized image delivery
- minimal JavaScript on static pages
- avoid unnecessary client components
- lazy-load below-the-fold images
- use Next.js image optimization where compatible
- keep third-party scripts minimal

Use Server Components by default.

Use Client Components only when interactive behavior requires them.

---

# 24. Security

Implement:
- secure authentication
- RLS
- server-side input validation
- file validation
- rate limiting on public write endpoints
- secure headers
- CSRF-aware design where applicable
- no secrets in client bundle
- environment variables for credentials
- least-privilege access

Never commit:
- Supabase service-role key
- email provider secret
- database password
- admin credentials

---

# 25. Environment Variables

Provide:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

EMAIL_PROVIDER_API_KEY=
CONTACT_RECEIVER_EMAIL=

NEXT_PUBLIC_SITE_URL=
```

Only public values may use `NEXT_PUBLIC_`.

The service-role key must never reach the browser.

---

# 26. Development Workflow

## Phase 1 — Discovery

- Audit current public site
- Collect content
- Collect original images/assets
- Confirm pages and navigation
- Confirm products/categories
- Confirm business claims

## Phase 2 — UX / Design System

- Define brand direction
- Choose typography
- Define color tokens
- Define spacing
- Define buttons/cards/forms
- Design header/footer
- Create wireframes

Do this before implementing every page.

## Phase 3 — App Foundation

- Create Next.js app
- Add TypeScript
- Add Tailwind
- Add linting/formatting
- Set folder structure
- Configure environment variables
- Establish shared UI primitives

## Phase 4 — Supabase

- Create project
- Configure database
- Create migrations
- Enable RLS
- Create storage buckets
- Configure Auth
- Create admin user
- Test policies

## Phase 5 — Public Site

Build in this order:

1. layout
2. header/nav
3. footer
4. home
5. products
6. product detail
7. about
8. gallery
9. certificates
10. contact

## Phase 6 — Admin

Build in this order:

1. admin login
2. admin shell/sidebar
3. dashboard
4. categories
5. products
6. media upload
7. gallery
8. certificates
9. company settings
10. contact submissions
11. user/role management if needed

## Phase 7 — Integration

- Connect all public content to Supabase
- Remove placeholder arrays
- Test CRUD operations
- Test storage
- Test authentication
- Test RLS
- Test contact form

## Phase 8 — Polish

- Responsive pass
- Accessibility pass
- SEO pass
- Performance pass
- Error states
- Empty states
- Loading states
- Animation refinement

## Phase 9 — Production

- Production environment variables
- Supabase production project
- Hostinger deployment
- Domain/DNS configuration
- HTTPS
- Search Console
- Analytics
- Backups
- Final QA

---

# 27. Testing Checklist

## Public site

Test:
- every route
- navigation
- mobile menu
- product browsing
- product details
- gallery
- certificates
- contact form
- phone links
- email links
- maps
- 404
- loading/error states

## Admin

Test:
- login
- logout
- session expiry
- unauthorized access
- create
- update
- archive
- delete
- image upload
- image replacement
- drag ordering
- validation
- error handling

## Security

Verify:
- public users cannot read private admin data
- public users cannot access contact submissions
- non-admin users cannot modify content
- service-role secrets are never client-exposed

---

# 28. Deployment Strategy

Prefer a staging environment before production.

```text
Developer
   |
   v
Git repository
   |
   +--> Staging
   |
   +--> Production
```

Use:
- development Supabase project
- production Supabase project

Do not test destructive database migrations directly against production.

Deployment checklist:
- build succeeds
- environment variables configured
- database migrations applied
- storage buckets configured
- admin login tested
- contact email tested
- domain connected
- HTTPS verified

---

# 29. Backups

Have a recovery plan for:
- database
- uploaded media
- important certificates

At minimum:
- Supabase database backups
- source code in Git
- periodic export/archive of business-critical files

Do not rely on a single copy of certificate PDFs or original business imagery.

---

# 30. Definition of Done

The project is not finished merely because the pages render.

It is finished when:

### Public
- looks professional on desktop and mobile
- consistent design system
- all primary pages complete
- products are dynamic
- gallery is dynamic
- certificates are dynamic
- contact flow works
- SEO foundation exists
- accessibility baseline passes

### Admin
- client can log in
- client can add/edit/delete products
- client can upload/reorder images
- client can manage gallery
- client can manage certificates
- client can update contact/company information
- client can view/manage enquiries
- client does not need a developer for routine content changes

### Technical
- no Wix dependency
- no WordPress dependency
- no PHP dependency
- no hard-coded catalog data
- secure RLS
- secrets protected
- production deployment reproducible
- backups/recovery understood

---

# 30A. Navigation & Home Page Acceptance Criteria

Before the first production release, explicitly verify:

- `Home` opens `/` and the home page is fully designed and populated.
- `About Us` opens `/about`.
- `Our Product` opens `/products`.
- The `Our Product` dropdown is populated from active Supabase categories.
- Each category in the dropdown links to the correct category route.
- `Gallery` opens `/gallery`.
- `Certificate` opens `/certificates`.
- `Contact Us` opens `/contact`.
- Active navigation state works on direct visits and nested product routes.
- Desktop and mobile navigation both work with keyboard and touch.
- Mobile menu can be opened, closed, and escaped without trapping the user.
- Browser refresh on every public route works correctly in production.
- No header link points to an old `.php` URL.
- No public header content is duplicated in multiple page files.
- Product/category changes made from `/admin` are reflected in public navigation without source-code changes.
- Home page featured products update when the admin changes `featured` status.
- Home page category cards update when categories are added, edited, reordered or deactivated.
- Home page gallery/certificate previews update from active records.
- Company phone, email and office information used by the header/footer/CTA come from managed settings.


# 31. Master Prompt for an AI Coding Agent

Use the following as the primary project prompt after the repository has been initialized:

> You are the lead engineer and product designer for a professional B2B industrial electrical equipment website for Power Equipments.
>
> Build the application from scratch using Next.js, TypeScript, Tailwind CSS and Supabase.
>
> Treat the existing website only as a content/reference source. Do not reproduce its old architecture, PHP implementation, page-builder assumptions, or visual design.
>
> The goal is a polished, modern, trustworthy industrial/B2B website that looks substantially more professional than the current site.
>
> The final system must contain:
>
> 1. A public website with a fully designed Home landing page, About, Products, Product Detail, Gallery, Certificates, Contact and Search where justified.
> 2. A fully functional shared header matching the required navigation model: Home, About Us, Our Product dropdown, Gallery, Certificate, Contact Us.
> 3. A dynamic `Our Product` dropdown driven by active Supabase categories rather than hard-coded menu items.
> 4. A secure `/admin` application for a non-technical business owner.
> 5. Supabase PostgreSQL for structured content.
> 6. Supabase Storage for product/gallery/certificate files.
> 7. Supabase Auth for admin authentication.
> 8. Supabase Row Level Security for every database table that requires protection.
> 9. Server-side validation for every mutation.
> 10. A secure contact form that stores enquiries and sends notification email.
> 11. Responsive design for mobile, tablet and desktop.
> 12. A reusable design system and shared components so every page remains visually consistent.
>
> Do not hard-code products, gallery items, certificates or company contact data in page components.
>
> Build content models and admin CRUD interfaces so a non-engineer can maintain the site without editing source code.
>
> Use Server Components by default. Introduce Client Components only where interaction requires them.
>
> Prioritize:
> - visual hierarchy
> - typography
> - whitespace
> - strong grid/layout
> - premium industrial aesthetic
> - accessibility
> - fast loading
> - image optimization
> - SEO
> - maintainability
>
> Do not overuse animations or visual effects.
>
> Do not invent company facts, certifications, customers, product specs, authorized partnerships or statistics. Mark missing information as content that needs client confirmation.
>
> Build the project in phases:
> 1. repository and application foundation
> 2. design system
> 3. Supabase schema and RLS
> 4. public layout/components
> 5. public pages
> 6. admin authentication and shell
> 7. admin CRUD
> 8. media management
> 9. contact workflow
> 10. SEO/accessibility/performance
> 11. testing
> 12. production deployment
>
> Before implementing a new major feature, inspect the existing project structure and reuse established patterns rather than creating competing abstractions.
>
> Never place business-critical secrets in the client bundle.
>
> Never bypass RLS from browser code.
>
> Validate every user-controlled value on the server.
>
> Every destructive admin action must require confirmation.
>
> Every admin form must provide validation, loading, success and error states.
>
> Every public page should have meaningful metadata.
>
> Every image shown on the public site should have appropriate alt text or be explicitly decorative.
>
> Use semantic HTML and keyboard-accessible controls.
>
> Test both desktop and mobile layouts before considering a page complete.
>
> Keep the implementation simple enough that another engineer can understand it quickly.
>
> When making architectural decisions, optimize for long-term maintainability over short-term shortcuts.

---

# 32. Recommended Order of Actual Work

Do not ask the AI agent to generate the entire finished website in one shot.

Use this sequence:

```text
STEP 1
Requirements + content inventory

STEP 2
Design system

STEP 3
Next.js foundation

STEP 4
Supabase setup + schema + RLS

STEP 5
Header + footer + shared components

STEP 6
Home

STEP 7
Products + product detail

STEP 8
About

STEP 9
Gallery

STEP 10
Certificates

STEP 11
Contact + email workflow

STEP 12
Admin authentication

STEP 13
Admin dashboard

STEP 14
Admin products

STEP 15
Admin media/gallery

STEP 16
Admin certificates

STEP 17
Company/contact settings

STEP 18
SEO

STEP 19
Accessibility

STEP 20
Performance

STEP 21
Security review

STEP 22
Production deployment

STEP 23
Client acceptance + training
```

Do not move to the next phase until the current phase is stable.

---

# 33. First Milestone

The first meaningful milestone should NOT be "finish the whole website."

It should be:

```text
Next.js app running
+
design system established
+
Supabase connected
+
admin login working
+
products CRUD working
+
one public product page reading live Supabase data
```

Once that pipeline works:

```text
Admin
  ↓
Create Product
  ↓
Supabase
  ↓
Public Website
  ↓
Product appears
```

the core architecture is proven.

Everything else becomes controlled expansion instead of guesswork.

---

# 34. Important Principle

The website should have two layers:

## Code owns
- design
- layout
- navigation
- behavior
- security
- SEO
- reusable components
- business logic

## Client-owned content
- products
- images
- certificates
- gallery
- company details
- contact details
- descriptions

That separation is what makes this a maintainable professional website rather than another site where every content change requires a developer.
