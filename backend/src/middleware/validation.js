import { validationResult } from 'express-validator';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = {};
    
    errors.array().forEach(error => {
      const field = error.type === 'field' ? error.path : 'general';
      if (!formattedErrors[field]) {
        formattedErrors[field] = [];
      }
      formattedErrors[field].push(error.msg);
    });

    res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors: formattedErrors,
    });
    return;
  }
  
  next();
};

// Custom validation helpers
const validateUUID = (value) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

const validateDate = (value) => {
  const date = new Date(value);
  return date instanceof Date && !isNaN(date.getTime());
};

const validateFutureDate = (value) => {
  const date = new Date(value);
  return date instanceof Date && !isNaN(date.getTime()) && date > new Date();
};

const validatePastDate = (value) => {
  const date = new Date(value);
  return date instanceof Date && !isNaN(date.getTime()) && date < new Date();
};

const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

const validateSalary = (salary) => {
  const salaryNum = parseFloat(salary);
  return !isNaN(salaryNum) && salaryNum > 0 && salaryNum <= 10000000;
};

const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validateLinkedInUrl = (url) => {
  const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
  return validateUrl(url) && linkedinRegex.test(url);
};

const validateGitHubUrl = (url) => {
  const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/?$/;
  return validateUrl(url) && githubRegex.test(url);
};

const validateSkills = (skills) => {
  if (!Array.isArray(skills)) return false;
  
  return skills.every(skill => 
    typeof skill === 'object' &&
    typeof skill.name === 'string' &&
    skill.name.trim().length > 0 &&
    ['beginner', 'intermediate', 'advanced', 'expert'].includes(skill.level)
  );
};

const validateWorkExperience = (experience) => {
  if (!Array.isArray(experience)) return false;
  
  return experience.every(exp => 
    typeof exp === 'object' &&
    typeof exp.company === 'string' &&
    exp.company.trim().length > 0 &&
    typeof exp.position === 'string' &&
    exp.position.trim().length > 0 &&
    validateDate(exp.start_date) &&
    (exp.current === true || validateDate(exp.end_date))
  );
};

const validateEducation = (education) => {
  if (!Array.isArray(education)) return false;
  
  return education.every(edu => 
    typeof edu === 'object' &&
    typeof edu.institution === 'string' &&
    edu.institution.trim().length > 0 &&
    typeof edu.degree === 'string' &&
    edu.degree.trim().length > 0 &&
    validateDate(edu.start_date)
  );
};

const validateLanguages = (languages) => {
  if (!Array.isArray(languages)) return false;
  
  return languages.every(lang => 
    typeof lang === 'object' &&
    typeof lang.language === 'string' &&
    lang.language.trim().length > 0 &&
    ['basic', 'conversational', 'professional', 'native'].includes(lang.proficiency)
  );
};

const validateCertifications = (certifications) => {
  if (!Array.isArray(certifications)) return false;
  
  return certifications.every(cert => 
    typeof cert === 'object' &&
    typeof cert.name === 'string' &&
    cert.name.trim().length > 0 &&
    typeof cert.issuer === 'string' &&
    cert.issuer.trim().length > 0 &&
    validateDate(cert.issue_date)
  );
};

// File validation helpers
const validateFileType = (mimetype, allowedTypes) => {
  return allowedTypes.includes(mimetype);
};

const validateFileSize = (size, maxSize) => {
  return size <= maxSize;
};

const validateImageDimensions = (
  width, 
  height, 
  minWidth, 
  minHeight, 
  maxWidth, 
  maxHeight
) => {
  if (minWidth && width < minWidth) return false;
  if (minHeight && height < minHeight) return false;
  if (maxWidth && width > maxWidth) return false;
  if (maxHeight && height > maxHeight) return false;
  return true;
};

// Pagination validation
const validatePagination = (page, limit) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  
  return {
    page: (isNaN(pageNum) || pageNum < 1) ? 1 : pageNum,
    limit: (isNaN(limitNum) || limitNum < 1 || limitNum > 100) ? 20 : limitNum,
  };
};

// Search validation
const validateSearchParams = (params) => {
  const validated = {};
  
  if (params.q && typeof params.q === 'string') {
    validated.q = params.q.trim().substring(0, 100); // Limit search term length
  }
  
  if (params.sort_by && typeof params.sort_by === 'string') {
    const allowedSortFields = ['created_at', 'updated_at', 'name', 'title', 'status'];
    if (allowedSortFields.includes(params.sort_by)) {
      validated.sort_by = params.sort_by;
    }
  }
  
  if (params.sort_order && ['asc', 'desc'].includes(params.sort_order)) {
    validated.sort_order = params.sort_order;
  }
  
  const pagination = validatePagination(params.page, params.limit);
  validated.page = pagination.page;
  validated.limit = pagination.limit;
  
  return validated;
};

export {
  validateRequest,
  validateUUID,
  validateDate,
  validateFutureDate,
  validatePastDate,
  validatePhoneNumber,
  validateSalary,
  validateUrl,
  validateLinkedInUrl,
  validateGitHubUrl,
  validateSkills,
  validateWorkExperience,
  validateEducation,
  validateLanguages,
  validateCertifications,
  validateFileType,
  validateFileSize,
  validateImageDimensions,
  validatePagination,
  validateSearchParams,
};
