VITE_API_BASE_URL=https://api.example.com

**Backend now uses PostgreSQL (on Render) for production, with data migrated from SQLite using pgloader.**

# Product Context: UI Architecture and Design

## UI Components
- Modular React components: PropertyForm, PropertyList, TicketForm, TicketList, UnitForm, UnitList.
- Uses Ant Design for layout and controls, plus custom CSS (theme.css, currently empty).
- Components manage their own loading, error, and success states, styled with `.card` and inline styles.

## Navigation System
- React Router for navigation (BrowserRouter, Routes, Route, Navigate, Link).
- Navbar in App.js, with dynamic menu options based on authentication and user role.
- Protected routes via ProtectedRoute component and AuthContext.

## Content Loading Patterns
- Data-fetching with useEffect on mount or dependency change.
- Loading, error, and empty states handled via conditional rendering.
- API calls use Axios with JWT in Authorization headers.

## State Management
- Local state via useState/useEffect in each component.
- Global auth state via React Context (AuthContext in App.js).
- No Redux/external state management; state is lifted as needed.

## Architectural Notes
- Clear separation of forms, lists, and detail views.
- Navigation/layout centralized in App.js, content in Ant Design Layout/Content.
- Theming possible via theme.css (currently not customized).

[2025-04-26 15:11:09] - Added documentation of UI components, navigation, content loading, and state management patterns.
