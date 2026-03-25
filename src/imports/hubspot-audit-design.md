Design a new section inside the existing Smuves dashboard application that integrates a "HubSpot Audit" tool under the Migration sidebar group. The design must feel completely native to the existing Smuves visual system — matching its existing component styles, spacing, and interaction patterns exactly.

SIDEBAR MODIFICATION:
Under the existing "MIGRATION" section header (which currently has Overview, History, and Migration items), add a new sidebar item called "HubSpot Audit" positioned as the FIRST item above "Overview." Use a clipboard-check or shield-search style icon. The active state should match the exact same pattern as other active sidebar items in Smuves (the soft green background pill with matching text and icon styling, same border-radius and padding as "Dashboard" or "Overview" when active).

HUBSPOT AUDIT LANDING/DASHBOARD VIEW:
When the user clicks "HubSpot Audit" in the sidebar, the main content area (right of the sidebar, matching the same padding and width as existing pages like Dashboard or Edit and Export) should show:

Page Header: Title "HubSpot Audit" in the same font weight and size as other Smuves page titles (like "Dashboard", "Import Data", "Content Migration"). Below it, a subtitle in lighter muted text: "Audit your HubSpot portal before migration. Analyze modules, templates, properties, and languages."
Top Action Bar: Aligned right of the header, include two buttons: (1) "Run New Crawl" as the primary action button matching the existing Smuves primary CTA style (same as the "Start New Migration" or "Refresh Data" button style) and (2) "Export All CSV" as a secondary outlined button (same as other secondary buttons in Smuves).
Last Crawl Timestamp: Below the subtitle, show "Last crawled: Feb 27, 2026 06:32" in small muted text with a small clock icon.


SUMMARY METRIC CARDS (4 cards in a single row):
Display 4 stat cards in a single horizontal row, matching the existing Smuves stat card style exactly (as seen on the Content Migration Overview page with "Total Migrations: 124", "In Progress: 0", "Failed Migrations: 12"). Each card should have the same background, border/shadow, radius, and padding as those existing cards. Each card contains: a small uppercase label, a large number below, and a small relevant icon in the top-right corner of the card. The four cards are: "Modules: 128", "Templates: 24", "Properties: 4,298", "Languages: 0". Make the cards clickable — each one navigates to its respective tab view below.

INTERNAL TAB NAVIGATION (Below the stat cards):
Below the summary cards, add a horizontal tab bar with 5 tabs: "Overview" (the dashboard landing), "Templates", "Modules", "Properties", "Languages". Use the same tab style as the Admin Panel page in Smuves (the "User Management | Package Control | Master Feature List" tab bar) — underline-style tabs where the active tab has a bottom border and emphasized text, while inactive tabs have muted text. This replaces the old audit tool's dark navy top navbar entirely.

TEMPLATES TAB VIEW:
When "Templates" tab is active, show:

A filter section in a contained card (matching Smuves filter card styling used elsewhere). Two filter inputs in a row: "Template Path" (text input, placeholder "e.g. custom/page") and "Primary Count" (number input, placeholder "Exact count"). Below them: "Apply Filters" button (matching Smuves primary button style) and "Reset" as a text/ghost button.
Below filters, a "Total Templates: 24" count badge aligned right.
A data table matching the Smuves table style (as seen on the Edit and Export page): clean rows, subtle horizontal dividers, row hover effect with light background highlight. Column headers: SR, Template Path, Primary Count (with sort arrow), Variant Count (with sort arrow), Last Scan At (with sort arrow). Column headers in small uppercase muted text. The Template Path column should show only the unique template name portion prominently, with the common path prefix in lighter/muted text. Each row should have a clickable expand/detail affordance (right chevron icon or the row itself clickable).
An "Export CSV" button positioned in the top-right of the table card as a small secondary button with a download icon.


MODULES TAB VIEW:
When "Modules" tab is active, show:

Filter section with: "Module UID / Label" text input, "Connected to HubDB" dropdown (All / Yes / No), "Primary Count" input, "Origin" dropdown (All / Local / Global), "Visibility" dropdown (All / Visible / Hidden). Plus "Apply Filters" and "Reset" buttons. Same Smuves form styling as used everywhere else.
"Total Modules: 128" count badge aligned right.
Data table with columns: SR, Module ID (monospace style, with a copy-to-clipboard icon appearing on hover), Name, Connected to HubDB (show a green "Yes" badge or gray "No" badge instead of ambiguous ✕ marks), Primary Count (sortable), Origin (pill badge: "Local" vs "Global"), Visibility (pill badge: "Visible" vs "Hidden"). Rows should be clickable to expand a detail panel inline showing which templates use this module.
Pagination below the table: "Showing 1-100 of 128" with page number pills (matching Smuves button style), a rows-per-page dropdown (25, 50, 100), and previous/next arrow buttons.
"Export CSV" button in top-right of the table card.


PROPERTIES TAB VIEW:
Combine the two old Properties views into one with a toggle switch at the top:

Add a small segmented control / toggle: "Hierarchy View" | "Matrix View". Default to "Hierarchy View."
Hierarchy View (default): Show the Counts & Definitions section as 4 small metric tiles (Parents: 730, Options: 3,568, Total: 4,298, Table Rows: 289) in a contained card matching the stat card style used elsewhere. Below that, show an info callout box (soft tinted background with an info icon and the explanation text about why table rows are fewer than parents — same callout/alert component style used in Smuves). Below that, the property filter (Property Name text input + Apply Filters + Reset). Below that, the data table with columns: SR, Name, Options (clickable "355 children" links), Type (pill badges for each type: Group, Choice, Boolean, Text), Used In Modules (clickable "68 modules" links). Rows should have an expand/collapse chevron to reveal child properties inline as indented sub-rows.
Matrix View: The property × module cross-reference table. Add a frozen/sticky first column for the Property name so it stays visible during horizontal scroll. Use tinted cells with a checkmark for "used" and empty/blank cells for "not used" — making the visual distinction immediate. Add column header rotation (45° angle) to save horizontal space. Show filter inputs for Property Name and Module Name above the matrix.
"Export CSV" button in top-right.


LANGUAGES TAB VIEW:

Filter section: Module ID input, Label input, Language dropdown, Sort By dropdown. Remove the separate "Direction" dropdown — instead, sort direction should be integrated into the column header sort arrows (click once for ascending, click again for descending). Apply + Reset buttons.
When data exists: data table with columns SR, Module ID, Label, Total, and individual language columns.
Empty state design (critical): When no data exists, show a centered empty state with a simple line-art illustration (globe or language icon), heading "No Language Data Yet", subtitle "Run a crawl to discover module language coverage across your portal." and a CTA button "Run Crawl" matching the Smuves primary button style. This replaces the plain text "No module-language data found."


ADDITIONAL UX ELEMENTS TO INCLUDE:

A global search bar at the top of the content area (matching the search bar style seen on the Migration Overview page — placeholder "Search modules, templates, properties..."), positioned above the tabs.
Loading skeleton states for all tables (shimmer/placeholder bars in place of text rows during data loads — design one reference frame showing this state).
Toast notification positioning in the bottom-right (matching the Smuves notification region) for actions like "CSV exported successfully" or "Crawl started."
Hover tooltips on stat cards showing additional context (e.g., hovering "Properties: 4,298" shows "730 parents + 3,568 options").
The sidebar collapse button (the left-chevron "<" already present in Smuves) should work seamlessly — when collapsed, the audit content area expands to fill the width.


WHAT TO REMOVE / NOT INCLUDE FROM THE OLD AUDIT TOOL:

Remove the dark navy header bar entirely — replaced by the Smuves sidebar + internal tabs.
Remove the standalone "H" logo and "HubSpot Audit / Admin Portal" branding — it's now part of Smuves.
Remove the separate "RU" user avatar dropdown — Smuves already has the "PT" user avatar in the top-right banner.
Remove the separate Direction dropdown on Languages — integrate into column header sort.
Remove duplicate Properties nav items — combined into one tab with Hierarchy/Matrix toggle.


LAYOUT STRUCTURE:
The overall layout is: fixed left sidebar (matching the existing Smuves sidebar width, collapsible) | main content area (fluid width). The main content area has consistent padding on all sides matching existing Smuves pages. The internal tab navigation sits at the top of the content area, with all tab content rendering below it in the same scrollable container. The Smuves top banner (with the Bypass ON toggle and PT avatar) remains fixed at the very top across the full width. Everything must feel like a natural extension of Smuves, not a separate embedded app.

FRAMES TO DESIGN:

HubSpot Audit — Overview/Dashboard (with stat cards and tabs visible)
HubSpot Audit — Templates tab (with sample data in table)
HubSpot Audit — Modules tab (with sample data, badges, pagination)
HubSpot Audit — Properties tab — Hierarchy View (with expandable rows, info callout)
HubSpot Audit — Properties tab — Matrix View (with frozen column, tinted cells)
HubSpot Audit — Languages tab — Empty State (with illustration and CTA)
HubSpot Audit — Languages tab — With Data
HubSpot Audit — Loading State (skeleton shimmer for any table view)
HubSpot Audit — Error State (API failure or crawl error messaging)