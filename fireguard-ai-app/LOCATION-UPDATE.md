# FireGuard locations and offline update

Only three existing application files were changed:
- `app/api/locations/route.ts`: fetch every row using ordered pages and an exact count. Return success only after the complete dataset is received. Duplicate Codes stay intact.
- `app/page.tsx`: display all records with an empty search, retain the same search modes, save the complete dataset for offline use, refresh on reconnect/return to the tab and every five minutes while visible and online.
- `public/sw.js`: cache complete location responses, use the cached data on network and HTTP failures, warm the cache on install and update the app shell cache version.

Added `app/api/keep-alive/route.ts` and `vercel.json` for eight lightweight database reads in one daily Vercel Cron run. Existing credentials, Supabase client configuration, tables, policies, uploads, authentication, styling, reports and assets are unchanged. No database writes or migrations are part of this update.

## Enable daily activity (one-time setup)

1. Open the existing Vercel project. Its Root Directory should remain `fireguard-ai-app` (the folder containing the Next.js package.json and the new vercel.json).
2. Under Settings > Environment Variables, ADD `CRON_SECRET` for Production. Use a new random value of at least 32 characters. Generate one locally with `openssl rand -hex 32`. Do not put this value into GitHub source files. Leave all existing environment variables as they are.
3. Deploy this update to Production. If you added CRON_SECRET after deployment, redeploy. Pushing only starts deployment if your existing Vercel Git integration is enabled for that branch.
4. Under Settings > Cron Jobs, confirm `/api/keep-alive` is enabled. Use Run and inspect logs for HTTP 200. The endpoint returns `success: true` and `queries: 8`. HTTP 401 means the cron secret is absent or incorrect; HTTP 503 means the database check failed.
5. The schedule is `17 6 * * *`, daily in the 06:00 UTC hour (10:00 UAE hour). Hobby runs can occur later in that hour. The eight reads run together during the single invocation, even when no browser is open.

This is a best-effort activity check, not a promise that a Free project can never pause. Supabase does not publish a guaranteed number of daily queries that prevents pausing. An already paused project must first be restored from Supabase. Cron does not automatically restore it.

Official references:
- https://supabase.com/docs/guides/deployment/going-into-prod
- https://vercel.com/docs/cron-jobs/manage-cron-jobs
- https://vercel.com/docs/cron-jobs/usage-and-pricing

## Save all locations offline

The supplied ZIP contains only 902 rows in `public/locations-seed.json`; it does not contain an export of the live 1300+ rows or the server's secret environment file. Those missing rows have not been invented or copied from another project.

After deployment, open the website ONLINE on each device/browser and wait until the full count appears with `N locations saved for offline use`. The API downloads all rows from your existing database and the browser stores the complete snapshot automatically. Search is not required. Then disconnect and reload: the same count and all location cards should remain available. New uploads are included in the next successful sync.

Offline data is local to the device/browser and website address. Clearing site data, using a different browser or domain, private browsing restrictions, or browser storage eviction can require another online sync. Before a device's first full sync, the original 902-row seed is only a basic fallback, explicitly labelled as such. The daily server job cannot write into a closed device's browser cache.

## Apply and push from Codespaces

Upload `FireGuard-All-Locations-Offline-Daily.zip` into the Git repository root. Run the command provided with the ZIP. The included `apply-update.py` applies only the five application files above plus this note, stages exactly those paths, commits and pushes the CURRENT branch.

The updater checks existing file hashes against your supplied ZIP before overwriting. If your repository has different edits to any affected file, it stops and names the conflict. It also stops if other changes are already staged. It does not force-push, switch branches, delete files or stage credentials. Files outside the six listed paths stay untouched.

## Verification

Production build, TypeScript and lint checks passed. Local integration tests use a mock database, not your live Supabase credentials. Pagination was tested with 0, 500, 1000, 1335 and 6001 rows, including a server response cap of 137, duplicate Codes, and a failed second page. The daily endpoint was checked for authorization, exactly eight read requests and failure reporting.

Service-worker tests with simulated Cache Storage also passed for a 1335-row snapshot during network failure, HTTP 503 and an incomplete response, followed by a 1401-row refresh. The updater was exercised against a local Git remote: exactly six paths committed/pushed, unrelated edits preserved, repeat invocation harmless, conflicting edits rejected. An actual browser reload test could not run because Chromium was unavailable and its download timed out. Live Supabase data and the deployed scheduler were not tested here; verify the displayed full count and offline reload after deployment.
