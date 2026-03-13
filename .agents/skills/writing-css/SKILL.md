---
name: writing-css
description: Rules for writing CSS.
---

# Writing CSS


## Use nesting

Use nesting to group related styles together and avoid repetition. For example:

```css
.widget {

  button {

  }
}
```

with...

```html
<div class="widget">
  <button>Click me</button>
```

instead of...

```html
<div class="widget">
  <button class="widget-button">Click me</button>
```


## Divide long CSS blocks into sections

```css
.widget {

  /* external layout */
  display: flex;
  flex-direction: column;
  gap: 8px; 

  /* internal layout */

  /* typography */

  /* decoration */
}
```
- only when more than a small handful of properties
- use other categories as needed, e.g. "states", "accessibility"


## Colors

- Use CSS variables for colors, defined in `:root` in `src/global.css`.
- When choosing new colors, prefer using existing variables. 
- If a new color is needed, add a new variable with a name that reflects its purpose if it is unlikely to be shared, or its color if it is likely to be shared. For example, `--button-fill-primary` or `--dark-purple`.
- It is often appropriate to compound variables, e.g. `--button-fill-primary: var(--dark-purple);`


## Site-wide styles

- For styles that apply to many components, such as typography, buttons, links, gap sizes, etc, look to global `src/ui.css` first and extend that file where appropriate.
- If a styling decision is specific to a single component, it should go in that component's CSS file.
- Use site-wide styles sparingly and default to encapsulating within components.