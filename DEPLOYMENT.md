# Deployment to GitHub Pages

Yes, this application is fully compatible with GitHub Pages!

## Quick Start

1.  **Build the project**:
    ```bash
    npm run build
    ```
    This creates a `dist` folder with your static site.

2.  **Deploy**:
    You can deploy the `dist` folder to the `gh-pages` branch of your repository.

## Detailed Instructions

### Option 1: Manual Upload
1.  Run `npm run build`.
2.  Go to your GitHub repository settings -> Pages.
3.  Upload the contents of the `dist` folder.

### Option 2: Using `gh-pages` package (Recommended)
1.  Install the deployer:
    ```bash
    npm install --save-dev gh-pages
    ```
2.  Add this script to `package.json`:
    ```json
    "scripts": {
      "deploy": "gh-pages -d dist"
    }
    ```
3.  Run `npm run build && npm run deploy`.

### Option 3: GitHub Actions
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```
