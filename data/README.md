# Verified data import files

Add verified records to the JSON array for each category:

- `schemes.json`: `name`, `slug`, `description`, `sourceName`, and a valid official URL.
- `jobs.json`: `title`, `slug`, `description`, `sourceName`, and a valid official URL.
- `internships.json`: `title`, `slug`, `description`, `sourceName`, and a valid official URL.
- `scholarships.json`: `name`, `slug`, `description`, `sourceName`, and a valid official URL.
- `documents.json`: `name`, `slug`, `description`, `sourceName`, and a valid official URL.
- `government-portals.json`: `name`, `slug`, `description`, `sourceName`, and a valid official URL.

Import all files:

```powershell
Set-Location .\server
npm run data:import
```

The importer skips duplicate slugs, rejects records without official sources, and never overwrites existing MongoDB records.
