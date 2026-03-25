# Smuves Dashboard - Complete Design Specifications

## Table of Contents
1. [Typography](#typography)
2. [Color Palette](#color-palette)
3. [Component Sizes](#component-sizes)
4. [Modal Specifications](#modal-specifications)
5. [Buttons](#buttons)
6. [Form Elements](#form-elements)
7. [Tables](#tables)
8. [Notifications & Toasts](#notifications--toasts)
9. [Animations](#animations)
10. [Status Indicators](#status-indicators)
11. [Layout & Spacing](#layout--spacing)

---

## Typography

### Font Family
- **Primary Font**: System font stack (default browser fonts)
  - `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

### Base Font Size
- **Root Font Size**: `14px` (set via CSS variable `--font-size: 14px`)

### Font Weights
- **Normal**: `400` (CSS variable: `--font-weight-normal`)
- **Medium**: `500` (CSS variable: `--font-weight-medium`)

### Heading Styles

#### H1 (Main Page Titles)
- **Font Size**: `var(--text-2xl)` (approximately 24px at 14px base)
- **Font Weight**: `500` (Medium)
- **Line Height**: `1.5`
- **Usage**: Main page headers, primary titles

#### H2 (Section Headers)
- **Font Size**: `var(--text-xl)` (approximately 20px at 14px base)
- **Font Weight**: `500` (Medium)
- **Line Height**: `1.5`
- **Usage**: Section titles, modal headers

#### H3 (Subsection Headers)
- **Font Size**: `var(--text-lg)` (approximately 18px at 14px base)
- **Font Weight**: `500` (Medium)
- **Line Height**: `1.5`
- **Usage**: Card headers, subsection titles

#### H4 (Minor Headers)
- **Font Size**: `var(--text-base)` (14px)
- **Font Weight**: `500` (Medium)
- **Line Height**: `1.5`
- **Usage**: Minor section headers

### Body Text

#### Paragraph Text
- **Font Size**: `var(--text-base)` (14px)
- **Font Weight**: `400` (Normal)
- **Line Height**: `1.5`
- **Usage**: Body text, descriptions

#### Small Text
- **Font Size**: `text-sm` (12px)
- **Font Weight**: `400` (Normal)
- **Usage**: Helper text, secondary information, captions

#### Extra Small Text
- **Font Size**: `text-xs` (10px)
- **Font Weight**: `400` (Normal)
- **Usage**: Timestamps, micro-labels, badges

### Interactive Text

#### Labels
- **Font Size**: `var(--text-base)` (14px)
- **Font Weight**: `500` (Medium)
- **Line Height**: `1.5`

#### Buttons
- **Font Size**: `text-sm` (12px for small buttons) / `var(--text-base)` (14px for default)
- **Font Weight**: `500` (Medium)
- **Line Height**: `1.5`

#### Input Text
- **Font Size**: `var(--text-base)` (14px)
- **Font Weight**: `400` (Normal)
- **Line Height**: `1.5`

---

## Color Palette

### Light Theme (Default)

#### Primary Colors
- **Background**: `#ffffff` (`--background`)
- **Foreground (Text)**: `oklch(0.145 0 0)` (Almost black, `--foreground`)
- **Primary**: `#030213` (Near black, `--primary`)
- **Primary Foreground**: `oklch(1 0 0)` (White, `--primary-foreground`)

#### Brand Colors
- **Teal Primary**: `#14b8a6` (Used for logo, active states)
- **Teal Light**: `#ccfbf1` (Teal-50, used for hover states)
- **Teal Active**: `#0d9488` (Teal-600, active button states)

#### Secondary Colors
- **Secondary**: `oklch(0.95 0.0058 264.53)` (Very light purple-gray, `--secondary`)
- **Secondary Foreground**: `#030213` (`--secondary-foreground`)

#### Neutral Colors
- **Muted**: `#ececf0` (Light gray, `--muted`)
- **Muted Foreground**: `#717182` (Medium gray text, `--muted-foreground`)
- **Accent**: `#e9ebef` (Light gray accent, `--accent`)
- **Accent Foreground**: `#030213` (`--accent-foreground`)

#### UI Element Colors
- **Border**: `rgba(0, 0, 0, 0.1)` (10% black, `--border`)
- **Input Background**: `#f3f3f5` (`--input-background`)
- **Switch Background (Unchecked)**: `#cbced4` (`--switch-background`)
- **Card**: `#ffffff` (`--card`)
- **Card Foreground**: `oklch(0.145 0 0)` (`--card-foreground`)

#### Status Colors

**Success/Green**
- **Green-50**: `#f0fdf4` (Light green background)
- **Green-100**: `#dcfce7` (Success badge background)
- **Green-200**: `#bbf7d0` (Success badge border, borders)
- **Green-600**: `#16a34a` (Success icon color)
- **Green-700**: `#15803d` (Success text emphasis)
- **Green-800**: `#166534` (Success badge text)

**Info/Blue**
- **Blue-50**: `#eff6ff` (Info background)
- **Blue-200**: `#bfdbfe` (Info borders)
- **Blue-500**: `#3b82f6` (Info primary)
- **Blue-600**: `#2563eb` (Info icons, active fetch indicator)
- **Blue-700**: `#1d4ed8` (Info text emphasis)

**Warning/Yellow**
- **Yellow-50**: `#fefce8` (Warning background)
- **Yellow-200**: `#fef08a` (Warning borders)
- **Yellow-600**: `#ca8a04` (Warning icons)
- **Yellow-700**: `#a16207` (Warning text)

**Error/Red**
- **Red-50**: `#fef2f2` (Error background)
- **Red-100**: `#fee2e2` (Error badge background)
- **Red-200**: `#fecaca` (Error badge border, borders)
- **Red-600**: `#dc2626` (Error icons, `--destructive: #d4183d`)
- **Red-700**: `#b91c1c` (Error text emphasis)
- **Red-800**: `#991b1b` (Error badge text)

#### Sidebar Colors
- **Sidebar Background**: `oklch(0.985 0 0)` (Off-white, `--sidebar`)
- **Sidebar Foreground**: `oklch(0.145 0 0)` (`--sidebar-foreground`)
- **Sidebar Primary**: `#030213` (`--sidebar-primary`)
- **Sidebar Accent**: `oklch(0.97 0 0)` (`--sidebar-accent`)
- **Sidebar Border**: `oklch(0.922 0 0)` (Light gray, `--sidebar-border`)

#### Bypass Mode Colors
- **Bypass ON (Gradient)**: 
  - From: `#f59e0b` (Amber-500)
  - To: `#ea580c` (Orange-500)
- **Bypass OFF**: 
  - Border: `#d1d5db` (Gray-300)
  - Text: `#374151` (Gray-700)
  - Background: `#f9fafb` (Gray-50, hover)

#### Chart Colors
- **Chart 1**: `oklch(0.646 0.222 41.116)` (Orange, `--chart-1`)
- **Chart 2**: `oklch(0.6 0.118 184.704)` (Cyan, `--chart-2`)
- **Chart 3**: `oklch(0.398 0.07 227.392)` (Blue, `--chart-3`)
- **Chart 4**: `oklch(0.828 0.189 84.429)` (Yellow-green, `--chart-4`)
- **Chart 5**: `oklch(0.769 0.188 70.08)` (Yellow, `--chart-5`)

#### Celebration Confetti Colors
- **Green**: `#10b981` (Emerald-500)
- **Blue**: `#3b82f6` (Blue-500)
- **Orange**: `#f59e0b` (Amber-500)
- **Red**: `#ef4444` (Red-500)
- **Purple**: `#8b5cf6` (Violet-500)

### Dark Theme

*(Note: Dark theme colors are defined but not actively used in current implementation)*

- **Background**: `oklch(0.145 0 0)` (Dark gray)
- **Foreground**: `oklch(0.985 0 0)` (Off-white)
- **Primary**: `oklch(0.985 0 0)` (Off-white)
- **Border**: `oklch(0.269 0 0)` (Medium gray)

---

## Component Sizes

### Border Radius
- **Small**: `calc(var(--radius) - 4px)` = `6px` (`--radius-sm`)
- **Medium**: `calc(var(--radius) - 2px)` = `8px` (`--radius-md`)
- **Large**: `0.625rem` = `10px` (`--radius-lg`, default `--radius`)
- **Extra Large**: `calc(var(--radius) + 4px)` = `14px` (`--radius-xl`)

### Spacing Scale
Common spacing values used throughout:
- **1**: `0.25rem` = `4px`
- **2**: `0.5rem` = `8px`
- **3**: `0.75rem` = `12px`
- **4**: `1rem` = `16px`
- **5**: `1.25rem` = `20px`
- **6**: `1.5rem` = `24px`
- **8**: `2rem` = `32px`
- **10**: `2.5rem` = `40px`
- **12**: `3rem` = `48px`

### Icon Sizes
- **Extra Small**: `h-3 w-3` = `12px × 12px`
- **Small**: `h-4 w-4` = `16px × 16px` (Most common)
- **Medium**: `h-5 w-5` = `20px × 20px`
- **Large**: `h-6 w-6` = `24px × 24px`
- **Extra Large**: `h-12 w-12` = `48px × 48px` (Empty states)

---

## Modal Specifications

### Global Modal Override
All modals in the application use a consistent size override:

**Modal Container**
- **Width**: `90vw` (90% of viewport width)
- **Height**: `90vh` (90% of viewport height)
- **Max Width**: `none` (no maximum constraint)
- **Max Height**: `none` (no maximum constraint)
- **Padding**: `0` (padding handled by internal sections)
- **Display**: `flex`
- **Flex Direction**: `column`
- **Gap**: `0`
- **Border Radius**: `8px` (rounded-lg)
- **Background**: White (`#ffffff`)
- **Shadow**: `shadow-xl` (Large shadow)
- **Position**: Fixed, centered (`top: 50%`, `left: 50%`, `transform: translate(-50%, -50%)`)
- **Z-Index**: `50`

### Modal Overlay
- **Background**: `bg-black/50` (50% opacity black)
- **Z-Index**: `50`
- **Animation**: Fade in/out

### Modal Structure

#### Modal Header
- **Padding**: `px-6 py-4` = `24px horizontal, 16px vertical`
- **Border Bottom**: `border-b border-gray-200` (1px solid gray)
- **Display**: `flex items-center justify-between`
- **Flex Shrink**: `0` (Fixed height)

**Header Title**
- **Font Size**: `text-lg` to `text-xl` (18-20px)
- **Font Weight**: `500` (Medium)
- **Color**: `text-gray-900`

**Close Button**
- **Icon Size**: `h-4 w-4` to `h-5 w-5` (16-20px)
- **Color**: `text-gray-400` hover `text-gray-600`
- **Padding**: `p-1` (4px)
- **Position**: `absolute top-4 right-4`

#### Modal Content Area (Scrollable)
- **Class**: `modal-scrollable`
- **Overflow**: `overflow-y-auto`
- **Flex**: `flex-1` (Takes remaining space)
- **Min Height**: `0` (Allows flex shrinking)
- **Padding**: `p-6` = `24px` (typical)

**Custom Scrollbar**
- **Width**: `8px`
- **Track Background**: `#f7fafc` (Gray-50)
- **Track Border Radius**: `4px`
- **Thumb Background**: `#cbd5e0` (Gray-300)
- **Thumb Hover**: `#a0aec0` (Gray-400)
- **Thumb Border Radius**: `4px`
- **Scrollbar Width**: `thin` (Firefox)
- **Scrollbar Color**: `#cbd5e0 #f7fafc`

#### Modal Footer
- **Padding**: `px-6 py-4` = `24px horizontal, 16px vertical`
- **Border Top**: `border-t border-gray-200` (1px solid gray)
- **Display**: `flex justify-end`
- **Flex Shrink**: `0` (Fixed height)
- **Gap**: `gap-2` = `8px` (between buttons)

### Specific Modal Types

#### 1. Bulk Edit Modal
- **Width**: `90vw`
- **Height**: `90vh`
- **Background**: White
- **Content Type Selector**: Dropdown at top
- **Tabs**: For selecting records vs. editing fields
- **Table**: Full data table with pagination
- **Items Per Page**: 25 records

#### 2. Export Modal
- **Width**: `90vw`
- **Height**: `90vh`
- **Sections**: Field selection with categories (Required, Recommended, Additional)
- **Method Toggle**: CSV vs Google Sheets tabs

#### 3. Data Pull Results Modal
- **Width**: `90vw`
- **Height**: `90vh`
- **Header Height**: Fixed with summary stats
- **Summary Stats Grid**: 3 columns, equal width
- **Tabs**: Success vs Failed records
- **Content**: Scrollable list of records

#### 4. Live Fetching Modal (Hourglass Modal)
- **Width**: `90%` with `max-w-4xl`
- **Max Height**: `90vh`
- **Background**: White
- **Header**: Progress indicator or completion check
- **Content**: List of fetching progresses
- **Footer**: Data retention notice (24-hour warning)

#### 5. Notification Tray (Popover)
- **Width**: `384px` (`w-96`)
- **Max Height**: `600px`
- **Background**: White
- **Border Radius**: `8px` (rounded-lg)
- **Shadow**: `shadow-xl`
- **Border**: `1px solid #e5e7eb` (gray-200)

#### 6. Fetching Status Tray (Popover)
- **Width**: `384px` (`w-96`)
- **Max Height**: `600px`
- **Background**: White
- **Border Radius**: `8px` (rounded-lg)
- **Shadow**: `shadow-xl`
- **Border**: `1px solid #e5e7eb` (gray-200)

#### 7. Preview Modal
- **Width**: `90vw`
- **Height**: `90vh`
- **Content**: HTML/Content preview

#### 8. Find and Replace Modal
- **Width**: `90vw`
- **Height**: `90vh`
- **Sections**: Search input, Replace input, Results list

---

## Buttons

### Button Variants

#### Default Button
- **Background**: `#030213` (Primary, near black)
- **Text Color**: White (`oklch(1 0 0)`)
- **Hover**: `#030213/90` (90% opacity)
- **Border Radius**: `6px` (rounded-md)
- **Transition**: `transition-all`
- **Font Weight**: `500` (Medium)

#### Outline Button
- **Background**: Transparent
- **Border**: `1px solid` border color
- **Text Color**: `--foreground`
- **Hover Background**: `--accent` (Light gray)
- **Hover Text**: `--accent-foreground`

#### Destructive Button
- **Background**: `#d4183d` (Red, `--destructive`)
- **Text Color**: White
- **Hover**: `#d4183d/90` (90% opacity)

#### Ghost Button
- **Background**: Transparent
- **Text Color**: Inherit
- **Hover Background**: `--accent` (Light gray)
- **Hover Text**: `--accent-foreground`

#### Link Button
- **Background**: Transparent
- **Text Color**: `--primary`
- **Text Decoration**: Underline on hover
- **Underline Offset**: `4px`

#### Secondary Button
- **Background**: `--secondary` (Light purple-gray)
- **Text Color**: `--secondary-foreground`
- **Hover**: `--secondary/80` (80% opacity)

### Button Sizes

#### Small (`size="sm"`)
- **Height**: `32px` (`h-8`)
- **Padding**: `px-3` = `12px horizontal`
- **Gap**: `gap-1.5` = `6px`
- **Border Radius**: `6px` (rounded-md)
- **Font Size**: `text-sm` (12px)
- **With Icon Padding**: `px-2.5` = `10px horizontal`

#### Default (`size="default"`)
- **Height**: `36px` (`h-9`)
- **Padding**: `px-4 py-2` = `16px horizontal, 8px vertical`
- **Gap**: `gap-2` = `8px`
- **Border Radius**: `6px` (rounded-md)
- **Font Size**: `text-sm` (12px) / `text-base` (14px)
- **With Icon Padding**: `px-3` = `12px horizontal`

#### Large (`size="lg"`)
- **Height**: `40px` (`h-10`)
- **Padding**: `px-6` = `24px horizontal`
- **Gap**: `gap-2` = `8px`
- **Border Radius**: `6px` (rounded-md)
- **Font Size**: `text-base` (14px)
- **With Icon Padding**: `px-4` = `16px horizontal`

#### Icon Only (`size="icon"`)
- **Size**: `36px × 36px` (`size-9`)
- **Border Radius**: `6px` (rounded-md)
- **Icon Size**: `16px × 16px` (h-4 w-4)

### Button Focus States
- **Focus Border**: `focus-visible:border-ring`
- **Focus Ring**: `focus-visible:ring-ring/50` (50% opacity)
- **Focus Ring Width**: `3px` (`focus-visible:ring-[3px]`)
- **Outline**: `outline-none`

### Special Buttons

#### Bypass Toggle Button
**When ON (Active):**
- **Background Gradient**: `from-amber-500 to-orange-500`
  - From: `#f59e0b`
  - To: `#ea580c`
- **Text Color**: White
- **Border**: `0`
- **Hover Gradient**: `from-amber-600 to-orange-600`

**When OFF (Inactive):**
- **Background**: Transparent
- **Border**: `1px solid #d1d5db` (Gray-300)
- **Text Color**: `#374151` (Gray-700)
- **Hover Background**: `#f9fafb` (Gray-50)

#### Teal Active Sidebar Button
- **Background**: `#ccfbf1` (Teal-100, `bg-teal-100`)
- **Text Color**: `#0f766e` (Teal-700, `text-teal-700`)
- **Hover**: Same (no change, `hover:bg-teal-100`)

---

## Form Elements

### Input Fields

#### Standard Input
- **Height**: `36px` (`h-9`)
- **Padding**: `px-3 py-1` = `12px horizontal, 4px vertical`
- **Background**: `#f3f3f5` (`--input-background`)
- **Border**: `1px solid` `--input` (transparent by default)
- **Border Radius**: `6px` (rounded-md)
- **Font Size**: `text-base` (14px) / `text-sm` (12px on md+ screens)
- **Font Weight**: `400` (Normal)
- **Transition**: `transition-[color,box-shadow]`

**Focus State:**
- **Border Color**: `--ring` focus
- **Ring**: `--ring/50` (50% opacity)
- **Ring Width**: `3px` (`focus-visible:ring-[3px]`)
- **Outline**: `outline-none`

**Invalid State:**
- **Ring**: `--destructive/20` (20% opacity)
- **Border**: `--destructive`

**Placeholder:**
- **Color**: `--muted-foreground` (Medium gray)

#### Textarea
- **Min Height**: Varies by usage
- **Padding**: Same as input (`px-3 py-1`)
- **Background**: `#f3f3f5` (`--input-background`)
- **Resize**: `resize-none` (typically)
- **All other properties**: Same as standard input

### Select Dropdowns

#### Select Trigger
- **Height**: `32px` (`h-8` default) / `28px` (`h-7` small)
- **Padding**: `pl-3 pr-1 py-1` = `12px left, 4px right, 4px vertical`
- **Background**: `#f3f3f5` (`--input-background`)
- **Border**: `1px solid` `--input`
- **Border Radius**: `6px` (rounded-md)
- **Font Size**: `text-sm` (12px)
- **Gap**: `gap-2` = `8px`
- **Chevron Icon**: `16px × 16px` (size-4), 50% opacity

**Focus State:**
- **Border Color**: `--ring`
- **Ring**: `--ring/50` (50% opacity)
- **Ring Width**: `3px`

#### Select Content (Dropdown Menu)
- **Background**: `--popover` (White)
- **Border**: `1px solid` border color
- **Border Radius**: `6px` (rounded-md)
- **Shadow**: `shadow-md`
- **Max Height**: `var(--radix-select-content-available-height)`
- **Padding**: `4px` (p-1)
- **Z-Index**: `50`

#### Select Item
- **Padding**: `py-1.5 pr-8 pl-2` = `6px vertical, 32px right, 8px left`
- **Font Size**: `text-sm` (12px)
- **Border Radius**: `2px` (rounded-sm)
- **Cursor**: `cursor-default`

**Hover/Focus State:**
- **Background**: `--accent`
- **Text Color**: `--accent-foreground`

**Selected State:**
- **Check Icon**: `16px × 16px` (size-4) in right position
- **Icon Position**: `absolute right-2`

### Checkbox

#### Checkbox Box
- **Size**: `16px × 16px` (`size-4`)
- **Border**: `1px solid` border color
- **Border Radius**: `4px` (rounded-[4px])
- **Background**: `#f3f3f5` (`--input-background`)
- **Shadow**: `shadow-xs` (Subtle)
- **Transition**: `transition-shadow`

**Checked State:**
- **Background**: `--primary` (Near black)
- **Border Color**: `--primary`
- **Text Color**: `--primary-foreground` (White)
- **Check Icon**: `14px × 14px` (size-3.5)

**Focus State:**
- **Border Color**: `--ring`
- **Ring**: `--ring/50` (50% opacity)
- **Ring Width**: `3px`

**Disabled State:**
- **Opacity**: `50%`
- **Cursor**: `not-allowed`

### Switch (Toggle)

#### Switch Track
- **Height**: `18.4px` (h-[1.15rem])
- **Width**: `32px` (w-8)
- **Border Radius**: `9999px` (rounded-full)
- **Border**: `1px solid transparent`
- **Transition**: `transition-all`

**Unchecked State:**
- **Background**: `#cbced4` (`--switch-background`)

**Checked State:**
- **Background**: `--primary` (Near black)

#### Switch Thumb
- **Size**: `16px × 16px` (size-4)
- **Border Radius**: `9999px` (rounded-full)
- **Background**: `--card` (White)
- **Transition**: `transition-transform`

**Thumb Position:**
- **Unchecked**: `translateX(0)`
- **Checked**: `translateX(calc(100% - 2px))`

**Focus State:**
- **Border Color**: `--ring`
- **Ring**: `--ring/50` (50% opacity)
- **Ring Width**: `3px`

### Calendar Component
- **Font Size**: `text-sm` (12px)
- **Padding**: Varies by date cell
- **Border Radius**: `6px` (rounded-md)
- **Selected Date Background**: Primary color
- **Today Indicator**: Border or background accent

---

## Tables

### Table Container
- **Width**: `100%`
- **Max Width**: `calc(100vw - 280px)` (Account for sidebar)
- **Overflow**: `overflow-x-auto` (horizontal scroll)

### Custom Horizontal Scrollbar
- **Height**: `4px` (h-1)
- **Background**: `#e5e7eb` (Gray-200, bg-gray-200)
- **Border Radius**: `9999px` (rounded-full)
- **Margin Bottom**: `8px` (mb-2)
- **Position**: Above table headers
- **Opacity**: `0` when not needed (transitions to `1`)
- **Transition**: `opacity 200ms`

**Scrollbar Thumb:**
- **Height**: `4px` (h-full)
- **Background**: `#9ca3af` (Gray-400, bg-gray-400)
- **Hover Background**: `#6b7280` (Gray-500, bg-gray-500)
- **Border Radius**: `9999px` (rounded-full)
- **Transition**: `colors 150ms ease-out`

### Table Element
- **Width**: `min-w-full`
- **Font Size**: `text-sm` (12px)
- **Background**: White

### Table Header Row
- **Border Bottom**: `1px solid` border color
- **Background**: White (sticky in some cases)

### Table Header Cell (th)
- **Height**: `40px` (`h-10`)
- **Padding**: `px-2` = `8px horizontal`
- **Text Align**: `left`
- **Font Weight**: `500` (Medium)
- **Font Size**: `text-sm` (12px)
- **Color**: `--foreground` (Near black)
- **White Space**: `nowrap`
- **Min Width**: `160px` (standard) / `80px` (checkbox column)
- **Vertical Align**: `middle`

### Table Body Row
- **Border Bottom**: `1px solid` border color
- **Transition**: `transition-colors`

**Hover State:**
- **Background**: `--muted/50` (Light gray, 50% opacity)

**Selected State:**
- **Background**: `--muted` (Light gray)

### Table Cell (td)
- **Padding**: `p-2` = `8px all around`
- **Vertical Align**: `middle`
- **White Space**: `nowrap`
- **Min Width**: `160px` (standard) / `80px` (checkbox column)
- **Font Size**: `text-sm` (12px)
- **Color**: `--foreground`

### Checkbox Column
- **Min Width**: `80px`
- **Padding Right**: `0`
- **Checkbox Vertical Alignment**: `translate-y-[2px]`

### Pagination Controls
- **Height**: `40px`
- **Padding**: `px-4 py-2` = `16px horizontal, 8px vertical`
- **Background**: White
- **Border Top**: `1px solid` border color
- **Display**: `flex items-center justify-between`

**Page Info Text:**
- **Font Size**: `text-sm` (12px)
- **Color**: `text-gray-600`

**Pagination Buttons:**
- **Size**: Small button size (`h-8`)
- **Gap**: `gap-2` = `8px`

---

## Notifications & Toasts

### Toast Notifications (Sonner)
*(Via `toast` from `sonner@2.0.3`)*

- **Position**: Typically top-right or bottom-right
- **Width**: Auto
- **Padding**: Default sonner padding
- **Border Radius**: `8px` (rounded-lg)
- **Shadow**: `shadow-lg`
- **Duration**: Default 3-4 seconds
- **Animation**: Slide in/out

**Toast Types:**
- **Success**: Green styling
- **Error**: Red styling
- **Info**: Blue styling
- **Warning**: Yellow styling

### Notification Tray

#### Notification Tray Container
- **Width**: `384px` (`w-96`)
- **Max Height**: `600px`
- **Background**: White
- **Border Radius**: `8px` (rounded-lg)
- **Border**: `1px solid #e5e7eb` (Gray-200)
- **Shadow**: `shadow-xl`

#### Notification Tray Header
- **Padding**: `16px` (p-4)
- **Border Bottom**: `1px solid #e5e7eb` (Gray-200)
- **Display**: `flex items-center justify-between`

**Header Title:**
- **Font Size**: `text-lg` (18px)
- **Icon**: Bell icon, `20px × 20px` (h-5 w-5), Gray-700

**Unread Badge:**
- **Background**: `#2563eb` (Blue-600)
- **Text Color**: White
- **Font Size**: `text-xs` (10px)
- **Padding**: `px-2 py-0.5` = `8px horizontal, 2px vertical`
- **Border Radius**: `9999px` (rounded-full)

#### Notification Item
- **Padding**: `16px` (p-4)
- **Border Bottom**: `1px solid #e5e7eb` (Gray-200)
- **Cursor**: `pointer`
- **Transition**: `transition-colors`

**Unread Background:**
- **Success**: `#f0fdf4` (Green-50)
- **Error**: `#fef2f2` (Red-50)
- **Warning**: `#fefce8` (Yellow-50)
- **Info**: `#eff6ff` (Blue-50)

**Read Background:**
- **All Types**: White

**Hover State:**
- **Background**: `#f9fafb` (Gray-50)

**Notification Icon:**
- **Size**: `20px × 20px` (h-5 w-5)
- **Success**: `#16a34a` (Green-600)
- **Error**: `#dc2626` (Red-600)
- **Warning**: `#ca8a04` (Yellow-600)
- **Info**: `#2563eb` (Blue-600)

**Notification Text:**
- **Title Font Size**: `text-sm` (12px)
- **Title Color**: `text-gray-900`
- **Message Font Size**: `text-sm` (12px)
- **Message Color**: `#6b7280` (Gray-600)
- **Timestamp Font Size**: `text-xs` (10px)
- **Timestamp Color**: `#9ca3af` (Gray-500)

**Unread Indicator Dot:**
- **Size**: `8px × 8px` (w-2 h-2)
- **Background**: `#2563eb` (Blue-600)
- **Border Radius**: `9999px` (rounded-full)
- **Position**: Inline with title

**Close Button:**
- **Size**: `16px × 16px` (h-4 w-4 icon)
- **Padding**: `4px` (p-1)
- **Color**: `#9ca3af` (Gray-400) hover `#6b7280` (Gray-600)
- **Border Radius**: `9999px` (rounded-full)
- **Hover Background**: `#e5e7eb` (Gray-200)
- **Opacity**: `0` default, `100` on group-hover

#### Empty State
- **Padding**: `32px` (p-8)
- **Text Align**: `center`
- **Text Color**: `#9ca3af` (Gray-500)
- **Icon Size**: `48px × 48px` (h-12 w-12)
- **Icon Color**: `#d1d5db` (Gray-300)

### Fetching Status Tray

#### Container
- **Width**: `384px` (`w-96`)
- **Max Height**: `600px`
- **Background**: White
- **Border Radius**: `8px` (rounded-lg)
- **Border**: `1px solid #e5e7eb` (Gray-200)
- **Shadow**: `shadow-xl`

#### Header
- **Padding**: `16px` (p-4)
- **Border Bottom**: `1px solid #e5e7eb` (Gray-200)

**Active Fetching:**
- **Icon**: Hourglass, `20px × 20px`, Blue-600, spinning
- **Title Font Size**: `text-lg` (18px)
- **Subtitle Font Size**: `text-xs` (10px)
- **Subtitle Color**: `#9ca3af` (Gray-500)

**All Complete:**
- **Icon**: CheckCircle2, `20px × 20px`, Green-600
- **Title Font Size**: `text-lg` (18px)

#### Status Message
- **Padding**: `12px 16px` (px-4 py-3)
- **Border Bottom**: `1px solid #e5e7eb` (Gray-200)
- **Font Size**: `text-sm` (12px)
- **Color**: `#6b7280` (Gray-600)

#### Progress Item
- **Padding**: `16px` (p-4)
- **Transition**: `transition-colors`

**Active Fetch Background:**
- **Background**: `#eff6ff` (Blue-50)
- **Hover**: `#dbeafe` (Blue-100)

**Complete Fetch Background:**
- **Background**: `#f0fdf4` (Green-50)
- **Hover**: `#dcfce7` (Green-100)

**Content Type Label:**
- **Font Weight**: `500` (Medium)
- **Font Size**: `text-sm` (12px)

**Status Label:**
- **Font Size**: `text-sm` (12px)
- **Active**: `#2563eb` (Blue-600), "In Progress"
- **Complete**: `#16a34a` (Green-600), "Complete"

**Progress Bar:**
- **Height**: `8px` (h-2)
- **Border Radius**: `9999px` (rounded-full)
- **Active Background**: `#bfdbfe` (Blue-200)
- **Complete Background**: `#bbf7d0` (Green-200)
- **Progress Indicator**: Primary color or completion color

**Progress Text:**
- **Font Size**: `text-sm` (12px)
- **Numbers Font Weight**: `700` (Bold)

### Global Fetching Indicator (Celebration Widget)

#### Container
- **Width**: `420px` (`w-[420px]`)
- **Position**: Fixed `bottom-6 right-6`
- **Z-Index**: `50`
- **Shadow**: `shadow-2xl`
- **Border Radius**: `12px` (rounded-xl)

#### Header
- **Background Gradient**: `from-green-600 to-green-700`
- **Padding**: `20px` (px-5 py-4)
- **Display**: `flex items-center justify-between`
- **Cursor**: `pointer`

**Header Icon:**
- **Icon**: CheckCircle2, `24px × 24px` (h-6 w-6)
- **Color**: White
- **Animation**: Scale and rotate on initial load

**Header Text:**
- **Font Size**: `text-lg` (18px)
- **Font Weight**: `600` (Semibold)
- **Color**: White

**Count Badge:**
- **Background**: `white/20` (20% white)
- **Padding**: `px-2 py-0.5` = `8px horizontal, 2px vertical`
- **Border Radius**: `9999px` (rounded-full)
- **Font Size**: `text-xs` (10px)
- **Font Weight**: `600` (Semibold)

**Expand/Collapse Icon:**
- **Icon**: ChevronDown/ChevronUp, `20px × 20px` (h-5 w-5)
- **Color**: White
- **Hover Background**: `white/10` (10% white)
- **Border Radius**: `4px` (rounded)
- **Padding**: `4px` (p-1)

#### Content (Expanded)
- **Max Height**: `400px`
- **Overflow**: `overflow-y-auto`
- **Background**: White
- **Border**: `2px solid #bbf7d0` (Green-200, border-2 border-green-200)

#### Completed Fetch Item
- **Padding**: `20px` (p-5)
- **Border Bottom**: `1px solid #f3f4f6` (Gray-100)
- **Background Gradient**: `from-green-50 to-emerald-50`
- **Display**: `flex items-start justify-between`

**Item Icon:**
- **Icon**: CheckCircle2, `28px × 28px` (h-7 w-7)
- **Color**: `#16a34a` (Green-600)
- **Position**: Relative for ring effect

**Pulsing Ring Animation:**
- **Border**: `2px solid #16a34a` (Green-600)
- **Border Radius**: `9999px` (rounded-full)
- **Animation**: Scale from 1 to 2, opacity from 1 to 0
- **Duration**: `0.8s`
- **Repeat**: `2` times
- **Ease**: `ease-out`

**Item Title:**
- **Font Size**: `text-base` (14px) / `16px`
- **Font Weight**: `600` (Semibold)
- **Color**: `#111827` (Gray-900)

**Item Success Message:**
- **Font Size**: `text-sm` (12px)
- **Color**: `#15803d` (Green-700)
- **Font Weight**: `500` (Medium)
- **Checkmark**: `#16a34a` (Green-600)

**Dismiss Button:**
- **Icon**: X, `16px × 16px` (h-4 w-4)
- **Color**: `#9ca3af` (Gray-400) hover `#6b7280` (Gray-600)
- **Padding**: `6px` (p-1.5)
- **Border Radius**: `4px` (rounded)
- **Hover Background**: `#f3f4f6` (Gray-100)

---

## Animations

### CSS Animations

#### 1. Download Slow (Hourglass Icon)
**Keyframes:**
```
@keyframes downloadSlow {
  0%, 100% { transform: translateY(-2px); }
  50% { transform: translateY(2px); }
}
```
- **Duration**: `1.5s`
- **Timing Function**: `ease-in-out`
- **Iteration**: `infinite`
- **Usage**: Fetching icon vertical bob

#### 2. Download Arrow
**Keyframes:**
```
@keyframes downloadArrow {
  0%, 100% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(3px); opacity: 0.7; }
}
```
- **Duration**: `1.2s`
- **Timing Function**: `ease-in-out`
- **Iteration**: `infinite`
- **Usage**: Download icon arrow movement

#### 3. Download Dot
**Keyframes:**
```
@keyframes downloadDot {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}
```
- **Duration**: `1.2s`
- **Timing Function**: `ease-in-out`
- **Iteration**: `infinite`
- **Usage**: Loading dots

#### 4. Spin (Generic)
- **CSS Class**: `animate-spin`
- **Transform**: `rotate(0deg)` to `rotate(360deg)`
- **Duration**: `1s` (typical)
- **Timing Function**: `linear`
- **Iteration**: `infinite`
- **Usage**: Loading spinners, hourglass icon

### Motion (Framer Motion) Animations

#### 1. Celebration Confetti
**Confetti Particle:**
- **Initial State:**
  - `top: 50%`
  - `left: 50%`
  - `scale: 0`
- **Animate State:**
  - `top: ${Math.random() * 100}%`
  - `left: ${Math.random() * 100}%`
  - `scale: [0, 1, 0]` (array sequence)
  - `rotate: Math.random() * 360`
- **Transition:**
  - `duration: 2s`
  - `ease: easeOut`
  - `delay: Math.random() * 0.3s`
- **Count**: 50 particles
- **Colors**: Green, Blue, Orange, Red, Purple (random)
- **Size**: `12px × 12px` (w-3 h-3)
- **Shape**: Circular (rounded-full)
- **Trigger**: When fetch completes
- **Display Duration**: 3 seconds

#### 2. Celebration Widget Entry
- **Initial State:**
  - `y: 100` (below screen)
  - `opacity: 0`
  - `scale: 0.8`
- **Animate State:**
  - `y: 0`
  - `opacity: 1`
  - `scale: 1`
- **Transition:**
  - `type: spring`
  - `stiffness: 300`
  - `damping: 25`

#### 3. Celebration Widget Exit
- **Exit State:**
  - `y: 100` (below screen)
  - `opacity: 0`
  - `scale: 0.8`

#### 4. Check Icon Entry (Celebration)
- **Initial State:**
  - `scale: 0`
  - `rotate: -180deg`
- **Animate State:**
  - `scale: 1`
  - `rotate: 0deg`
- **Transition:**
  - `type: spring`
  - `stiffness: 200`
  - `damping: 10`

#### 5. Pulsing Ring Effect
- **Initial State:**
  - `scale: 1`
  - `opacity: 1`
- **Animate State:**
  - `scale: 2`
  - `opacity: 0`
- **Transition:**
  - `repeat: 2`
  - `duration: 0.8s`
  - `ease: easeOut`

#### 6. Completed Fetch Item Entry
- **Initial State:**
  - `opacity: 0`
  - `scale: 0.9`
  - `y: 20` (below)
- **Animate State:**
  - `opacity: 1`
  - `scale: 1`
  - `y: 0`
- **Transition:**
  - `type: spring`
  - `stiffness: 200`
  - `damping: 20`

#### 7. Completed Fetch Item Exit
- **Exit State:**
  - `opacity: 0`
  - `scale: 0.9`
  - `x: 100` (to the right)

#### 8. Text Stagger (Celebration)
- **Title Delay**: `0.2s`
- **Success Message Delay**: `0.3s`
- **Initial**: `x: -10`, `opacity: 0`
- **Animate**: `x: 0`, `opacity: 1`

#### 9. Count Badge Entrance
- **Initial State:**
  - `scale: 0`
- **Animate State:**
  - `scale: 1`

#### 10. Content Expand/Collapse
- **Initial State:**
  - `height: 0`
  - `opacity: 0`
- **Animate State:**
  - `height: auto`
  - `opacity: 1`
- **Exit State:**
  - `height: 0`
  - `opacity: 0`
- **Transition:**
  - `duration: 0.2s`

### Dialog/Modal Animations (Radix UI)

#### Modal Open
- **Overlay**: `fade-in-0` (fade in from 0% opacity)
- **Content**: 
  - `fade-in-0`
  - `zoom-in-95` (scale from 95% to 100%)
- **Duration**: `200ms` (default)

#### Modal Close
- **Overlay**: `fade-out-0`
- **Content**: 
  - `fade-out-0`
  - `zoom-out-95` (scale to 95%)
- **Duration**: `200ms` (default)

### Progress Bar Animation
- **Property**: `transform`
- **Transform**: `translateX(-${100 - value}%)`
- **Transition**: `transition-all` (smooth)
- **Duration**: Default CSS transition duration

---

## Status Indicators

### Status Badges

#### Success Badge
- **Background**: `#dcfce7` (Green-100)
- **Text Color**: `#166534` (Green-800)
- **Border**: `1px solid #bbf7d0` (Green-200)
- **Padding**: `px-2 py-0.5` = `8px horizontal, 2px vertical`
- **Font Size**: `text-xs` (10px)
- **Font Weight**: `500` (Medium)
- **Border Radius**: `6px` (rounded-md)
- **Text**: "Success"

#### Error Badge
- **Background**: `#fee2e2` (Red-100)
- **Text Color**: `#991b1b` (Red-800)
- **Border**: `1px solid #fecaca` (Red-200)
- **Padding**: `px-2 py-0.5` = `8px horizontal, 2px vertical`
- **Font Size**: `text-xs` (10px)
- **Font Weight**: `500` (Medium)
- **Border Radius**: `6px` (rounded-md)
- **Text**: "Error"

### Loading Indicators

#### Spinner (Hourglass/Download Icon)
- **Size**: `16px × 16px` (h-4 w-4) to `20px × 20px` (h-5 w-5)
- **Color**: `#2563eb` (Blue-600) when active
- **Animation**: `animate-spin` or `animate-download-slow`
- **Usage**: Button loading states, fetch status

#### Progress Bar
- **Container Height**: `8px` (h-2)
- **Container Background**: `--primary/20` (20% opacity) or color-specific
- **Container Border Radius**: `9999px` (rounded-full)
- **Indicator Background**: `--primary` or color-specific
- **Indicator Transition**: `transition-all` (smooth)
- **Indicator Transform**: Based on percentage value

#### Skeleton Loader
- **Background**: `--muted` (Light gray)
- **Animation**: Pulse or shimmer
- **Border Radius**: Matches content it replaces
- **Usage**: Loading placeholders

### Fetch Status Indicators

#### Active Fetch Count Badge (Header)
- **Background Gradient**: `from-blue-500 to-blue-600`
- **Text Color**: White
- **Font Size**: `text-[10px]` (10px)
- **Min Width**: `16px`
- **Height**: `16px`
- **Padding**: Centered
- **Border Radius**: `9999px` (rounded-full)
- **Font Weight**: `500` (Medium)
- **Shadow**: `shadow-lg`
- **Border**: `2px solid white`
- **Position**: `absolute -top-1 -right-1`

#### Complete Status (Green)
- **Icon**: CheckCircle2
- **Icon Color**: `#16a34a` (Green-600)
- **Background**: `#f0fdf4` (Green-50)
- **Border**: `#bbf7d0` (Green-200)
- **Text Color**: `#15803d` (Green-700)

#### In Progress Status (Blue)
- **Icon**: Download or Hourglass
- **Icon Color**: `#2563eb` (Blue-600)
- **Background**: `#eff6ff` (Blue-50)
- **Border**: `#bfdbfe` (Blue-200)
- **Text Color**: `#1d4ed8` (Blue-700)

---

## Layout & Spacing

### Application Layout

#### Overall Structure
- **Display**: Flex column, full viewport height
- **Background**: White (`#ffffff`)

#### Header
- **Height**: `64px` (`h-16`)
- **Background**: White
- **Border Bottom**: `1px solid #e5e7eb` (Gray-200)
- **Padding**: `px-6` = `24px horizontal`
- **Display**: `flex items-center justify-between`
- **Z-Index**: Elevated for dropdowns

#### Main Content Area
- **Display**: Flex row
- **Flex**: `flex-1` (fills remaining height)

### Sidebar

#### Sidebar Container
- **Width**: `256px` (`w-64`)
- **Background**: White
- **Border Right**: `1px solid #e5e7eb` (Gray-200)
- **Height**: `100%` (full height)
- **Display**: Flex column

#### Sidebar Logo Section
- **Padding**: `24px` (p-6)
- **Gap**: `16px` (gap-4 between elements)

**Logo Icon:**
- **Font Size**: `text-xl` (20px)
- **Font Weight**: `700` (Bold)
- **Color**: `#14b8a6` (Teal-500)
- **Text**: `{:-}`

**Logo Text:**
- **Font Size**: `text-xl` (20px)
- **Font Weight**: `700` (Bold)
- **Color**: `#14b8a6` (Teal-500)
- **Text**: "smuves"

#### Portal Selector (Dropdown Button)
- **Width**: `100%` (w-full)
- **Height**: Auto (`h-auto`)
- **Padding**: `py-2.5 px-3` = `10px vertical, 12px horizontal`
- **Background**: `#f9fafb` (Gray-50)
- **Hover Background**: `#f3f4f6` (Gray-100)
- **Border**: `1px solid #e5e7eb` (Gray-200)
- **Border Radius**: `6px` (rounded-md)

**Portal ID Label:**
- **Font Size**: `text-xs` (10px)
- **Color**: `#9ca3af` (Gray-500)

**Portal ID Value:**
- **Font Size**: `text-sm` (12px)
- **Font Weight**: `500` (Medium)
- **Color**: `#111827` (Gray-900)
- **Truncate**: `truncate` (ellipsis if too long)

#### Sidebar Navigation
- **Padding**: `px-4` = `16px horizontal`
- **Flex**: `flex-1` (fills remaining space)

#### Navigation Sections
- **Section Label**:
  - **Font Size**: `text-xs` (10px)
  - **Font Weight**: `500` (Medium)
  - **Color**: `#9ca3af` (Gray-500)
  - **Padding**: `px-3 mb-2` = `12px horizontal, 8px bottom margin`
  - **Spacing**: `mt-6` = `24px top margin` (between sections)

#### Navigation Button
- **Width**: `100%` (w-full)
- **Height**: `40px` (`h-10`)
- **Padding**: `px-3` = `12px horizontal`
- **Gap**: `12px` (gap-3 between icon and text)
- **Display**: `flex items-center`
- **Border Radius**: `6px` (rounded-md)

**Inactive State:**
- **Background**: Transparent
- **Text Color**: `#6b7280` (Gray-600)
- **Hover Text**: `#111827` (Gray-900)
- **Hover Background**: Subtle gray

**Active State:**
- **Background**: `#ccfbf1` (Teal-100, bg-teal-100)
- **Text Color**: `#0f766e` (Teal-700, text-teal-700)
- **Hover**: Same (no change)

**Icon Size:**
- **Size**: `16px × 16px` (h-4 w-4)

### Main Content Area (Page Content)

#### Content Container
- **Flex**: `flex-1` (fills remaining width after sidebar)
- **Background**: `#f9fafb` (Gray-50, bg-gray-50)
- **Padding**: Varies by page, typically `p-6` = `24px`
- **Overflow**: `overflow-auto` (scrollable)

#### Page Header
- **Margin Bottom**: `mb-6` = `24px`
- **Display**: Flex row with justify-between

**Page Title:**
- **Font Size**: `text-2xl` (24px) to `text-3xl` (30px)
- **Font Weight**: `700` (Bold)
- **Color**: `#111827` (Gray-900)

#### Content Cards
- **Background**: White
- **Border Radius**: `8px` (rounded-lg)
- **Border**: `1px solid #e5e7eb` (Gray-200)
- **Padding**: `p-6` = `24px` (typical)
- **Shadow**: `shadow-sm` (subtle) or `shadow` (default)
- **Gap Between Cards**: `gap-6` = `24px`

### Last Updated Bar
- **Padding**: `4px 20px` (`pt-1 pb-1 px-5`)
- **Text Align**: `right`
- **Font Size**: `text-sm` (12px)
- **Color**: `#6b7280` (Gray-600)
- **Background**: Transparent or card background
- **Margin**: `0` (explicitly set to zero)

### Smart Selection Bar (Bulk Actions Bar)
- **Position**: Fixed or sticky at bottom/top of table
- **Background**: White or card background
- **Border**: `1px solid #e5e7eb` (Gray-200)
- **Padding**: `p-4` = `16px`
- **Display**: `flex items-center justify-between`
- **Shadow**: `shadow-lg` (elevated)
- **Gap**: `gap-4` = `16px`

---

## Date & Time Format

### Global Format
**Format Pattern**: `"Full Month date, year, HH:MM:SS"`

**Example**: `"January 15, 2024, 14:30:45"`

### Format Specifications

#### Date Part
- **Month**: Full month name (e.g., "January", "February")
- **Day**: Numeric day (e.g., "1", "15", "31")
- **Year**: Four-digit year (e.g., "2024")
- **Separator**: Comma after day (", ")

#### Time Part
- **Hour Format**: 24-hour format (00-23)
- **Hour**: Two digits with leading zero (e.g., "05", "14")
- **Minute**: Two digits with leading zero (e.g., "00", "30")
- **Second**: Two digits with leading zero (e.g., "00", "45")
- **Separator**: Colon (":") between hour, minute, second
- **Separator Before Time**: Comma and space (", ")

### Usage Contexts
1. **Last Updated Bar**: Full format with year and seconds
2. **Table Cells**: Full format
3. **Notification Timestamps**: Full format
4. **Log Entries**: Full format
5. **Backup Timestamps**: Full format

### Implementation
- **Utility File**: `/utils/dateFormat.ts`
- **Main Function**: `formatGlobalDateTime(date, options?)`
- **Alternative Functions**: 
  - `formatGlobalDate(date, includeYear?)` - Date only
  - `formatGlobalTime(date, options?)` - Time only
  - `formatLastUpdated(date)` - Specific for last updated bar
  - `formatTableDateTime(date)` - Specific for tables

---

## Additional Component Details

### Dropdown Menus (DropdownMenu)
- **Background**: White (`--popover`)
- **Border**: `1px solid` border color
- **Border Radius**: `8px` (rounded-lg)
- **Shadow**: `shadow-lg`
- **Padding**: `4px` (p-1)
- **Min Width**: `8rem` (128px)
- **Z-Index**: `50`

**Dropdown Item:**
- **Padding**: `py-2 px-3` = `8px vertical, 12px horizontal`
- **Font Size**: `text-sm` (12px)
- **Border Radius**: `4px` (rounded-sm)
- **Cursor**: `pointer`
- **Hover Background**: `--accent`
- **Hover Text**: `--accent-foreground`

**Dropdown Separator:**
- **Height**: `1px` (h-px)
- **Background**: `--border`
- **Margin**: `4px -4px` (my-1 -mx-1)

### Popover (Generic)
- **Background**: `--popover`
- **Border**: `1px solid` border color
- **Border Radius**: `8px` (rounded-lg)
- **Shadow**: `shadow-md`
- **Padding**: Varies by content
- **Z-Index**: `50`
- **Max Height**: Content-dependent

### Tooltip
- **Background**: `--primary` (Near black)
- **Text Color**: `--primary-foreground` (White)
- **Padding**: `px-3 py-1.5` = `12px horizontal, 6px vertical`
- **Font Size**: `text-xs` to `text-sm` (10-12px)
- **Border Radius**: `6px` (rounded-md)
- **Shadow**: `shadow-md`
- **Z-Index**: `50`
- **Arrow**: Optional, matches background

### Scroll Area
- **Scrollbar Width**: `thin` (Firefox)
- **Scrollbar Color**: Track and thumb colors
- **WebKit Scrollbar Width**: `8px`
- **WebKit Track**: Light gray
- **WebKit Thumb**: Medium gray
- **WebKit Thumb Hover**: Darker gray

### Accordion
- **Border**: `1px solid` border color
- **Border Radius**: `8px` (rounded-lg)
- **Background**: White
- **Trigger Padding**: `py-4 px-5` = `16px vertical, 20px horizontal`
- **Content Padding**: `px-5 pb-4` = `20px horizontal, 16px bottom`

### Card Component
- **Background**: White (`--card`)
- **Text Color**: `--card-foreground`
- **Border**: `1px solid` border color
- **Border Radius**: `10px` (rounded-lg, `--radius`)
- **Shadow**: `shadow-sm` (subtle)
- **Padding**: `p-6` = `24px` (typical)

---

## Summary Statistics

### Total Colors Used
- **Light Theme**: 50+ distinct colors
- **Dark Theme**: 30+ colors (defined but not actively used)
- **Status Colors**: 5 types (Success, Error, Warning, Info, Neutral)
- **Chart Colors**: 5 distinct chart colors
- **Confetti Colors**: 5 celebration colors

### Total Font Sizes
- **10px** (text-xs): Micro text, badges, timestamps
- **12px** (text-sm): Small text, table content, buttons
- **14px** (text-base): Default body text, inputs
- **16px**: Base-scaled sizes
- **18px** (text-lg): Section headers, modal titles
- **20px** (text-xl): Major headers, page titles
- **24px** (text-2xl): H1 headings
- **30px** (text-3xl): Extra large headings

### Total Modal Types
- **9 major modal types** with consistent 90vw × 90vh sizing
- **2 tray types** (Notification, Fetching Status) at 384px × 600px
- **1 celebration widget** at 420px width, variable height

### Total Button Variants
- **6 variants**: Default, Outline, Destructive, Ghost, Link, Secondary
- **4 sizes**: Small (32px), Default (36px), Large (40px), Icon (36px × 36px)

### Total Animations
- **3 CSS keyframe animations**: downloadSlow, downloadArrow, downloadDot
- **10+ Motion (Framer Motion) animations**: Confetti, widget entry/exit, icon animations, etc.
- **Duration range**: 0.2s to 2s
- **Easing functions**: ease-in-out, ease-out, linear, spring

### Border Radius Values
- **4 standard sizes**: 6px (small), 8px (medium), 10px (large/default), 14px (extra large)
- **Full rounding**: 9999px (pills, circles, badges)

---

## Accessibility Notes

### Focus States
All interactive elements have visible focus indicators:
- **Focus Ring**: 3px width
- **Focus Ring Color**: `--ring` (with 50% opacity typically)
- **Focus Border**: Enhanced border color
- **Focus Outline**: Set to `none` (ring replaces it)

### Color Contrast
- **Text on White Background**: Near-black text (`oklch(0.145 0 0)`) ensures high contrast
- **Status Colors**: All status colors meet WCAG AA standards for text readability
- **Disabled States**: 50% opacity with `not-allowed` cursor

### Keyboard Navigation
- **Tab Order**: Logical flow through interactive elements
- **Enter/Space**: Activates buttons and checkboxes
- **Escape**: Closes modals and dropdowns
- **Arrow Keys**: Navigate through select options and dropdown items

### Screen Reader Support
- **Labels**: All form inputs have associated labels
- **ARIA Labels**: Used for icon-only buttons
- **SR-Only Text**: Hidden text for screen readers (e.g., "Close" on X buttons)
- **Role Attributes**: Proper roles for custom components

---

## Design System Summary

This Smuves dashboard implements a clean, modern design system with:

1. **Consistent Typography**: 14px base font size with clear hierarchy
2. **Teal Brand Color**: Primary brand color used for logos, active states, and accents
3. **Status-Driven Colors**: Clear visual feedback with green (success), red (error), blue (info), yellow (warning)
4. **Uniform Modal Sizing**: All modals at 90% viewport dimensions for consistency
5. **Smooth Animations**: Transition durations of 150-300ms for UI interactions, 2s for celebrations
6. **Comprehensive Feedback**: Loading states, progress indicators, celebration animations
7. **Accessible Design**: High contrast, focus indicators, keyboard navigation
8. **Date Format Standard**: "January 15, 2024, 14:30:45" across entire platform
9. **Component Consistency**: Reusable components with variant-based styling
10. **Responsive Spacing**: 4px base unit with logical spacing scale

---

## File Structure Reference

- **Global Styles**: `/styles/globals.css`
- **Date Formatting**: `/utils/dateFormat.ts`
- **UI Components**: `/components/ui/`
- **Modal Components**: `/components/` (various modal files)
- **Context Providers**: `/components/` (various context files)

---

**Document Version**: 1.0  
**Last Updated**: January 7, 2026  
**Created For**: Designer Reference - Complete Design Specifications
