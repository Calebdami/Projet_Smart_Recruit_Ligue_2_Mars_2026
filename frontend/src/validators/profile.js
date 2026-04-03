import * as yup from 'yup'

export const profileSchema = yup.object().shape({
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
  phone: yup
    .string()
    .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
    .optional(),
  bio: yup
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()
})