# FindBack — Lost & Found Frontend

A React + Vite + Tailwind CSS frontend for the `Lost-and-found-cloud-system`
Spring Cloud microservices backend (`eureka-server`, `config-server`,
`api-gateway`, `user-services`, `item-service`, `claim-service`).

## What's included

**Auth**
- Login (`/login`) and register (`/register`). New accounts are always
  created as role `user` by the backend — an admin promotes accounts from
  the Users screen.
- No JWT is issued by the backend, so the session (`id`, `email`, `role`)
  from `POST /auth/login` is kept in `localStorage` and attached to
  subsequent requests as query params / body fields where the backend
  expects them (e.g. `reportedByUserId`, `claimantUserId`).

**User dashboard** (`/app`)
- **Browse** — search + filter every item on the board by type
  (Lost/Found) and status (Open/Claimed/Closed); click a card to see full
  details and submit a claim.
- **Report item** — post a lost or found item, with an optional photo
  (uploaded as `multipart/form-data` to `item-service`, which stores it in
  GCS).
- **My items** — everything the signed-in user has reported; close or
  delete their own reports.
- **My claims** — every claim the user has submitted, with live status
  (Pending/Approved/Rejected) and the ability to withdraw a pending claim.

**Admin dashboard** (`/admin`, requires role `admin`)
- **Overview** — counts (users, open items, pending claims, total claims),
  latest reports, and claims that need review.
- **Users** — promote/demote between `user` and `admin`, or delete an
  account.
- **Items** — browse/filter every item, change its status, or delete it.
- **Claims** — approve or reject pending claims (`requestedByRole=admin`),
  or delete a claim record.

## Design

Warm paper background with a single indigo brand accent, `Space Grotesk`
for headings, `Inter` for body/UI, `JetBrains Mono` for IDs/timestamps.
Item cards use a "luggage tag" category badge and a dashed ticket-stub
divider as the one repeated signature motif — kept deliberately simple per
the brief ("simple colours").

## Running it

1. Start the backend, in this order: `eureka-server` -> `config-server` ->
   `user-services`, `item-service`, `claim-service` -> `api-gateway`
   (listens on **:9000**). `api-gateway`'s CORS config only allows
   `http://localhost:5173`, which is Vite's default dev port — don't
   change the frontend's port without also updating
   `api-gateway/api-gateway/src/main/resources/application.yml`.

2. Install and run the frontend:
   ```bash
   npm install
   npm run dev
   ```
   Open http://localhost:5173.

3. `VITE_API_BASE_URL` (see `.env`) points at the gateway — change it if
   you deploy the gateway somewhere else.

## Known backend quirks the frontend works around

- There's no `GET /api/claims/user/{id}` or `GET /api/claims/status/{s}`
  endpoint, so **My Claims** and **Manage Claims** fetch all claims and
  filter client-side, then fetch each referenced item individually to show
  its name/photo.
- `PUT /api/users/{id}` always resets the role to `"user"` server-side, so
  the frontend doesn't expose a "role" field on the edit-user flow — role
  changes only ever go through `PATCH /api/users/{id}/role`.
- Claim approval already flips the item's status to `CLAIMED` server-side
  (in `ClaimServiceImpl`), so the frontend doesn't duplicate that call.
