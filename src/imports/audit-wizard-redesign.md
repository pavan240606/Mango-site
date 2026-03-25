Redesign the "Setup" page. Rename it to "Audit" in the sidebar.
Make it a multi-step wizard where each step is its own full-page view. Show a horizontal step indicator at the top so users know where they are, but only one step's content is visible at a time. There are 4 steps.
The "Run New Crawl" button on the Overview/Reports page should navigate the user to this Audit page at Step 1. That button is the entry point.

Step 1 — Fetch Content Types (full page view)
Top: Horizontal step indicator showing "Step 1: Fetch Content Types" as active, Steps 2, 3, 4 grayed out.
Page heading: "Fetch Content Types"
Subtext: "Connect to HubSpot and fetch all content type data from your portal."
Show 3 checkboxes pre-selected:

☑ Site Pages
☑ Landing Pages
☑ Blog Posts

"Start Fetch" primary button below the checkboxes.
While fetching: show a progress indicator per content type:

"✓ Site Pages — 2,806 fetched"
"✓ Landing Pages — 342 fetched"
"⟳ Blog Posts — fetching..."

After all complete: summary showing total counts per type.
Bottom right: "Next: Theme Files →" primary button. Bottom left: "Cancel" text link.

Step 2 — Crawl Theme Files (full page view)
Top: Step indicator with Step 1 showing checkmark, "Step 2: Crawl Theme Files" active, Steps 3 and 4 grayed out.
Page heading: "Crawl Theme Files"
Subtext: "Crawl theme source code to discover available modules and templates, then select which folders to include."
"Start Theme Crawl" primary button.
After crawl completes, show a full-height tree view of all discovered theme folders and files (file explorer style):
Toolbar row above the tree:

Search input (placeholder: "Search themes, modules, templates...") on the left
"Select All" checkbox with label
"Expand All" / "Collapse All" toggle button

Tree structure:
▼ ☑ Themes/Remote 2025
    ▼ ☑ modules/ (128 items)
        ☑ Remote - Page Setting.module
        ☑ Remote - Page Schema.module
        ☑ Remote - Hero - Expanded.module
        ☐ Remote - Archived Banner.module
        ...
    ▼ ☑ templates/ (24 items)
        ☑ CE - Products.html
        ☑ CE - Benefits Detail.html
        ...
    ▶ ☐ archived/ (6 items)
▶ ☑ Themes/Remote Legacy
Tree rules:

Checkboxes at every level — theme, folder, individual file
Checking/unchecking parent checks/unchecks all children
Partial selection shows indeterminate checkbox on parent
Folder shows item count in parentheses
Arrow icons to expand/collapse
Scrollable if content overflows
Search filters in real-time

Summary bar below tree: "Selected: 2 themes · 126 modules · 24 templates"
Bottom left: "← Back" secondary button. Bottom right: "Next: Enrich Data →" primary button.

Step 3 — Enrich Data (full page view)
Top: Step indicator with Steps 1 and 2 showing checkmarks, "Step 3: Enrich Data" active, Step 4 grayed out.
Page heading: "Enrich Data"
Subtext: "Finding module occurrences across all content types and counting usage."
This step runs automatically when the user arrives (or with a "Start Enrichment" button). Show a progress view:

Progress bar with percentage: "Processing... 65%"
Below, a status list updating in real-time:

"✓ Scanning Site Pages for module occurrences — 2,806 pages scanned"
"✓ Scanning Landing Pages — 342 pages scanned"
"⟳ Scanning Blog Posts — 845 / 1,492..."
"◻ Counting module usage across content types"



After complete: summary showing "Enrichment complete. Found 128 modules across 4,298 pages. 4 modules connected to HubDB."
Bottom left: "← Back" secondary button. Bottom right: "Next: Languages →" primary button.

Step 4 — Enrich Languages (full page view)
Top: Step indicator with Steps 1, 2, 3 showing checkmarks, "Step 4: Enrich Languages" active.
Page heading: "Enrich Languages"
Subtext: "Detecting and counting language variants across all pages."
This step runs automatically or with a "Start Language Scan" button. Show progress:

Progress bar: "Scanning languages... 78%"
Status list:

"✓ English (US) — 1,492 pages"
"✓ French (France) — 1,105 pages"
"✓ German — 980 pages"
"⟳ Scanning remaining variants..."



After complete: summary showing total languages found and a count per language.
Bottom left: "← Back" secondary button. Bottom right: "Finish" primary button. Clicking Finish navigates to the Reports tab.

Design 5 frames:

Step 1 — Fetch Content Types — showing all 3 content types fetched with checkmarks and counts
Step 2 — Theme Crawl — tree view loaded with folders expanded, items checked/unchecked, search bar visible
Step 3 — Enrich In Progress — progress bar mid-way, some items checked off, some still processing
Step 4 — Languages Complete — all languages listed with counts, Finish button active
Step 4 — Finish clicked — redirect view showing the Reports tab with Templates, Modules, Properties, Languages tabs visible and data populated