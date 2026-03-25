Redesign the "Setup" page. Rename it to "Audit" in the sidebar.
Make it a multi-step wizard where each step is its own full-page view. Show a horizontal step indicator at the top (Step 1 → Step 2) so users know where they are, but only one step's content is visible at a time. Only 2 steps, not 3.
The "Run New Crawl" button on the Overview page should navigate the user to this Audit page (Step 1). That button is the entry point.

Step 1 — Theme Crawl (full page view)
Top: Horizontal step indicator showing "Step 1: Theme Crawl" as active, Step 2 grayed out.
Page heading: "Theme Crawl"
Subtext: "Browse and select the theme folders to include in your audit."
Toolbar row:

Search input (placeholder: "Search themes, modules, templates...") on the left
"Select All" checkbox with label on the right
"Expand All" / "Collapse All" toggle button

Below the toolbar, a full-height tree view of all discovered theme files and folders taking up the full content area. This should feel like a file explorer:
▼ ☑ Themes/Remote 2025
    ▼ ☑ modules/ (128 items)
        ☑ Remote - Page Setting.module
        ☑ Remote - Page Schema.module
        ☑ Remote - Hero - Expanded.module
        ☑ Remote - Side Navigation.module
        ☐ Remote - Archived Banner.module
        ... (more items)
    ▼ ☑ templates/ (24 items)
        ☑ CE - Products.html
        ☑ CE - Benefits Detail.html
        ☑ Grow your team.html
        ... (more items)
    ▶ ☐ archived/ (6 items)
▶ ☑ Themes/Remote Legacy
Tree rules:

Checkboxes at every level — theme, folder, and individual file
Checking/unchecking a parent checks/unchecks all children
Partial selection shows indeterminate checkbox on parent
Each folder shows item count in parentheses
Arrow icons to expand/collapse
Tree is scrollable if content overflows
Search filters the tree in real-time, matching items stay visible with their parent path

Summary bar below tree: "Selected: 2 themes · 126 modules · 24 templates · 0 archived"
Bottom right: "Next: Crawl Pages →" primary button. Bottom left: "Cancel" text link.

Step 2 — Crawl Pages (full page view)
Top: Step indicator with Step 1 showing a completed checkmark, "Step 2: Crawl Pages" active.
Page heading: "Crawl Pages"
Subtext: "Fetch all pages and posts from HubSpot to analyze module usage, properties, languages, and media files."
Center: "Start Page Crawl" large primary button.
While crawling: progress bar with "Crawling pages... 1,245 / 4,298" and percentage. Below, a live log area with scrolling lines:

"✓ Fetched /blog/future-of-work — 3 modules, 2 assets"
"✓ Fetched /blog/remote-hiring-guide — 5 modules, 4 assets"
"⟳ Fetching /resources/case-studies..."

After crawl complete: replace progress area with 4 summary cards in a row:

Pages: 2,806
Posts: 1,492
Assets: 3,218
Languages: 12

Bottom left: "← Back" secondary button. Bottom right: "Finish" primary button. Clicking Finish navigates the user to the Reports tab.

Design 3 frames:

Step 1 — Theme Crawl — tree view loaded with some folders expanded, some items checked, some unchecked, search bar empty
Step 2 — Crawl In Progress — progress bar at about 30%, live log showing fetched pages
Step 2 — Crawl Complete — summary cards showing results, "Finish" button active