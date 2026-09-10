# OneGuide India — Data Schema Documentation

This document defines the database schemas, rules, and verification standards for the **OneGuide India** backend. 

> [!WARNING]
> **Data Integrity Policy**
> - Never invent eligibility, benefits, deadlines, or income limits.
> - Official government domains, ministry websites, state portals, and official recruitment boards MUST be prioritized over third-party aggregated sites.
> - All records must retain a valid `sourceName`, `sourceUrl`, and `lastVerified` date.
> - Unofficial data is prohibited in the production environment.

---

## The Resources

### 1. Scheme (`IScheme`)
Represents government welfare schemes, subsidies, and initiatives.

- **Required Fields**: `name`, `slug`, `description`
- **Official Identity**: `ministry`, `department`, `level` (Central/State), `state`
- **Finder/Filtering Attributes**: 
  - `eligibility`, `ageLimit`, `gender`, `socialCategory`, `disabilityEligibility`, `minorityEligibility`, `studentEligibility`, `employmentStatus`, `governmentEmployeeEligibility`, `bplEligibility`, `incomeLimit`
- **Application Details**: `benefits`, `requiredDocuments`, `applicationProcess`, `applicationUrl`, `officialWebsite`
- **Verification**: `sourceName`, `sourceUrl`, `lastVerified`, `status`

### 2. Job (`IJob`)
Represents government job openings, recruitment drives, and public-sector vacancies.

- **Required Fields**: `title`, `slug`
- **Official Identity**: `organization`, `department`, `jobType`, `location`, `state`
- **Qualifications**: `qualification`, `experience`, `ageLimit`
- **Listing Details**: `salary`, `vacancies`
- **Application Details**: `applicationStart`, `applicationDeadline`, `applicationUrl`, `officialNotificationUrl`, `officialWebsite`
- **Verification**: `sourceName`, `sourceUrl`, `lastVerified`, `status`

### 3. Internship (`IInternship`)
Represents government internships, apprenticeships, and training programs.

- **Required Fields**: `title`, `slug`
- **Official Identity**: `organization`, `department`, `location`, `state`
- **Qualifications**: `eligibility`, `qualification`
- **Program Details**: `duration`, `stipend`
- **Application Details**: `applicationStart`, `applicationDeadline`, `applicationUrl`, `officialWebsite`
- **Verification**: `sourceName`, `sourceUrl`, `lastVerified`, `status`

### 4. Scholarship (`IScholarship`)
Represents financial aid, grants, and scholarships.

- **Required Fields**: `name`, `slug`
- **Official Identity**: `provider`, `ministry`, `level`, `state`
- **Qualifications**: `eligibility`, `qualification`, `category`, `incomeLimit`
- **Application Details**: `benefits`, `requiredDocuments`, `applicationStart`, `applicationDeadline`, `applicationUrl`, `officialWebsite`
- **Verification**: `sourceName`, `sourceUrl`, `lastVerified`, `status`

### 5. Document (`IDoc`)
Represents government certificates and documents (e.g., Aadhar, PAN, Domicile, Caste Certificate).

- **Required Fields**: `name`, `slug`
- **Official Identity**: `category`, `issuingAuthority`, `eligibility`
- **Application Details**: `requiredDocuments`, `applicationProcess`, `applicationUrl`, `officialWebsite`
- **Verification**: `sourceName`, `sourceUrl`, `lastVerified`, `status`

### 6. Government Portal (`IGovernmentPortal`)
Represents official government websites, service portals, and dashboards.

- **Required Fields**: `name`, `slug`, `websiteUrl`
- **Official Identity**: `category`, `ministry`, `department`, `level`, `state`
- **Features**: `services` (Array of Strings)
- **Verification**: `sourceName`, `sourceUrl`, `lastVerified`, `status`

---

## Data Import Guide

A utility script exists at `server/src/scripts/importData.ts`. 
To run the import:

```bash
cd server
npm run data:import
```

**Import Rules:**
1. The script expects `.json` files inside the `server/data/` directory (e.g., `schemes.json`).
2. The script checks for duplicate `slug`s to prevent double-insertions.
3. Every JSON object must contain at minimum a `slug`, a `name`/`title`, and the verification fields (`sourceName`, `sourceUrl`). Invalid records will be skipped with a terminal warning.
