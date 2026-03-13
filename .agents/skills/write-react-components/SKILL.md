---
name: write-react-components
description: "Use when creating a new React UI component. Generates a folder for the component, keeping JSX and CSS in separate files.
---

# Write React Components

## File structure

For a new component that whose use isn't limited to a specific parent component, create:

- `src/components/Widget/Widget.jsx`
- `src/components/Widget/Widget.css`

If the component is only used within a specific parent component, create:

- `src/components/ParentComponent/ChildComponent/ChildComponent.jsx`
- `src/components/ParentComponent/ChildComponent/ChildComponent.css`


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
