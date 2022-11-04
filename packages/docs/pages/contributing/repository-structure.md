# Repository Structure

We use `lerna` with `yarn workspaces` to manage the mono repository. We have the following packages:

```
.
├── packages
│   ├── backend
│   ├── cli
│   ├── docs
│   ├── e2e-tests
│   ├── types
│   └── web
```

- `backend` - The backend package contains the backend application and all integrations.
- `cli` - The cli package contains the CLI application of Automatisch.
- `docs` - The docs package contains the documentation website.
- `e2e-tests` - The e2e-tests package contains the end-to-end tests for the internal usage.
- `types` - The types package contains the shared types for both the backend and web packages.
- `web` - The web package contains the frontend application of Automatisch.
