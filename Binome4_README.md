# Binôme 4 - Engagement & Automation

## Implemented Features

### Backend API (Node.js + Knex + PostgreSQL)

**Endpoints:**
- `POST /api/webinars` - Create webinar (recruiter auth required)
  - Body: `{title, description, scheduled_at, ...}`
  - Generates slug automatically
  - Creates audit log

- `POST /api/webinars/:id/register` - Register for webinar (public)
  - Body: `{email, first_name, last_name, phone?, company?}`
  - Sends confirmation email
  - Updates `registered_count`
  - Prevents duplicates by email

- `GET /api/analytics/webinar/:id` - Get stats (host auth)
  - Returns: `{total_registered, total_attended, attendance_rate, status_breakdown}`

**Automation:**
- **Email Service** (`/utils/email.js`): Nodemailer + EJS templates
  - `webinar-confirmation`
  - `webinar-reminder-24h`, `webinar-reminder-1h`

- **Cron Jobs** (`/utils/cron.js`): node-cron
  - 24h reminders (9 AM daily)
  - 1h reminders 
  - Auto no-show cleanup (2 AM daily)
  - Import `initCronJobs()` in index.js

**Database:**
- Tables `webinars` & `webinar_registrations` (migrations 005, 006)
- Counters, statuses, indexes optimized

### Frontend (Vue 3 + Pinia)
- **Services** (`webinars.service.js`):
  - `createWebinar()`, `registerForWebinar()`, `getWebinarStats()`, `getUpcomingWebinars()`

- **Store** (`stores/webinars.js`):
  - Reactive state for webinars, stats, loading
  - Actions for all API calls
  - Computed `attendanceRate`

## Usage

1. **Run Backend:**
   ```bash
   cd backend
   npm install
   npx knex migrate:latest
   node src/index.js
   ```

2. **Test Endpoints:**
   ```bash
   # Create webinar (with JWT)
   curl -X POST /api/webinars -H "Authorization: Bearer <token>" -d '{"title":"Test Webinar","scheduled_at":"2024-04-01T14:00:00Z"}'

   # Register
   curl -X POST /api/webinars/<id>/register -d '{"email":"test@example.com","first_name":"John"}'

   # Stats
   curl /api/analytics/webinar/<id> -H "Authorization: Bearer <token>"
   ```

3. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Cron:** Automatically runs on backend start

## Dependencies Added (run npm i):
```
nodemailer ejs node-cron crypto
```

**No shared files modified. Ready for team integration!** 🚀

