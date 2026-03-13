---
name: react-component-pattern
description: "Use when creating a new React UI component. Generates a folder for the component, keeping JSX and CSS in separate files.
---

# React Component Pattern

## Required Output

For a new component `WidgetCard`, create:

- `src/components/WidgetCard/WidgetCard.jsx`
- `src/components/WidgetCard/WidgetCard.css`

## Templates

### `src/components/WidgetCard/WidgetCard.jsx`

```jsx
import "./WidgetCard.css";

export default function WidgetCard({ title, children }) {
  return (
    /** jsx **/
  );
}
```

### `src/components/WidgetCard/WidgetCard.css`

```css
.widget-card {
  display: flex;
  flex-direction: column;
  gap: 8px;

  h3 {
    margin: 0;
    font-size: 16px;
  }

  .widget-card-body {
    min-width: 0;
  }
}
```

## Checklist

- Created component folder in `src/components/<ComponentName>/`.
- Added both `*.jsx` and `*.css` files.
- Imported CSS from the component file.
- Used nested CSS under a root class.
- Updated parent imports and JSX usage.
- Removed stale duplicated styles from old location.
- Verified there are no diagnostics in changed files.
