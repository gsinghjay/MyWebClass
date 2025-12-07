# Story 1.4: Configure GitHub Actions Sanity Webhook Rebuild

Status: in-progress

## Story

As a **content editor**,
I want **the site to automatically rebuild when I publish content in Sanity**,
So that **changes appear on the live site without manual deployment**.

## Acceptance Criteria

1. **Given** I publish or update content in Sanity Studio, **When** the Sanity webhook fires, **Then** GitHub Actions triggers a new build **And** the updated site deploys to GitHub Pages

2. **GitHub Actions Workflow: `.github/workflows/sanity-rebuild.yml`**
   - **Given** a `repository_dispatch` event with type `sanity-content-update`
   - **When** GitHub receives the webhook
   - **Then** the workflow:
     1. Checks out the repository
     2. Sets up Node.js 20
     3. Installs dependencies with `npm ci`
     4. Runs Eleventy build with `npm run build`
     5. Deploys to GitHub Pages using official GitHub Pages actions
   - **And** the workflow uses repository secrets for Sanity credentials
   - **And** build failures are reported in GitHub Actions UI

3. **Given** the workflow runs, **When** it needs Sanity credentials, **Then** `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`, and `SANITY_TOKEN` are available from repository secrets

4. **Sanity Webhook Configuration:**
   - **Given** I am in the Sanity project settings (manage.sanity.io)
   - **When** I configure the webhook
   - **Then** it points to: `https://api.github.com/repos/gsinghjay/MyWebClass/dispatches`
   - **And** uses a GitHub Personal Access Token with `repo` scope
   - **And** triggers on document publish events
   - **And** sends payload: `{"event_type": "sanity-content-update"}`

5. **Given** the existing `ci.yml` workflow exists, **When** I create `sanity-rebuild.yml`, **Then** both workflows can coexist (ci.yml for push events, sanity-rebuild.yml for webhook events)

6. **Given** multiple content changes happen rapidly in Sanity, **When** webhooks fire, **Then** GitHub Actions uses concurrency control to cancel in-progress builds and run only the latest

7. **Given** the webhook build completes successfully, **When** I view the deployed site, **Then** the updated content from Sanity is visible

---

## Tasks / Subtasks

- [x] Task 1: Create GitHub Actions workflow file (AC: #2, #3)
  - [x] 1.1: Create `.github/workflows/sanity-rebuild.yml`
  - [x] 1.2: Configure `repository_dispatch` trigger with `sanity-content-update` event type
  - [x] 1.3: Add `workflow_dispatch` trigger for manual runs from GitHub UI
  - [x] 1.4: Add concurrency control to cancel in-progress builds
  - [x] 1.5: Add permissions block for GitHub Pages deployment
  - [x] 1.6: Add checkout step using `actions/checkout@v4`
  - [x] 1.7: Add Node.js setup step using `actions/setup-node@v4` with Node 20
  - [x] 1.8: Add `npm ci` step for dependency installation
  - [x] 1.9: Add Sanity environment variables from repository secrets (all 4 variables)
  - [x] 1.10: Add `npm run build` step for Eleventy build
  - [x] 1.11: Add GitHub Pages deployment using official actions (`configure-pages`, `upload-pages-artifact`, `deploy-pages`)

- [x] Task 2: Verify existing workflow compatibility (AC: #5)
  - [x] 2.1: Check `.github/workflows/ci.yml` for current triggers and deployment method
  - [x] 2.2: Ensure no conflict between push-triggered and dispatch-triggered workflows
  - [x] 2.3: Verify both workflows deploy using same GitHub Pages configuration
  - [x] 2.4: Note: ci.yml uses `_site/` for artifacts but Eleventy outputs to `public/` - verify build works correctly

- [x] Task 3: Configure GitHub repository secrets (AC: #3)
  - [x] 3.1: Verify secrets exist: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`, `SANITY_TOKEN`
  - [x] 3.2: Create `GH_DISPATCH_TOKEN` (GitHub PAT with `repo` scope) for Sanity webhook
  - [x] 3.3: Add secrets to repository settings (manual step - document instructions)

- [x] Task 4: Document Sanity webhook configuration (AC: #4)
  - [x] 4.1: Document webhook URL: `https://api.github.com/repos/gsinghjay/MyWebClass/dispatches`
  - [x] 4.2: Document required headers: `Authorization: Bearer {GH_DISPATCH_TOKEN}`, `Accept: application/vnd.github+json`
  - [x] 4.3: Document payload format: `{"event_type": "sanity-content-update"}`
  - [x] 4.4: Document which events should trigger the webhook (document publish)
  - [x] 4.5: Add instructions to story for manual Sanity webhook configuration

- [ ] Task 5: Test the webhook rebuild flow (AC: #1, #7)
  - [ ] 5.1: Manually trigger workflow using GitHub Actions UI (workflow_dispatch) or CLI
  - [ ] 5.2: Verify workflow runs and completes successfully
  - [ ] 5.3: Verify deployed site reflects current Sanity content
  - [ ] 5.4: Document test results in completion notes

- [x] Task 6: Add workflow status badge to README (optional enhancement)
  - [x] 6.1: Add Sanity rebuild workflow badge to README.md
  - [x] 6.2: Link badge to workflow runs page

## Dev Notes

### Architecture Compliance

**Source:** [docs/architecture.md#Infrastructure-&-Deployment]

**Build Pipeline Pattern:**
```
Sanity CMS → Webhook → GitHub Actions → Eleventy Build → GitHub Pages
```

**Key Decisions:**
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Hosting | GitHub Pages | Free, simple, meets requirements |
| CI/CD | GitHub Actions | Native integration, webhook support |
| Build Triggers | Push (ci.yml) + Sanity webhook (sanity-rebuild.yml) | Flexibility + automatic content updates |
| Webhook Event | repository_dispatch | Allows external webhook triggers |
| Deployment | Official GitHub Pages actions | Consistent with existing ci.yml workflow |

### Technology Requirements

| Technology | Version | Notes |
|------------|---------|-------|
| Node.js | 20 | LTS version for GitHub Actions |
| GitHub Actions | v4 actions | Latest stable action versions |
| actions/configure-pages | v4 | Official GitHub Pages setup |
| actions/upload-pages-artifact | v3 | Official artifact upload |
| actions/deploy-pages | v4 | Official deployment action |

### GitHub Actions Workflow Pattern

**`.github/workflows/sanity-rebuild.yml`:**
```yaml
name: Sanity Content Rebuild

on:
  repository_dispatch:
    types: [sanity-content-update]
  workflow_dispatch:  # Manual trigger from GitHub Actions UI

concurrency:
  group: sanity-rebuild
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build
        env:
          SANITY_PROJECT_ID: ${{ secrets.SANITY_PROJECT_ID }}
          SANITY_DATASET: ${{ secrets.SANITY_DATASET }}
          SANITY_API_VERSION: ${{ secrets.SANITY_API_VERSION }}
          SANITY_TOKEN: ${{ secrets.SANITY_TOKEN }}

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: 'public'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Output Directory Note

**IMPORTANT:** The Eleventy configuration (`eleventy.config.js`) specifies `output: "public"`. This workflow correctly uses `path: 'public'` for the upload artifact step.

Note: The existing `ci.yml` workflow references `_site/` in some places which may be a configuration issue. This sanity-rebuild workflow uses the correct `public/` directory per Eleventy config.

### Sanity Webhook Configuration

**Webhook Setup in Sanity Manage Dashboard:**

1. Go to https://manage.sanity.io/
2. Select project `gc7vlywa`
3. Navigate to API → Webhooks
4. Create new webhook with:
   - **Name:** GitHub Pages Rebuild
   - **URL:** `https://api.github.com/repos/gsinghjay/MyWebClass/dispatches`
   - **Dataset:** production
   - **Trigger on:** Create, Update, Delete
   - **Filter:** (optional) `_type in ["designStyle", "gallerySubmission", "article", "author"]`
   - **HTTP method:** POST
   - **HTTP headers:**
     ```
     Authorization: Bearer {GH_DISPATCH_TOKEN}
     Accept: application/vnd.github+json
     ```
   - **Payload:** Custom JSON
     ```json
     {"event_type": "sanity-content-update"}
     ```

### GitHub Personal Access Token (PAT) Requirements

**Creating GH_DISPATCH_TOKEN:**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Create new token with:
   - **Repository access:** Only select repositories → gsinghjay/MyWebClass
   - **Permissions:**
     - Contents: Read and write (for dispatch events)
     - Metadata: Read-only
3. Copy token and add to Sanity webhook configuration

**Alternative: Classic token with `repo` scope** (simpler but broader access)

### Environment Variables

| Variable | Source | Usage |
|----------|--------|-------|
| `SANITY_PROJECT_ID` | Repository secret | Sanity project identifier |
| `SANITY_DATASET` | Repository secret | Dataset name (production) |
| `SANITY_API_VERSION` | Repository secret | Sanity API version |
| `SANITY_TOKEN` | Repository secret | Sanity API token for data fetching |
| `GH_DISPATCH_TOKEN` | Sanity webhook config | GitHub API authentication (not a repo secret) |
| `GITHUB_TOKEN` | Auto-provided by Actions | GitHub Pages deployment |

### Previous Story Intelligence

**From Story 1.3 (Eleventy Data Fetching Layer):**
- Data files use `.mjs` extension for ES modules
- `src/_data/designStyles.mjs` fetches from Sanity API
- `src/_data/submissions.mjs` fetches approved submissions
- Cache duration is 1 hour, but webhook rebuild ensures fresh data
- Environment variables already configured in repository secrets

**Build Command:** `npm run build`
- Runs `npm-run-all build:css build:eleventy`
- CSS output: `public/styles/main.css`
- Eleventy output directory: `public/` (per eleventy.config.js)
- Requires all 4 Sanity environment variables

### Existing Workflow Reference

**`.github/workflows/ci.yml`** (existing):
- Triggers on push/PR to main
- Jobs: lint → build → test → lighthouse → deploy
- Uses official GitHub Pages actions for deployment
- Permissions block configured for Pages deployment
- The sanity-rebuild workflow mirrors the deployment pattern for consistency

### Testing Approach

**Manual Workflow Trigger (Recommended):**
```bash
# Using GitHub CLI
gh workflow run sanity-rebuild.yml --repo gsinghjay/MyWebClass

# Or trigger via GitHub Actions UI:
# 1. Go to Actions tab
# 2. Select "Sanity Content Rebuild" workflow
# 3. Click "Run workflow" button
```

**API Trigger Test:**
```bash
curl -X POST \
  -H "Authorization: Bearer $GH_DISPATCH_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/gsinghjay/MyWebClass/dispatches \
  -d '{"event_type":"sanity-content-update"}'
```

**Verification Steps:**
1. Trigger workflow manually via UI or CLI
2. Watch workflow run in GitHub Actions tab
3. Verify build completes successfully
4. Check deployed site for current Sanity content

### Concurrency Control

The workflow includes concurrency configuration:
```yaml
concurrency:
  group: sanity-rebuild
  cancel-in-progress: true
```

**Behavior:**
- Multiple rapid webhook triggers will cancel in-progress builds
- Only the most recent build runs to completion
- Prevents resource waste from stacked rebuilds

### Project Structure Notes

**Files to Create:**
```
.github/
└── workflows/
    └── sanity-rebuild.yml    # NEW - Webhook-triggered rebuild
```

**Existing Files:**
```
.github/
└── workflows/
    └── ci.yml                # Existing push/PR-triggered CI/CD
```

### References

- [Source: docs/architecture.md#Infrastructure-&-Deployment]
- [Source: docs/architecture.md#Build-Trigger]
- [Source: docs/epics.md#Story-1.4-Configure-GitHub-Actions-Sanity-Webhook-Rebuild]
- [Source: docs/prd.md#FR40-System-triggers-site-rebuild-via-webhook]
- [Source: docs/sprint-artifacts/1-3-set-up-eleventy-data-fetching-layer.md]
- [Source: .github/workflows/ci.yml - Existing deployment pattern reference]

## Dev Agent Record

### Context Reference

- docs/architecture.md - Infrastructure, deployment, webhook patterns
- docs/prd.md - FR40 webhook rebuild requirement
- docs/epics.md - Story 1.4 acceptance criteria and technical notes
- docs/sprint-artifacts/1-3-set-up-eleventy-data-fetching-layer.md - Build process, env vars
- .github/workflows/ci.yml - Existing workflow pattern for consistency

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

---

**Story Context Engine Analysis:** COMPLETED
**Validation Status:** PASSED (improvements applied)
**Status:** ready-for-dev
