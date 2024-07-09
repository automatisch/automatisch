# Repository Structure

We use `lerna` with `yarn workspaces` to manage the mono repository. We have the following packages:

```
.
├── packages
│   ├── backend
│   ├── docs
│   ├── e2e-tests
│   └── web
```

- `backend` - The backend package contains the backend application and all integrations.
- `docs` - The docs package contains the documentation website.
- `e2e-tests` - The e2e-tests package contains the end-to-end tests for the internal usage.
- `web` - The web package contains the frontend application of Automatisch.
