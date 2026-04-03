import * as yup from 'yup'

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  twoFactorCode: yup
    .string()
    .when('requires2FA', {
      is: true,
      then: yup.string()
        .length(6, '2FA code must be 6 digits')
        .matches(/^\d{6}$/, '2FA code must contain only numbers')
        .required('2FA code is required')
    })
})