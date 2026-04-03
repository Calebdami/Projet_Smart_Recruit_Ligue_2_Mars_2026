import * as yup from 'yup'

export const userSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  role: yup
    .string()
    .oneOf(['admin', 'manager', 'recruiter', 'candidate'], 'Please select a valid role')
    .required('Role is required'),
  phone: yup
    .string()
    .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
    .optional(),
  isActive: yup
    .boolean()
    .required('Account status is required')
})