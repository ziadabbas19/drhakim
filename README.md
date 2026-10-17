# Dr. Abdelhakim Abdelsalam — ENT Surgeon Website

Arabic (RTL) portfolio and appointment booking website for د. عبد الحكيم عبد السلام, with a private dashboard for managing clinics, schedules, days off, services, contact settings, bookings, and the team.

- `backend/` — Node.js, Express, PostgreSQL (Sequelize), Joi, JWT
- `frontend/` — React (Vite), React Router, Tailwind CSS, Joi

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
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE USER dr_hakim WITH PASSWORD 'choose-a-password';" -c "CREATE DATABASE dr_hakim OWNER dr_hakim;"
```

You can also create the database from pgAdmin: right-click **Databases → Create → Database…** and name it `dr_hakim`.

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

## 4. First login

The dashboard has no public link. Open <http://localhost:5173/login> and sign in with one of the `OWNER_EMAILS` and `OWNER_INITIAL_PASSWORD`. You will be asked to choose a new password before the dashboard opens; a **لوحة التحكم** item then appears in the navbar.

After the first login:

1. **فريق العمل** — set each owner's full name and add the assistant's account.
2. **إعدادات التواصل** — enter the real phone number, WhatsApp number, and social links.
3. **العيادات والمواعيد** — confirm clinic addresses, phone numbers, map links, and weekly schedules.

The seeded clinic details, phone numbers, and WhatsApp number are sample values. The doctor's bio, qualifications, statistics, and testimonials in `frontend/src/config/content.js` are also sample text and must be reviewed with the doctor before launch.

## Environment variables

### backend/.env

| Variable | Description | Default |
| --- | --- | --- |
| `NODE_ENV` | `development`, `production`, or `test` | `development` |
| `PORT` | API port | `5000` |
| `CLIENT_ORIGIN` | Allowed frontend origins, comma-separated | `http://localhost:5173` |
| `TRUST_PROXY` | Number of reverse proxies in front of the API | `0` |
| `BOOKING_RATE_LIMIT_PER_HOUR` | Successful public bookings allowed per IP per hour | `10` |
| `DATABASE_URL` | Full connection string; overrides the `DB_*` values | empty |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Database connection | `localhost`, `5432`, `dr_hakim`, `postgres`, empty |
| `DB_SSL` | Use TLS for hosted databases (certificates are verified) | `false` |
| `DB_LOGGING` | Print SQL queries | `false` |
| `JWT_SECRET` | Token signing secret (32+ characters) | required |
| `JWT_EXPIRES_IN` | Session lifetime; active sessions are renewed automatically | `2h` |
| `OWNER_EMAILS` | Owner accounts created by the seed, comma-separated | empty |
| `OWNER_INITIAL_PASSWORD` | Temporary password for new owner accounts | empty |

### frontend/.env

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_URL` | API base URL | `/api` |
| `VITE_PROXY_TARGET` | Backend address used by the dev server proxy | `http://localhost:5000` |
| `VITE_SITE_URL` | Public site URL for canonical and Open Graph links | `http://localhost:5173` |

## Scripts

| Where | Script | Purpose |
| --- | --- | --- |
| root | `npm run install:all` | Install root, backend, and frontend dependencies |
| root | `npm run dev` | Run API and website together |
| backend | `npm run dev` | Run the API with auto-restart |
| backend | `npm start` | Run the API in production mode |
| backend | `npm run migrate` / `npm run migrate:undo` | Apply / revert the latest migration |
| backend | `npm run seed` | Create owner accounts, the El-Santa and Cairo clinics, services, and settings. Safe to run again: existing data is kept |
| frontend | `npm run build` | Build the website into `frontend/dist` |

## Roles and permissions

Roles are `owner` (full access) and `staff` (the assistant: bookings, and read-only clinics, schedules, and days off). To change what a role can do, edit the map in `backend/src/config/permissions.js`; the dashboard receives each user's permissions from the API, so no frontend change is needed.

## Deployment notes

- Build the website with `npm run build` and serve `frontend/dist` from any static host, redirecting unknown paths to `index.html`. Set `VITE_API_URL` and `VITE_SITE_URL` before building.
- Run the API with `NODE_ENV=production`, set `CLIENT_ORIGIN` to the website address, `TRUST_PROXY` to the number of proxies in front of it, and `DB_SSL=true` for hosted databases. If your provider uses a self-signed certificate, put the connection string in `DATABASE_URL` with `?sslmode=no-verify` instead.
- Changing or resetting a password signs that account out of every other device.
- All dates and times are handled in the `Africa/Cairo` time zone.
