# Loan Tracker CRM - Design Guidelines

## Design Approach
**System-Based Approach**: Modern SaaS dashboard following established enterprise UI patterns with professional data management aesthetics. Clean, functional design prioritizing usability and information density.

## Core Design Principles
- Professional enterprise UI with clear data hierarchy
- Responsive-first: Desktop tables, mobile cards
- Consistent interaction patterns across all modules
- Clean, modern aesthetic with subtle depth through shadows
- Information-dense layouts optimized for workflow efficiency

## Typography & Spacing
**Spacing System**: Use Tailwind units of 2, 3, 4, and 6 for consistent rhythm
- Form padding: `p-4`, `p-6`
- Card spacing: `gap-4`
- Section margins: `mb-3`, `mb-4`

**Typography**:
- Footer: `text-xs text-gray-400`
- Body text: Default Tailwind sizes
- Maintain clear hierarchy in forms and tables

## Layout System

### Desktop View
- Tables with fixed headers: `sticky top-0 bg-gray-100`
- Scrollable bodies: `overflow-y-scroll max-h-[400px]`
- Grid dashboards: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`

### Mobile View
- Tables convert to cards: `block sm:hidden` (mobile), `hidden sm:block` (desktop)
- Full-width buttons: `w-full sm:w-auto`
- Card styling: `p-3 border rounded mb-3 shadow bg-white`

## Component Library

### Cards
- Base: `bg-white shadow rounded p-4 border`
- Hover state: `hover:shadow-md transition`

### Modals
- Backdrop with centered card
- Clean form layout with Tailwind inputs
- Action buttons at bottom

### Tables
- Clean header styling with borders
- Zebra striping optional
- Action column always first
- Mobile: Convert to cards with label-value pairs

### Forms
- Input fields with clear labels
- Icon support for login inputs
- Dropdown selects for categorical data
- Textarea for notes/remarks
- Checkbox groups for document collection and bank selection

### Buttons
- Primary actions prominent
- Secondary actions subtle
- Cancel/back actions clear

## Module-Specific Requirements

### Login Page
- Centered login card with shadow and rounded corners
- Input fields with icons
- Error toast notifications
- Clean, minimal design

### Dashboard
- Analytics cards in responsive grid
- Recent activity lists (5 items max)
- Clear numerical displays
- Quick navigation to modules

### Data Tables
- Fixed header with scrollable body
- Search/filter functionality
- Action buttons (Add, Edit, View, Update Status)
- Serial number display
- Clear column headers

### Document Module
- Checklist UI with checkboxes and upload buttons
- Pre-filled customer information
- Document types: ID Proof, Address Proof, Salary Slips, Bank Statements, Photo, Signature, Others

### Bank Selection
- Multiple bank checkboxes (HDFC, ICICI, SBI, Axis, Kotak, IndusInd, Bajaj, Others)
- Clear application ID display format: `BANK-[NAME]-[NUMBER]`

## Global Elements

### Footer
**Required on ALL pages**:
- Text: `www.botivate.in`
- Style: `text-center text-xs text-gray-400 py-3`
- Position: Bottom of every page

### Navigation
- Clear module access
- Active state indication
- Logout functionality

## Responsive Breakpoints
- Mobile: `block sm:hidden`
- Desktop: `hidden sm:block`
- Grid responsive: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

## Status Indicators
Use color coding for status states:
- Pending: Neutral/yellow tones
- Approved: Green
- Rejected: Red
- Under Review: Blue
- Clear visual differentiation in tables and cards

## No Animations
Keep interactions clean and instant - no decorative animations. Focus on data clarity and workflow efficiency.

---

**Key Insight**: This is a professional CRM tool prioritizing data management efficiency over marketing aesthetics. Every design decision should optimize for quick data entry, clear information display, and smooth workflow progression through the Lead → Document → Bank Selection → Bank Status pipeline.