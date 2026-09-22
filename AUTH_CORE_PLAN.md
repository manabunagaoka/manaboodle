# Plan: Manaboodle as the sign-in service for all apps

Drafted 2026-09-21 for Manabu to review. Nothing in this plan has been
built yet.

## The goal

Manaboodle becomes the one place where people register and sign in for
every app Manabu builds. The apps are his own; building apps for clients
is not expected. Each app sends people
to Manaboodle to sign in and gets them back signed in. Manabu can see, in
one dashboard, which apps use the service, who uses each app, and who is
waiting for access.

The first new app to connect is Forks, Manabu's workshop planner, first
used by his friend's organisation, Mangrove Education. The Harvard Academic Portal becomes one app in the list, and
it stays switched off for now.

## What exists today

Sign-in already runs on Supabase Auth. Supabase stores the passwords in
its own users table. Manaboodle's database adds these tables:

- ManaboodleUser: name, email, username, and Harvard-shaped fields such
  as class code, affiliation and access type.
- GuestPass: requests from people without an approved email domain,
  which an admin approves or denies.
- AdminUser: who may approve guest passes.
- PasswordResetToken and EmailVerificationToken.
- Account, Session, User and VerificationToken: left over from NextAuth,
  which was removed in December 2025. Nothing uses them.

No app data lives in this database. That makes it close to a
sign-in-only service already.

Other apps connect through `/sso/login`, `/api/sso/token` and
`/api/sso/verify`, using the template in `EXTERNAL_APP_SSO_TEMPLATE/`.
RIZE is one app that connects this way.

On 2026-09-19 the portal's own pages were redirected home. Login, signup,
password reset and admin were kept up because SSO depends on them.

## Problems found in the current setup

**Any return address is accepted.** After signing in,
`src/app/sso/login/page.tsx` sends the person to whatever `return_url` the
link names, with their sign-in tokens attached. If the person is already
signed in, this happens without them doing anything. Anyone can send a
signed-in user a link whose return address is the sender's own site, and
receive that user's tokens. This affects the apps connected today, and it
should be fixed before anything else.

**Tokens travel in the web address.** The access token and refresh token
are added to the return address as `?sso_token=` and `?sso_refresh=`.
Web addresses are kept in browser history and server logs, and can leak
through the Referer header. The safer pattern is a one-time code: the
person comes back with a short code that expires in about a minute, and
the app's server swaps it for the tokens in a direct call to Manaboodle.

**The sign-in page is Harvard's.** It shows the Harvard logo and asks for
a "Harvard Email (.edu)". A facilitator in Indonesia would be confused by
it.

**One check reads a table that is no longer used.** The already-signed-in
check on the login page reads `HarvardUser`. The token and verify
endpoints read `ManaboodleUser`. The check probably fails quietly, and
people type their password again when they should not need to.

**One account opens every app.** Verify only checks that a person has a
Manaboodle account. Any account holder can enter any connected app.

## Rules for the core

1. The core stores who a person is and nothing else: name, email,
   password (held by Supabase), which apps they may use, and which
   organiser they registered through. Each app keeps its own data in its
   own database.
2. An app is let in only if it is on the list, and only from the return
   addresses listed for it.
3. A person may use an app only if they have access to that app. Having
   an account is not enough.
4. The sign-in page shows the name of the app that sent the person, not
   Harvard or Manaboodle branding.
5. The core's tables are fixed. There is no spare field where an app
   can store extra details about a person. Anything else an app wants,
   it collects and keeps in its own database, under its own privacy
   notice.
6. Apps never touch the core database. They talk to it only through the
   SSO endpoints, using their app secret. They receive Manaboodle's own
   sign-in token for that one app, not the Supabase tokens, which could
   be used against Supabase directly.
7. Each app gets its own ID for a person, so two apps cannot match their
   users by ID. An app receives the email address only if it needs it.
8. Each app, when added, records what it collects, why, how long it
   keeps it, whether it shares it, and a link to its privacy notice. The
   first time a person signs in to an app, they see what that app will
   receive and agree to it.
9. When a person deletes their account, the core tells every app they
   used, and each app must delete or anonymise that person's data.
10. Accounts are for adults. An app for children needs a parental
   consent process before it may connect.

## Status

Built on branch `auth-core-step-1`, not yet deployed (2026-09-22): Steps
1, 3, 3b and 4.

The sign-in service moved to its own Supabase project, `manaboodle-auth`
(ref `cwinczlfwrazgrgnltrm`, Singapore). The old project
(`otxidzozhdnszvqbgzne`, us-east-1) is shared with an AI trading app, so
it is left as it is. Set up the new one by running
`prisma/migrations/setup_auth_core.sql` once in its SQL Editor, then point
Manaboodle's Vercel settings at it. The newsletter tables (subscribers,
notification_jobs) stay in the old project until Step 7 rebuilds them.

Known gaps in what is built:

- Google sign-in is not built yet. It needs a Google sign-in key.
- "Forgot password?" still goes to the old academic portal page until
  Step 6.
- No bot check beyond a hidden honeypot field until Step 6.
- Someone who already has an account and opens an organiser's link signs
  in without a new Registration row, so that organiser does not receive
  them.
- The template's middleware sets the user's details as response headers,
  which the app's own pages cannot read. Fix when connecting Forks.

## What the MVP needs

Forks is a test that may not last, so only the steps it needs come now.
*decided 2026-09-21*

Now:

- Step 1, the list of apps and their return addresses.
- Step 3, access per app, so only invited facilitators get into Forks.
- Step 4, the neutral sign-in page, so facilitators do not see Harvard.
- Step 3b, organisers, so Mangrove gets the contacts of facilitators
  who registered through it.
- Step 5, invitations, which are the Forks guest passes.
- From Step 6: emails through Resend (confirm and reset), and a bot
  check on registration.
- From Step 9: a plain list of apps and people, with invite and revoke.

Later, if Forks or another app grows: Step 2 (one-time codes and
app-only tokens), two-step sign-in, subscribers, the sign-in log, the
full dashboard, separate IDs per app, the first-sign-in consent screen,
the deletion notice to apps, and the clean-up. Legal terms are also
later.

## The changes, in order

Each step can be released on its own. Steps 1 and 2 close the two
security problems, and every later step builds on them, so they come
first. None of the apps connected today has real users, so no step needs
to keep an old way of signing in working alongside the new one.

### Step 1: The list of apps and their return addresses

Add an `App` table:

| Field            | Meaning                                                   |
|------------------|-----------------------------------------------------------|
| slug             | Short name used in links, for example `forks`             |
| name             | Name shown on the sign-in page, for example "Forks"       |
| returnOrigins    | Web addresses the app may send people back to             |
| secret           | Used by the app's server in Step 2, stored hashed         |
| signupOpen       | Whether anyone may register, or only invited people       |
| approvedDomains  | Email domains let in without approval, if any             |
| active           | Switch the app off without deleting it                    |

The login page and token endpoint refuse any `return_url` whose origin is
not in the app's list. None of the apps connected today has real users,
so they can be re-added one at a time when they are next worked on.

### Step 2: Swap tokens for a one-time code

After sign-in, Manaboodle sends the person back with `?code=`, which is
single-use and expires after about a minute. The app's server calls a new
`/api/sso/exchange` with the code and its app secret, and gets the tokens
back. What the app gets back is a Manaboodle token that works only for
that app (see rule 6). None of the apps connected today has real users, so the old
`?sso_token=` flow can be removed in the same release.

### Step 3: Access per app

Add an `AppAccess` table: user, app, role (`guest`, `member` or
`admin`), status (`pending`, `active`, `revoked`), expiry date, who
granted it, and when.

`/api/sso/verify` then takes the app's slug and returns the person's role
in that app. It refuses the person if they have no active access. Every
existing ManaboodleUser gets access to the apps they use today, so nobody
is locked out.

### Step 3b: Organisers and who registered through them

An organiser is an organisation that brings people to an app, such as
Mangrove Education bringing facilitators to Forks. Manaboodle only
provides the sign-in. The organiser gets the contact details of the
people who registered through it.

Add an `Organiser` table: slug, name, and the email addresses of the
people at the organiser who may see its registrants.

Add a `Registration` table: user, app, organiser, date, and the exact
wording the person agreed to. One person can register through several
organisers, one row each.

Registration links and invitations carry the organiser:
`/sso/register?app=forks&org=mangrove`. When a link names an organiser,
the registration screen says so, for example "You are registering through
Mangrove Education. They will receive your name and email." The person
agrees to that with the same checkbox as the Terms of Use and Privacy
Policy. Registering without an organiser shares nothing.

An organiser receives only the name, email and registration date of
people who registered through it. It does not see what they do in any
app, or registrations through other organisers.

For the MVP, Manabu downloads each organiser's list from the dashboard
and sends it. Later, organiser contacts could sign in and see their own
list.

The Privacy Policy states that Manaboodle only handles sign-in, and that
each organiser receives the contact details of the people who registered
through it.

### Step 4: A neutral sign-in and registration page

`/sso/login?app=forks&return_url=...` shows "Sign in to Forks". The
registration page asks for name, email and password only. Harvard fields
(class code, affiliation) become optional and are only asked for by apps
that want them. The approved email domains (harvard.edu, sesame.org,
manaboodle.com) move from code into each app's settings.

### Step 5: Guest passes per app

A guest pass becomes a kind of app access, so each app has its own. Two
ways to get one:

- A person requests access, and Manabu approves or denies it. This is how
  it works today.
- Manabu invites a person: he enters their email, the app, and how long
  the pass lasts. They receive an email to set their password. This is
  the pass Forks needs for Mangrove facilitators.

### Step 6: Email, recovery and two-step sign-in

All account emails go through Resend, from manaboodle.com.

- **Supabase sends its auth emails through Resend.** Supabase's built-in
  sender allows only a few emails an hour and is meant for testing.
  Supabase's "send email" hook lets Manaboodle write each email itself
  and send it through the Resend API, so a Forks user gets an email that
  says Forks. This replaces the hand-built `EmailVerificationToken` and
  `PasswordResetToken` flows, which duplicate what Supabase already does.
- **Email confirmation before an account works.** An account that has
  not confirmed its email cannot sign in to any app.
- **Password reset by email**, using Supabase's reset link.
- **Bot check on every public form**: registration, guest pass requests,
  subscribe and contact. Cloudflare Turnstile is free and usually shows
  nothing to a real person. Keep the honeypot field the contact page
  already uses, and limit how many requests one address can send.
- **Two-step sign-in with an authenticator app**, which Supabase Auth
  supports. Required for admin accounts, since the dashboard controls
  every app. Optional for everyone else. Requiring it of facilitators or
  students would add a step for people who sign in a few times a year,
  and a lost phone would lock them out and leave Manabu to recover their
  accounts by hand.
- **Refuse leaked passwords.** Supabase can check new passwords against a
  list of passwords known from data breaches. This needs its paid plan.

### Step 7: Subscribers

The subscribe form was switched off in November 2025 after spam. It had
no bot check, and each submission sent a welcome email to whatever
address was typed and a notification to Manabu. Bots could make
Manaboodle send email to strangers, which also harms how mail providers
treat manaboodle.com.

It comes back as part of the core:

- A subscriber is a person in the core with access to an app called
  `newsletter`, role `subscriber`. No password is needed.
- The form has the bot check from Step 6.
- Nothing is sent except one confirmation email. The person is added
  only after clicking the link in it. An address a bot typed in gets one
  email at most and is never added.
- No email to Manabu per subscriber. New subscribers appear in the
  dashboard.
- Every newsletter email carries an unsubscribe link.

Resend's own audience list could hold subscribers instead. Keeping them
in the core means one list of people and one dashboard.

### Step 8: A sign-in log

Add a `SignInEvent` table: user, app, time. The token endpoint (or the
exchange endpoint after Step 2) writes a row every time someone signs in
to an app. This feeds the dashboard.

### Step 9: The dashboard

At `/admin`, which today redirects to `/academic-portal/admin`, for
AdminUser accounts only.

- **Apps**: every connected app, with its number of people, new people
  this week, sign-ins this week, the last sign-in, and pending requests.
  Buttons to add an app, edit its return addresses, and switch it off.
- **One app**: its people, their role, when they joined and last signed
  in. Grant, revoke or extend access. Invite someone.
- **Requests**: every pending guest pass request across all apps, with
  approve and deny.
- **Subscribers**: count, new this week, and the list.
- **People**: search anyone by name or email and see which apps they use.

### Step 10: Update the template for connected apps

Update `EXTERNAL_APP_SSO_TEMPLATE/` for the app slug, the code exchange,
and the role returned by verify. Connect Forks first. Other apps move
over when they are next worked on.

### Step 11: Clean-up

Remove the unused NextAuth tables, and the email token tables once
Step 6 replaces them. Fix or remove the `HarvardUser` lookup. Update the SSO documents at the repo root, several of which
describe the Harvard-only setup.

## Decisions and open questions

**Username: dropped.** Nobody needs to choose one. *decided 2026-09-21*

**What a person signs in with.** Manabu notes that in Indonesia many
people do not use email. Only facilitators sign in; students never do.
Suggested: email and password, plus "Sign in with Google", which Supabase
supports for free. Most Android phones in Indonesia already have a Google
account, so this works even for people who never read their email.
Sign-in by phone number with a code sent over SMS or WhatsApp is possible
in Supabase but costs money per message through a provider such as
Twilio. Add it later if facilitators still struggle. *open*

**The sign-in page's look.** No explanation of Manaboodle. Every screen
ends with links to the Terms of Use and Privacy Policy and the line
"© 2026 Manaboodle | hana & flower. All Rights Reserved.", the same for
every app. Crimson (#A51C30) as the accent, with no Harvard name or logo;
no green, which reads as Sesame. Registration has a checkbox to agree to
the Terms of Use and Privacy Policy, above both ways to register. Mockup:
https://claude.ai/artifact/HUbrUvTXc1hjKi9HYrgSFi *decided 2026-09-22*

**Google sign-in: in.** *decided 2026-09-22*

**No separate "Manaboodle" button.** The email and password form is the
Manaboodle account, so someone already registered signs in there. Someone
already signed in to Manaboodle in the same browser skips the page and
goes straight back to the app. The line under the heading says "Use your
Manaboodle account or Google." so returning people know which password
to use. *suggested*

**Keeping and deleting data.** A registered person can delete their
account and their work at any time. Suggested rule for everything else:
personal data is kept while the person uses it, and deleted after two
years without a sign-in. Warning emails go out 30 days and 7 days before.
Work that was shared stays, with the person's name removed. Totals, such
as the number of workshops held, are kept forever because they identify
nobody. *open*

**When a guest pass expires.** Sign-in stops. The person's work is
archived, not deleted. If they register later with the same email, it
comes back to them. Each app keeps its own archive. A limit on how long
archived work is kept, and deletion on request, still need deciding,
because data protection law may require both. *decided 2026-09-21, with
details open*
