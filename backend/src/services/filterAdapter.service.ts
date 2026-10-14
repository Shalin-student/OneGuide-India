export function buildCollectionQuery(filters: any, collectionName: string): any {
  const conditions: any[] = [];
  if (filters.status) conditions.push({ status: filters.status });
  
  // Location Filter (State)
  if (filters.state && filters.state !== 'All India') {
    if (collectionName === 'Service') {
       conditions.push({
         $or: [
           { state: { $regex: new RegExp(`^${filters.state}$`, 'i') } },
           { stateOrCentral: 'Central' },
           { state: 'All India' },
           { state: { $exists: false } },
           { state: '' }
         ]
       });
    } else {
       conditions.push({
         $or: [
           { state: { $regex: new RegExp(`^${filters.state}$`, 'i') } },
           { level: 'Central' },
           { state: 'All India' },
           { state: { $exists: false } },
           { state: '' }
         ]
       });
    }
  }

  // -------------------------------------------------------------
  // SCHEMES & SERVICES (Demographic & Eligibility Filters)
  // -------------------------------------------------------------
  if (collectionName === 'Scheme' || collectionName === 'Service') {
    // Gender
    if (filters.gender && filters.gender !== 'All') {
      const field = collectionName === 'Service' ? 'eligibility.genders' : 'gender';
      const fallback = collectionName === 'Service' ? { $size: 0 } : '';
      conditions.push({
        $or: [
          { [field]: { $regex: new RegExp(`^${filters.gender}$`, 'i') } },
          { [field]: { $regex: /^All$/i } },
          { [field]: { $regex: /^Any$/i } },
          { [field]: { $exists: false } },
          { [field]: fallback }
        ]
      });
    }

    // Social Category
    if (filters.socialCategory && filters.socialCategory !== 'All') {
       const field = collectionName === 'Service' ? 'eligibility.socialCategories' : 'socialCategory';
       const fallback = collectionName === 'Service' ? { $size: 0 } : '';
       conditions.push({
        $or: [
          { [field]: { $regex: new RegExp(`^${filters.socialCategory}$`, 'i') } },
          { [field]: { $regex: /^All$/i } },
          { [field]: { $regex: /^Any$/i } },
          { [field]: { $exists: false } },
          { [field]: fallback }
        ]
      });
    }

    // Employment Status / Occupation
    if (filters.employmentStatus && filters.employmentStatus !== 'All') {
       const field = collectionName === 'Service' ? 'eligibility.occupations' : 'employmentStatus';
       const fallback = collectionName === 'Service' ? { $size: 0 } : '';
       conditions.push({
        $or: [
          { [field]: { $regex: new RegExp(`^${filters.employmentStatus}$`, 'i') } },
          { [field]: { $regex: /^All$/i } },
          { [field]: { $regex: /^Any$/i } },
          { [field]: { $exists: false } },
          { [field]: fallback }
        ]
      });
    }

    // Disability
    if (filters.disabilityStatus === 'Yes') {
       if (collectionName === 'Service') {
          conditions.push({
             $or: [
               { 'eligibility.disabilityRequired': true },
               { 'eligibility.disabilityRequired': { $exists: false } }
             ]
          });
       } else {
          conditions.push({
             $or: [
               { disabilityEligibility: { $regex: /^Yes$/i } },
               { disabilityEligibility: { $regex: /^All$/i } },
               { disabilityEligibility: { $exists: false } },
               { disabilityEligibility: '' }
             ]
          });
       }
    }

    // Minority
    if (filters.minorityStatus === 'Yes' && collectionName === 'Scheme') {
        conditions.push({
           $or: [
             { minorityEligibility: { $regex: /^Yes$/i } },
             { minorityEligibility: { $regex: /^All$/i } },
             { minorityEligibility: { $exists: false } },
             { minorityEligibility: '' }
           ]
        });
    }

    // Marital Status
    if (filters.maritalStatus && filters.maritalStatus !== 'All' && collectionName === 'Scheme') {
        conditions.push({
           $or: [
             { maritalStatus: { $regex: new RegExp(`^${filters.maritalStatus}$`, 'i') } },
             { maritalStatus: { $regex: /^All$/i } },
             { maritalStatus: { $regex: /^Any$/i } },
             { maritalStatus: { $exists: false } },
             { maritalStatus: '' }
           ]
        });
    }

    // BPL Status
    if (filters.bpl === true) {
        if (collectionName === 'Service') {
           conditions.push({
              $or: [
                 { 'eligibility.bplRequired': true },
                 { 'eligibility.bplRequired': { $exists: false } }
              ]
           });
        } else {
           conditions.push({
              $or: [
                 { bplEligibility: { $regex: /^Yes$/i } },
                 { bplEligibility: { $exists: false } },
                 { bplEligibility: '' }
              ]
           });
        }
    }

    // Student Status
    if (filters.student === true) {
        if (collectionName === 'Service') {
           conditions.push({
              $or: [
                 { 'eligibility.studentRequired': true },
                 { 'eligibility.studentRequired': { $exists: false } }
              ]
           });
        } else {
           conditions.push({
              $or: [
                 { studentEligibility: { $regex: /^Yes$/i } },
                 { studentEligibility: { $exists: false } },
                 { studentEligibility: '' }
              ]
           });
        }
    }
  }

  // -------------------------------------------------------------
  // JOBS & INTERNSHIPS (Qualification, Job Type)
  // -------------------------------------------------------------
  if (collectionName === 'Job' || collectionName === 'Internship') {
     if (filters.qualification && filters.qualification !== 'All') {
         conditions.push({
            $or: [
               { qualification: { $regex: new RegExp(filters.qualification, 'i') } },
               { qualification: { $exists: false } },
               { qualification: '' }
            ]
         });
     }
     if (filters.jobType && filters.jobType !== 'All' && collectionName === 'Job') {
         conditions.push({
            $or: [
               { jobType: { $regex: new RegExp(`^${filters.jobType}$`, 'i') } },
               { jobType: { $exists: false } },
               { jobType: '' }
            ]
         });
     }
  }
  
  // -------------------------------------------------------------
  // SCHOLARSHIPS (Qualification)
  // -------------------------------------------------------------
  if (collectionName === 'Scholarship') {
     if (filters.qualification && filters.qualification !== 'All') {
         conditions.push({
            $or: [
               { qualification: { $regex: new RegExp(filters.qualification, 'i') } },
               { qualification: { $exists: false } },
               { qualification: '' }
            ]
         });
     }
  }

  return conditions.length > 0 ? { $and: conditions } : {};
}
