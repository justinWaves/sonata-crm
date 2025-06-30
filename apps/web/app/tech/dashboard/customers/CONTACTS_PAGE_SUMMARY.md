# Sonata CRM Contacts Page – Modern Patterns & Features

## UI/UX Patterns
- **Responsive Design:**
  - Desktop: Table view with sticky header, pagination, and bulk actions bar.
  - Mobile: Card list view with beautiful, touch-friendly cards and a consistent action menu.
- **Sticky Header:**
  - Search bar and "Add Customer" button always visible at the top.
- **Modern Table:**
  - Fixed-width, truncated columns for phone, email, and address.
  - "..." (more) menu next to each field for contextual actions (copy, call, email, map, edit, delete).
  - Bulk actions bar appears at the bottom when items are selected.
- **Mobile Card List:**
  - Avatar, name, and a prominent "..." menu for all actions.
  - Info fields (phone, email, address) with subtle icons and clear visual hierarchy.
  - All actions (call, copy, email, map, edit, delete) in the menu for a clean look.
- **Loading States:**
  - Table: Skeleton rows matching the table layout.
  - Card List: 8 animated `SkeletonCard` placeholders matching the card shape.
- **Highlighting:**
  - Search term highlighting in both table and card list, using a shared utility.
- **Pagination:**
  - Consistent, accessible pagination for both views.

## Accessibility (a11y)
- **Keyboard Navigation:**
  - Table rows and cards: `tabIndex={0}` and `role="button"` for focusability.
  - Space/Enter triggers row/card actions (open details, edit, etc.).
- **Aria-labels:**
  - All actionable buttons (copy, delete, edit, etc.) have descriptive `aria-label`s.
- **Menu Actions:**
  - All menu items are keyboard accessible and have clear labels.
- **Focus States:**
  - All interactive elements have visible focus outlines.

## Code Patterns & Reusability
- **Componentization:**
  - Table, Card List, BulkBar, Pagination, SkeletonCard, and highlightMatch utility are all reusable.
- **Consistent Props:**
  - Both table and card list accept `isLoading`, `searchTerm`, and `highlightMatch` for unified logic.
- **Action Menus:**
  - Uses Headless UI `Menu` for accessible, modern dropdowns.
- **State Management:**
  - Optimistic updates for add/edit/delete.
  - Shared loading and search state.
- **Type Safety:**
  - All components use consistent, type-safe interfaces for customer data.

## Visual Design
- **Modern, Clean, and Intuitive:**
  - Soft backgrounds, rounded corners, subtle shadows.
  - Clear visual hierarchy for all fields.
  - Touch-friendly spacing and large tap targets on mobile.
- **Color Usage:**
  - Blue for primary actions, red for destructive, gray for info.
  - No excessive underlines; color and font indicate interactivity.

## How to Reuse These Patterns
- **For any entity (e.g., Appointments, Services, etc.):**
  - Use the same table/card split, sticky header, and action menu patterns.
  - Implement a `SkeletonCard` for loading states.
  - Use the shared `highlightMatch` utility for search highlighting.
  - Apply the same accessibility and keyboard navigation patterns.

---

**This page is a reference for building all modern, accessible, and beautiful CRUD pages in Sonata CRM.** 