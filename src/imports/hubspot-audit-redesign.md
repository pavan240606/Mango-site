Redesign only the "HubSpot Audit" section. Everything else in the app stays the same.
SIDEBAR STRUCTURE CHANGE
Move "HubSpot Audit" OUT of the "MIGRATION" group. It should be its own top-level section in the sidebar, separate from Migration.
Under "HubSpot Audit", replace the current flat list with two grouped sub-sections:
HUBSPOT AUDIT  [expandable, top-level item]
  ─── SETUP ───────────────
  Audit Setup              (new page)
  ─── REPORTS ─────────────
  Overview                 (existing)
  Templates                (existing)
  Modules                  (existing, with updates)
  Properties               (existing)
  Languages                (existing)
  Files & Assets           (new page)
Use small uppercase group labels ("SETUP" and "REPORTS") to visually separate the two groups.
PAGE 1: AUDIT SETUP (NEW PAGE)
A guided setup flow on a single page using a vertical stepper/accordion layout with 3 steps.
Step 1 — Crawl Theme Files

Heading: "Step 1: Crawl Theme Files"
Description: "Connect to your HubSpot portal and crawl the theme source code to discover all available modules, templates, and assets."
"Start Theme Crawl" primary button
After crawl completes: show a collapsible tree view of discovered theme folders (like a file explorer). Each top-level theme folder has a checkbox. Users can expand to see sub-folders (modules/, templates/, etc.) and select/deselect which ones to include.
Summary line: "Found 3 themes, 128 modules, 24 templates"
"Confirm Selection" button to lock in chosen folders

Step 2 — Crawl Pages

Heading: "Step 2: Crawl Pages"
Description: "Fetch all pages and posts from HubSpot to analyze module usage, properties, languages, and media files."
"Start Page Crawl" primary button
Progress indicator (progress bar or count: "Crawling... 1,245 / 4,298 pages")
After crawl completes: summary cards — Pages found: X, Posts found: X, Assets found: X, Languages detected: X

Step 3 — Generate Reports

Heading: "Step 3: Generate Reports"
Description: "Combine theme data with page data to generate your full audit reports."
"Generate Reports" primary button
After complete: success state with green checkmark and text "Audit complete! View your reports in the sidebar." with quick-link buttons to each report page

Step status indicators:

Not started (gray)
In progress (spinner)
Complete (green checkmark)
Steps are sequential — Step 2 is disabled until Step 1 is complete, etc.
"Re-run Full Audit" secondary button at the top for returning users
"Last crawled" timestamp at top right (same position as current pages)

PAGE 2: OVERVIEW (UPDATE)
Keep the existing overview dashboard layout with stat cards. Updates:

ADD a new stat card: "Files & Assets" with a file/image icon showing the count of discovered media files
ADD a small info banner below the header: "Last full audit completed on [date]. To refresh data, go to Audit Setup." with a link
Make stat cards clickable — clicking one navigates to that report page

PAGE 3: MODULES (UPDATE)
Keep the current table layout and filters. Updates:

ADD column "Folder Path" after the "Name" column — shows the full theme folder path (e.g., "Themes/Remote 2025/modules/"). Must be its own separate column, NOT concatenated with the module name
ADD column "Type" after the "Origin" column
ADD a "Table View" / "Tree View" toggle at the top (same pattern as Properties page has "Hierarchy View" / "Matrix View"). Tree View shows modules grouped by their folder path in a collapsible tree structure
Default sort: alphabetical by name
Export CSV must include ALL visible columns

PAGE 4: FILES & ASSETS (NEW PAGE)
Follow the same visual pattern as the Modules and Templates pages.
Filter bar:

File Name: text search input
File Type: dropdown (All, Images, Videos, PDFs, Documents, Other)
Found In: dropdown (All, Blog Posts, Website Pages, Landing Pages)
Sort By: dropdown (Name, Usage Count, File Type)
"Apply Filters" button + "Reset" link

Summary line:

"Total Files: [count]" on the left, "Export CSV" button on the right

Table columns:

SR
File Name
File Type (with small icon per type — image, video, PDF, etc.)
File URL / Path (HubSpot file URL showing folder structure)
Used On (count of pages this file appears on)
Primary Pages (count)
Localized Pages (count)
Last Scan At

Additional:

Same "Table View" / "Tree View" toggle as Modules — Tree View groups files by folder structure
Clicking "Used On" count could expand to show list of page names/URLs

PAGE 5: TEMPLATES (MINOR UPDATE)

ADD a "Folder Path" column as its own separate column, so the full theme path is not embedded inside the template name string

PAGES WITH NO CHANGES
Properties and Languages — keep exactly as they are.
DELIVERABLES — Design these frames:

Audit Setup — Step 1 completed (showing theme folder tree with checkboxes), Step 2 in progress (progress bar), Step 3 not started
Audit Setup — Complete State — all 3 steps done with success messages and quick links
Overview (updated) — with new Files & Assets stat card
Modules (updated) — showing Folder Path column, Type column, and Tree View toggle
Modules — Tree View — same page with Tree View active, modules grouped by folder
Files & Assets — Table View — full page with filters, sample data rows
Files & Assets — Tree View — same page with Tree View active, files grouped by folder
Updated Sidebar — showing HubSpot Audit as its own top-level section with Setup vs Reports grouping