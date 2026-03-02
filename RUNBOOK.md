# Runbook

## Current state

- Facebook publishing is live
- Supabase persistence is live
- OpenAI draft generation is live
- Optional OpenAI image generation is live
- Metrics snapshots are stored even when Meta engagement fields are partially unavailable

## Safe testing

1. Open [`/config`](/Users/rms/Desktop/Ai%20Project/Ai%20FB/app/config/page.tsx)
2. Enable `Generate but do not publish to Facebook`
3. Save the config
4. Run the daily workflow

When `dryRun` is enabled, drafts are generated, QA runs, and the content is stored without posting to Facebook.

## Live schedule

- Facebook posts are scheduled for 11:00 AM Malaysia time and 9:00 PM Malaysia time
- In `vercel.json`, those map to `03:00 UTC` and `13:00 UTC`
- Metrics collection runs daily at `11:00 PM` Malaysia time

## Live publishing

1. Disable `Generate but do not publish to Facebook`
2. Confirm the Page ID is correct
3. Confirm `META_PAGE_ACCESS_TOKEN` is still valid
4. Trigger the daily workflow

## What is stored

- `runs`: workflow execution status
- `drafts`: generated and formatted content
- `posts`: successfully published Facebook posts
- `post_metrics_snapshots`: raw per-run metric snapshots
- `metrics_daily`: daily metric rollup

## Known limitation

- Facebook engagement reads for comments and reactions are still blocked by Meta permission enforcement in the current app/token setup
- The system continues to store zero-value metric snapshots instead of failing the entire workflow
