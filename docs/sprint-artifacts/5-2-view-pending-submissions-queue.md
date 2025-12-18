# Story 5.2: View Pending Submissions Queue

Status: drafted

## Story

As an **instructor**,
I want **to view a queue of pending submissions**,
so that **I can see what needs to be reviewed**.

## Acceptance Criteria

### AC1: Gallery Submissions List View
- **Given** I am logged into Sanity Studio
- **When** I navigate to Gallery Submissions
- **Then** I see a list of all submissions

### AC2: Filter by Pending Status
- **Given** I want to see only pending submissions
- **When** I click on "Pending" in the sidebar structure
- **Then** only pending submissions are displayed
- **And** the filter state is clearly indicated

### AC3: List Item Display
- **Given** there are pending submissions
- **When** I view the list
- **Then** each item shows:
  - Submitter name
  - Design style (resolved reference)
  - Status badge (Pending/Approved/Rejected)
  - Submission date
  - Screenshot thumbnail

### AC4: Sorting by Date
- **Given** I want to sort submissions
- **When** I use the sort option
- **Then** I can sort by submission date (newest/oldest first)

### AC5: Status-Based Sidebar Navigation
- **Given** I am in Sanity Studio
- **When** I look at the document sidebar
- **Then** I see quick links:
  - All Submissions
  - Pending (needs review)
  - Approved (in gallery)
  - Rejected (declined)

## Implementation Gaps

| Gap | Current State | Action Required |
|-----|---------------|-----------------|
| AC2 + AC5 | No custom structure | Create `studio/structure.js` |
| AC3 | Preview missing status badge | Update `gallerySubmission.js:166-180` |
| AC4 | ✅ Orderings exist | Integrate into structure with `defaultOrdering` |

## Tasks / Subtasks

> **Note:** Tasks 1 and 2 modify different files and can be implemented in parallel.

- [ ] **Task 1: Create Custom Studio Structure with Filtered Views** (AC: 2, 4, 5)
  - [ ] **Step 1.1:** Create `studio/structure.js` with filtered views and default ordering
    ```javascript
    import type {StructureResolver} from 'sanity/structure'

    export const structure: StructureResolver = (S) =>
      S.list()
        .title('Content')
        .items([
          // Gallery Submissions with filtered views
          S.listItem()
            .title('Gallery Submissions')
            .icon(() => '📋')
            .child(
              S.list()
                .title('Gallery Submissions')
                .items([
                  S.listItem()
                    .title('All Submissions')
                    .icon(() => '📁')
                    .child(
                      S.documentList()
                        .apiVersion('2024-06-01')
                        .schemaType('gallerySubmission')
                        .title('All Submissions')
                        .filter('_type == "gallerySubmission"')
                        .defaultOrdering([{field: 'submittedAt', direction: 'desc'}])
                    ),
                  S.listItem()
                    .title('Pending')
                    .icon(() => '🟡')
                    .child(
                      S.documentList()
                        .apiVersion('2024-06-01')
                        .schemaType('gallerySubmission')
                        .title('Pending Submissions')
                        .filter('_type == "gallerySubmission" && status == "pending"')
                        .defaultOrdering([{field: 'submittedAt', direction: 'desc'}])
                    ),
                  S.listItem()
                    .title('Approved')
                    .icon(() => '✅')
                    .child(
                      S.documentList()
                        .apiVersion('2024-06-01')
                        .schemaType('gallerySubmission')
                        .title('Approved Submissions')
                        .filter('_type == "gallerySubmission" && status == "approved"')
                        .defaultOrdering([{field: 'submittedAt', direction: 'desc'}])
                    ),
                  S.listItem()
                    .title('Rejected')
                    .icon(() => '❌')
                    .child(
                      S.documentList()
                        .apiVersion('2024-06-01')
                        .schemaType('gallerySubmission')
                        .title('Rejected Submissions')
                        .filter('_type == "gallerySubmission" && status == "rejected"')
                        .defaultOrdering([{field: 'submittedAt', direction: 'desc'}])
                    ),
                ])
            ),
          // Other document types
          ...S.documentTypeListItems().filter(
            (listItem) => !['gallerySubmission'].includes(listItem.getId())
          ),
        ])
    ```
  - [ ] **Step 1.2:** Update `studio/sanity.config.js` to use custom structure
    ```javascript
    import {defineConfig} from 'sanity'
    import {structureTool} from 'sanity/structure'
    import {visionTool} from '@sanity/vision'
    import {schemaTypes} from './schemas'
    import {structure} from './structure'

    export default defineConfig({
      name: 'default',
      title: 'MyWebClass',
      projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'gc7vlywa',
      dataset: process.env.SANITY_STUDIO_DATASET || 'production',
      plugins: [structureTool({structure}), visionTool()],
      schema: {
        types: schemaTypes,
      },
    })
    ```

- [ ] **Task 2: Update Preview to Show Status Badge** (AC: 3)
  - [ ] **Step 2.1:** In `studio/schemas/gallerySubmission.js`, update preview config (lines 166-180):
    ```javascript
    preview: {
      select: {
        title: 'submitterName',
        subtitle: 'styleRef.title',
        status: 'status',
        submittedAt: 'submittedAt',
        media: 'screenshot'
      },
      prepare({title, subtitle, status, submittedAt, media}) {
        const statusEmoji = {pending: '🟡', approved: '✅', rejected: '❌'}[status] || '⚪'
        const dateStr = submittedAt ? new Date(submittedAt).toLocaleDateString() : ''
        return {
          title,
          subtitle: `${statusEmoji} ${status || 'unknown'} • ${subtitle || 'No style'} • ${dateStr}`,
          media
        }
      }
    }
    ```

- [ ] **Task 3: Verify in Sanity Studio** (AC: 1-5)
  - [ ] Run `npm run dev` in `/studio` directory
  - [ ] Confirm sidebar shows "Gallery Submissions" with icon and sub-items
  - [ ] Confirm clicking "Pending" shows only pending submissions
  - [ ] Confirm list items show status emoji, style, and date in subtitle
  - [ ] Confirm default sorting is newest first
  - [ ] Test custom sort options still work (sorting dropdown)

## Dev Notes

### Architecture Context

This story is entirely about **Sanity Studio configuration** - no changes to the Eleventy site or Netlify functions.

From the Architecture document:
> **MVP Simplification:** For MVP, Instructor and Curator roles are combined. All review/curation happens in Sanity Studio native interface (no custom dashboard).

### Story 5.6 Overlap

**Important:** This story (AC2 + AC5) fully implements the filtering functionality described in Story 5.6 "Filter Submissions by Status". After 5.2 is complete, Story 5.6 should be marked as `done` or `superseded by 5.2` in sprint-status.yaml.

### Sanity Structure Builder API (v3)

Required methods when using filtered document lists:
- `.apiVersion('2024-06-01')` - ensures stable API behavior
- `.schemaType('gallerySubmission')` - enables proper form defaults
- `.filter()` - GROQ filter (no joins supported)
- `.defaultOrdering()` - default sort, accepts `{field, direction}[]`

**Note:** User sort selections override `defaultOrdering` and persist in browser localStorage.

[Reference: https://www.sanity.io/docs/structure-builder-reference]

### Schema Fields Used

```javascript
// From studio/schemas/gallerySubmission.js
status: 'pending' | 'approved' | 'rejected'  // line 98-113
submittedAt: datetime                         // line 123-130
submitterName: string                         // line 14-21
styleRef: reference to designStyle            // line 31-39
screenshot: image                             // line 52-69
```

### Testing Guidance

**Manual Testing Steps:**
1. `cd studio && npm run dev`
2. Open http://localhost:3333
3. Verify sidebar shows "Gallery Submissions" with 📋 icon
4. Expand to see All/Pending/Approved/Rejected with status icons
5. Click "Pending" (🟡) - should show only pending submissions
6. Verify each list item shows: `🟡 pending • Style Name • 12/18/2025`
7. Verify default sorting is newest first
8. Test sort dropdown to confirm custom sorting still works

**Troubleshooting:**
- If default ordering doesn't take effect, clear browser localStorage for localhost:3333
- Sort preferences persist per-user in localStorage; each tester should clear storage to see defaults
- Use DevTools → Application → Local Storage → Clear

**Note:** This is Studio-only configuration. No Eleventy build or E2E tests required.

### Dependencies

**Story 5.2 depends on:**
- Story 5.1: Instructor Auth (DONE) - access to Sanity Studio
- Story 1.2: Sanity Schemas (DONE) - gallerySubmission schema exists

**Stories depending on 5.2:**
- Story 5.3: View Submission Details - uses same document access
- Story 5.6: Filter by Status - **superseded by this story**

### References

- [Sanity Structure Builder Reference](https://www.sanity.io/docs/structure-builder-reference)
- [Sanity Document List API](https://www.sanity.io/docs/structure-builder-reference#documentList)
- [GROQ Filtering in Structure](https://www.sanity.io/docs/dynamically-group-list-items-with-a-groq-filter)

## Dev Agent Record

### Agent Model Used

(To be filled by dev agent)

### Debug Log References

(To be filled by dev agent)

### Completion Notes List

(To be filled by dev agent)

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-18 | Story created - identified need for custom structure and preview enhancement | SM Agent (Bob) |
| 2025-12-18 | Quality review: Added apiVersion/schemaType, icons, troubleshooting, Story 5.6 note | SM Agent (Bob) |

### File List

**Files to create:**
- `studio/structure.js` - Custom desk structure with filtered views and icons

**Files to modify:**
- `studio/sanity.config.js` - Import and use custom structure
- `studio/schemas/gallerySubmission.js` - Enhanced preview with status badge

**Documentation:**
- `docs/sprint-artifacts/5-2-view-pending-submissions-queue.md` - This story file
