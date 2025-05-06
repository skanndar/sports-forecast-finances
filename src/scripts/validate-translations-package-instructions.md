
# Translation Validation Script

To add the translation validation script to package.json, add the following to the "scripts" section:

```json
"validate-translations": "ts-node src/scripts/validate-translations.ts"
```

This script can be run with:

```bash
npm run validate-translations
```

If any translations are missing, the script will exit with an error code and list the missing keys.

To add it as part of your build process, you can update your build script:

```json
"prebuild": "npm run validate-translations",
"build": "vite build"
```
