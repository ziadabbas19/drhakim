# Dr. Abdelhakim Abdelsalam — ENT Surgeon Website

Portfolio and appointment booking website for د. عبد الحكيم عبد السلام, in Arabic (default, right to left) and English, with light and dark themes. A private dashboard manages clinics, schedules, days off, services, the About page, the media library, contact settings, bookings, patient reviews, and the team.

- `backend/` — Node.js, Express, PostgreSQL (Sequelize), Joi, JWT, sharp
- `frontend/` — React (Vite), React Router, Tailwind CSS, Joi
- `e2e/` — browser tests (Playwright)

## Requirements

- Node.js 24 LTS
- PostgreSQL 14 or newer

## 1. Create the database (Windows)

Install PostgreSQL from <https://www.postgresql.org/download/windows/> and remember the password you set for the `postgres` user. Then open PowerShell and run (adjust `18` to your installed version):

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE dr_hakim;"
```

To use a dedicated database user instead of `postgres`:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE USER dr_hakim WITH PASSWORD 'choose-a-password' CREATEDB;" -c "CREATE DATABASE dr_hakim OWNER dr_hakim;"
```

`CREATEDB` lets the automated tests create their own database (see [Tests](#tests)). You can also create the database from pgAdmin: right-click **Databases → Create → Database…** and name it `dr_hakim`.

## 2. Configure environment variables

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

Edit `backend\.env`:

- `DB_PASSWORD` (and `DB_USER` if you created a dedicated user)
- `JWT_SECRET`: create one with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
- `OWNER_EMAILS`: the doctor's email and the developer's email, comma-separated
- `OWNER_INITIAL_PASSWORD`: temporary password for those accounts (at least 8 characters)

For local development, images are stored on disk (`STORAGE_PROVIDER=local`). For production, see [Images and Cloudinary](#images-and-cloudinary).

## 3. Install, migrate, seed, run

From the project root:

```powershell
npm run install:all
npm run migrate
npm run seed
npm run dev
```

Or run each app in its own terminal, starting from the project root:

```powershell
# Terminal 1
cd backend; npm install; npm run migrate; npm run seed; npm run dev

# Terminal 2
cd frontend; npm install; npm run dev
```

- Website: <http://localhost:5173>
- API: <http://localhost:5000/api>

`npm run migrate` applies every pending migration. On an existing database, the bilingual migration keeps all current text as the Arabic version and leaves English empty (the site shows Arabic until English is added). Running `npm run seed` again adds English text to seeded rows whose Arabic text is unchanged, without touching anything you have edited. The reviews migration removes the old testimonial items from the About page; patient reviews now have their own section (see [Patient reviews](#patient-reviews)).

Earlier versions seeded invented sample content (statistics, a career history, qualifications, services, clinic addresses and hours, phone numbers). The `replace-sample-content` migration replaces it on a database that was already seeded, and only where nobody edited it:

- a sample service or About item is deleted while its text is exactly the sample text and no photo was added to it; the confirmed items are then added, unless one with the same title is already there;
- a setting, or a clinic's name, city, address, phone, or map link, is replaced while it still holds the sample value;
- a clinic's weekly hours are removed while they are exactly the sample hours. Bookings are never changed: if patients booked against the sample hours, they appear in the dashboard as bookings outside the working hours once real hours are saved.

Anything you changed is kept as it is. The migration cannot be undone (the sample content is not restored).

## 4. First login

The dashboard has no public link. Open <http://localhost:5173/login> and sign in with one of the `OWNER_EMAILS` and `OWNER_INITIAL_PASSWORD`. You will be asked to choose a new password before the dashboard opens; a **لوحة التحكم** item then appears in the navbar.

After the first login:

1. **فريق العمل** — set each owner's full name and add the assistant's account.
2. **إعدادات التواصل** — the phone and WhatsApp number start as 01050066077; add the email, social links, and a note for patients if wanted.
3. **العيادات والمواعيد** — add each clinic's weekly hours and visit length, check the map links, and add clinic photos. Until a clinic has hours, its card shows **اتصل للحجز** (call to book), and while no clinic has hours the booking page asks patients to call or message on WhatsApp.
4. **مكتبة الصور** — add the doctor's photos with `npm run import:images` (see [Importing the doctor's photos](#importing-the-doctors-photos)) or upload them here, and give each one alt text.
5. **صفحة التعريف** — review the biography, qualifications, career, and memberships, and add statistics only if the doctor provides real ones.

The seed contains only details the doctor has confirmed (`backend/src/seeders/content.js` and `frontend/src/config/content.js`); everything else starts empty, see [Information still needed](#information-still-needed). The site starts with no patient reviews: real patients add them from the site, and each one appears only after it is approved under **التقييمات** (see [Patient reviews](#patient-reviews)).

## Languages, themes, and motion

- **Languages.** The switch in the navbar toggles Arabic (default) and English and is remembered on the device. It sets `<html lang dir>`, the page title, and the description and social tags. All interface text lives in `frontend/src/i18n/ar.js` and `frontend/src/i18n/en.js`, which share the same keys (`npm test --prefix frontend` checks this). Static content that is not managed from the dashboard (the doctor's name and title, home page highlights, the Sheikh Zayed Specialized Hospital evening clinic, booking notes) is in `frontend/src/config/content.js`.
- **Bilingual content.** Clinics, services, contact notes, the About page, and image alt text have Arabic and English versions, edited side by side in the dashboard. Arabic is required, English is optional and falls back to Arabic when empty. The API returns one language for public requests (`?lang=ar|en` or the `Accept-Language` header, Arabic by default) and both languages to the dashboard. API messages, including validation errors, also follow the requested language.
- **Themes.** The navbar switch offers light, dark, and "match device" (the default). Colors are defined only in `frontend/src/styles/tokens.css`, once per theme; components use the token names (`bg-surface`, `text-ink-muted`, …). The logo's gold is the `accent` token, used only for thin decorative lines (under section labels and around the logo tile), never for text or buttons. The saved theme and language are applied by a small script in the page head before anything is drawn, so there is no flash.
- **Motion.** Section reveals, staggered cards, page transitions, dialogs, and hover and press feedback all come from `frontend/src/styles/motion.css` and the components in `frontend/src/motion/`. Only `transform` and `opacity` are animated, sideways movement follows the reading direction, and everything is switched off for visitors who prefer reduced motion.

## Images and Cloudinary

Every image goes through the dashboard's **مكتبة الصور** (media library): JPEG, PNG, or WebP only, checked by their actual content, up to `MAX_UPLOAD_MB` each. Uploads are rotated upright, stripped of metadata (including location), resized to at most 2000 px, converted to WebP, and given smaller copies for responsive images and a blurred placeholder. Any image field in the dashboard (clinic cover and photos, service image, home page image, portrait, About page photos, surgery photos) can pick from the library or upload on the spot. An image still used on the site is deleted only after a second confirmation that lists where it appears.

Storage is chosen with `STORAGE_PROVIDER`:

- `local` (development): files are written to `UPLOADS_DIR` and served by the API at `/uploads`. The Vite dev server proxies `/uploads` to the API.
- `cloudinary` (production): files are stored on Cloudinary and smaller sizes are generated by Cloudinary's image URLs.

To set up Cloudinary:

1. Create a free account at <https://cloudinary.com> and open the **Dashboard** (or **Settings → API Keys**).
2. Copy the **Cloud name**, **API key**, and **API secret** into `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` on the production API, and set `STORAGE_PROVIDER=cloudinary`. `CLOUDINARY_FOLDER` (default `dr-hakim`) groups the files.
3. Restart the API. The API refuses to start with `STORAGE_PROVIDER=cloudinary` if any of the three values is missing.

Each image remembers where it was stored, so images uploaded during development are not moved to Cloudinary automatically; upload the real photos from the production dashboard, or run the photo import with the production settings.

## Logo and icons

`npm run build:icons` (from the project root) makes the brand images from `images-source/logo.png`; its outputs are committed, so it only needs to run again when the logo changes:

- `frontend/src/assets/logo.png`: the logo on a transparent background, cropped with a little padding, 1024 px wide (any white background is removed, with the white un-mixed from the soft edges so no light fringe is left), and `logo-mark.webp`, the size shown next to the doctor's name in the navbar and footer. In the dark theme and in the footer it sits on a light tile so the dark teal letters stay readable.
- `frontend/public/`: `favicon.ico` (16, 32, and 48 px), `favicon-32.png`, `favicon-192.png`, `favicon-512.png`, and `apple-touch-icon.png` (180 px, a full square, as iOS rounds the corners itself), each showing the logo on a light tile so it shows on dark browser tabs. At 16, 32, and 48 px the logo fills as much of the tile as it can and is lightly sharpened after scaling down.
- `frontend/public/site.webmanifest`, with the 192 and 512 px icons and the site name from `frontend/src/config/content.js`.
- `frontend/public/og-image.png` (1200 × 630), the image shown when the site is shared: the logo, the doctor's name, and "أخصائي أنف وأذن وحنجرة", in the brand colours and the Cairo font.

## Importing the doctor's photos

`npm run import:images` adds the doctor's photos from `images-source/` (at the project root, never committed) to the media library, through the storage configured in `backend/.env`, and shows each one in its place. JPEG, PNG, and WebP files are accepted, named as below with any of these extensions:

| File | Goes to |
| --- | --- |
| `portrait-ad` | Kept in the library as received (its poster text and the hospital logo are never shown). A cut-out of the doctor alone, on a transparent background, becomes the **home page image**. |
| `portrait-suit` | Cropped to the doctor (no channel logo or news ticker) and used as the **About page portrait**. |
| `surgery-1`, `surgery-endoscope` | One item each in the About page's **operating room** gallery. |
| `consented/*` | One **before and after** item each. Name each file after the procedure type (`ear-…`, `nose-…`, or `throat-…`); its title and alt text name the procedure type only. Only add photos whose patients gave written consent. |

Any other file in `images-source/` is not imported. Each photo is imported once: running the import again skips photos already in the library, so nothing is duplicated and later changes from the dashboard are kept. A home page image or portrait that was already chosen is kept too (the imported one is still added to the library). The script prints what it did for each file.

**The cut-out.** The background is removed once, at import time, by the IMG.LY background-removal model (`@imgly/background-removal-node`, a development dependency that only runs on the computer doing the import; note that it is licensed under the AGPL-3.0). The result is then cleaned up: only the largest shape is kept, its outline is smoothed and pulled slightly inwards, edge pixels take their colour from inside the shape (no light or dark halo in either theme), and the square runs from just above the head to just below the crossed arms, centred on the face. If the model cannot be loaded or the result does not look like one person, the doctor's part of the poster is used instead, in a rounded frame. On the site, a transparent image stands on a soft brand-coloured shape, and any other image is shown in a rounded frame, so the doctor can replace it from the dashboard with any photo.

**In production**, run the import from your computer with the production settings in `backend/.env` (`STORAGE_PROVIDER=cloudinary`, the three `CLOUDINARY_*` values, and the production `DATABASE_URL`, `DB_SSL`), after `npm run migrate` has been run on that database:

```powershell
npm run import:images
```

## Environment variables

### backend/.env

| Variable | Description | Default |
| --- | --- | --- |
| `NODE_ENV` | `development`, `production`, or `test` | `development` |
| `PORT` | API port | `5000` |
| `CLIENT_ORIGIN` | Allowed frontend origins, comma-separated | `http://localhost:5173` |
| `TRUST_PROXY` | Number of reverse proxies in front of the API | `0` |
| `API_RATE_LIMIT_PER_15_MIN` | Requests allowed per IP address every 15 minutes | `600` |
| `BOOKING_RATE_LIMIT_PER_HOUR` | Successful public bookings allowed per IP per hour | `10` |
| `REVIEW_RATE_LIMIT_PER_DAY` | Successful review submissions allowed per IP per day | `3` |
| `REVIEW_PENDING_CAP` | Most reviews waiting for approval at once; further submissions are refused politely | `200` |
| `DATABASE_URL` | Full connection string; overrides the `DB_*` values | empty |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Database connection | `localhost`, `5432`, `dr_hakim`, `postgres`, empty |
| `DB_SSL` | Use TLS for hosted databases (certificates are verified) | `false` |
| `DB_LOGGING` | Print SQL queries | `false` |
| `JWT_SECRET` | Token signing secret (32+ characters) | required |
| `JWT_EXPIRES_IN` | Session lifetime; active sessions are renewed automatically | `2h` |
| `OWNER_EMAILS` | Owner accounts created by the seed, comma-separated | empty |
| `OWNER_INITIAL_PASSWORD` | Temporary password for new owner accounts | empty |
| `STORAGE_PROVIDER` | `local` (development) or `cloudinary` (production) | `local` |
| `UPLOADS_DIR` | Folder for `local` image storage | `uploads` |
| `MAX_UPLOAD_MB` | Largest image accepted, per file, in megabytes | `5` |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary account, required with `cloudinary` | empty |
| `CLOUDINARY_FOLDER` | Cloudinary folder for the site's images | `dr-hakim` |
| `TEST_DATABASE_URL` | Database for the automated tests (name must end in `_test`) | `DB_NAME` + `_test` |

### frontend/.env

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_URL` | API base URL | `/api` |
| `VITE_PROXY_TARGET` | Backend address used by the dev server proxy for `/api` and `/uploads` | `http://localhost:5000` |
| `VITE_SITE_URL` | Public site URL for canonical and Open Graph links | `http://localhost:5173` |

## Scripts

| Where | Script | Purpose |
| --- | --- | --- |
| root | `npm run install:all` | Install root, backend, and frontend dependencies |
| root | `npm run dev` | Run API and website together |
| root | `npm test` | Run the API, frontend, and browser tests |
| root | `npm run test:e2e` | Run the browser tests only |
| root | `npm run import:images` | Add the doctor's photos from `images-source/` (see [Importing the doctor's photos](#importing-the-doctors-photos)) |
| root | `npm run build:icons` | Make the logo files, favicons, web manifest, and share image from `images-source/logo.png` (see [Logo and icons](#logo-and-icons)) |
| root | `npm run screenshots` | Save mobile and desktop screenshots in both themes and languages to `e2e/screenshots`, without and then with published reviews |
| backend | `npm run dev` | Run the API with auto-restart |
| backend | `npm start` | Run the API in production mode |
| backend | `npm run migrate` / `npm run migrate:undo` | Apply / revert the latest migration |
| backend | `npm run seed` | Create owner accounts and the confirmed clinics, services, settings, and About content. Safe to run again: existing data is kept |
| backend | `npm run import:images [folder]` | Add the doctor's photos to the media library (default folder: `images-source/`) |
| backend | `npm test` | Run the API tests |
| frontend | `npm run build` | Build the website into `frontend/dist` |
| frontend | `npm test` | Check the translation files and render the pages against simulated API replies |

## Tests

- **API tests** (`npm test --prefix backend`) start the API against a separate database, `DB_NAME` + `_test` (or `TEST_DATABASE_URL`), which is created automatically if your database user may create databases. Before each run it is rebuilt from the migrations, including rolling the latest migration back and forward again, and filled with the seeded content and two test accounts. They also check that none of the removed sample facts is left in the seeds, the site content, the translations, the page tags, or the structured data, that the sample-content migration keeps anything edited, and that the photo import can run twice without creating copies. The tests delete everything in that database and refuse to run against any database whose name does not end in `_test`, so your development data is never touched. Images go to a temporary folder, and Cloudinary is tested with a simulated server.
- **Frontend tests** (`npm test --prefix frontend`, Vitest) check that both translation files have the same keys and placeholders and that every key used in the code exists, and that the icons, manifest, and share image exist at their sizes and are linked from the page. They also render the site in a simulated browser with made-up API replies (empty content, missing lists, failed or malformed replies) to make sure a page never goes blank: missing content shows a short "will be added soon" message, and a part of a page that fails shows a message with a reload button while the rest of the page keeps working.
- **Browser tests** (`npm run test:e2e` from the root) build the website and run it against a fresh test database on ports 5055 (API) and 5175 (website). They first open the home and About pages exactly as `npm run seed` leaves them, then cover the language and theme switches, motion and reduced motion, the media library, the About page editing, submitting and moderating a review through to the home page, and automated color-contrast checks in both themes. Install the browser once with `npx playwright install chromium`.

## Roles and permissions

Roles are `owner` (full access) and `staff` (the assistant: bookings, and read-only clinics, schedules, and days off). Only owners manage the media library (`media:manage`), the About page content (`content:manage`), and patient reviews (`reviews:manage`). To change what a role can do, edit the map in `backend/src/config/permissions.js`; the dashboard receives each user's permissions from the API, so no frontend change is needed.

## Patient reviews

Visitors add a review from the **أضف تقييمك** button on the home and About pages: name, city, a rating from 1 to 5 stars, and an optional comment. **Every review is moderated before it is published**: it is saved as pending and appears on the site only after an owner approves it under **التقييمات** in the dashboard, where the menu shows how many are waiting.

- **Moderation.** Reviews can be published, rejected, hidden again, featured (featured reviews are shown first and on the home page), or deleted, one at a time or several together. The text is never edited: it is shown exactly as the patient wrote it, in whatever language they used. Each decision records who made it and when.
- **Privacy.** No email, phone number, or IP address is stored with a review. Names, cities, and comments are saved as plain text (any HTML or hidden characters are removed) and displayed as text only.
- **Spam protection.** Each IP address may send `REVIEW_RATE_LIMIT_PER_DAY` reviews per day (refused attempts are not counted), the same name and comment cannot be sent twice within 24 hours, a hidden field catches automated forms, and no more than `REVIEW_PENDING_CAP` reviews may wait for approval at once.
- **On the site.** The home page shows featured reviews (or the latest ones), and the About page lists every published review with **عرض المزيد**. The average rating and count, and the matching search engine data (`AggregateRating` and `Review`), appear only once at least one review is published. Until then a short message invites patients to add the first one.

## Patient photos

The About page has two photo lists: the operating room gallery and **قبل وبعد** (before and after). Both remind editors in the dashboard that patient photos need the patient's written consent and must not show the face or anything that identifies them.

## Information still needed

These details are not known yet, so they are left empty rather than invented. Add them from the dashboard once the doctor confirms them:

- each clinic's working days and hours, and its visit length (`العيادات والمواعيد`); until then patients are asked to call;
- years of experience, numbers of patients or operations, or any other statistics (`صفحة التعريف` → الإحصائيات); the statistics bar and the number on the home page stay hidden while the list is empty;
- the dates of each career step and the institution for the postgraduate studies (`صفحة التعريف`);
- the email address and social media links (`إعدادات التواصل`);
- clinic photos, and the photos for the About page gallery.

## Deployment notes

- Build the website with `npm run build` and serve `frontend/dist` from any static host, redirecting unknown paths to `index.html` (`frontend/public/_redirects` does this on Netlify). Set `VITE_API_URL` and `VITE_SITE_URL` before building.
- Run the API with `NODE_ENV=production`, set `CLIENT_ORIGIN` to the website address, `TRUST_PROXY` to the number of proxies in front of it, and `DB_SSL=true` for hosted databases. If your provider uses a self-signed certificate, put the connection string in `DATABASE_URL` with `?sslmode=no-verify` instead.
- **Use Cloudinary in production.** Most hosts (Render, Railway, Heroku, Fly.io, and similar) give the API a temporary disk that is wiped on every deploy or restart, so images stored with `STORAGE_PROVIDER=local` would disappear. Only use local storage in production with a persistent volume mounted at `UPLOADS_DIR`, and serve the website and API from the same origin (or proxy `/uploads`).
- Public content (`/api/about`, `/api/clinics`, `/api/services`, `/api/settings`, and published reviews at `/api/reviews`) is sent with `Cache-Control: public, max-age=0, must-revalidate, s-maxage=60` and an ETag: browsers always check for updates (cheaply, with a 304 when nothing changed), and a CDN may keep a copy for up to a minute. Availability, bookings, review submissions, sessions, and the dashboard are never cached. Approving a review may therefore take up to a minute to appear behind a CDN.
- Changing or resetting a password signs that account out of every other device.
- All dates and times are handled in the `Africa/Cairo` time zone.
