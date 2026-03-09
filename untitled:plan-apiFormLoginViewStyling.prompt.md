## Plan: Polish ApiForm and LoginView styling

Create component-scoped CSS for the form experience while keeping behavior changes minimal. The plan applies a neutral style that matches the current admin UI language (simple grayscale, modest radius/shadow, clear spacing) and covers both form controls and the login mode-switch area. Based on your decisions, the built-in Submit button in ApiForm will be removed so each child form owns its submit action, and scope includes LoginView visual polish. I also confirmed your extraArgs fix already exists in ApiForm, so this plan leaves that logic untouched.

**Steps**

1. Update structure hooks in [steward-admin/src/components/ApiForm/ApiForm.jsx](steward-admin/src/components/ApiForm/ApiForm.jsx): import ApiForm.css, add a root class on form, and remove the built-in Submit button so children control actions.
2. Add [steward-admin/src/components/ApiForm/ApiForm.css](steward-admin/src/components/ApiForm/ApiForm.css) with scoped descendant styles for label, input, button, spacing, focus states, and grouped actions using only neutral tones consistent with existing component CSS.
3. Update [steward-admin/src/components/LoginView/LoginView.jsx](steward-admin/src/components/LoginView/LoginView.jsx) to import LoginView.css and add minimal class hooks for wrapper, section body, and mode-switch/back buttons.
4. Add [steward-admin/src/components/LoginView/LoginView.css](steward-admin/src/components/LoginView/LoginView.css) to style the login container and auxiliary action buttons so they visually align with ApiForm controls.
5. Validate affected auth flows in development UI (login, request reset, set password) to ensure layout consistency and no submit regressions after removing the default ApiForm button.

**Verification**

- Run the app and manually check:
- Login mode: fields and primary submit button spacing/typography look consistent.
- Request reset mode: form plus back button hierarchy is clear.
- Set password mode: same visual treatment and no duplicate submit buttons.
- Keyboard focus ring appears clearly on inputs/buttons.
- No console errors from missing CSS imports.

**Decisions**

- Built-in ApiForm submit button: remove.
- Visual direction: match existing neutral UI language.
- Scope: include both ApiForm and LoginView polish.
- extraArgs handling: keep as-is since already fixed.
