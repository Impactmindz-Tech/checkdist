import * as yup from "yup";

// const emailValidation = yup
//     .string()
//     .test("email", "Invalid email", function (value) {
//         if (!value) return true;
//         return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
//     })
//     .required("Email is required");

const emailValidation = yup
  .string()
  .test("email", "Invalid email", function (value) {
    if (!value) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  })
  .required("Email is required.");

const checkboxValidation = yup.boolean().oneOf([true], "You must agree to the Privacy Policy and Terms of Services.");

export const registrationValidation = yup.object({
  email: yup.string().required("Please Provide a Valid email address.").matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
    "Please provide a valid email address."
  ),
  userName: yup.string().required("Please Provide a valid username.").matches(/^[a-zA-Z0-9]*$/, "Username cannot contain spaces or special characters.").min(4, "Username must be at least 4 characters long.")
  .max(35, "Username cannot exceed 35 characters."), // Set min length to 4 and max length to 35,
  password: yup.string().required("Password is required.").matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'The Password requires capital and lowercase letters, numbers, symbols (@$!%*?&) and be at least 8 characters long.'
  ),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Your password don't match.")
    .required("Confirm password is required."),
  terms: yup.boolean().oneOf([true], "You must agree to the Privacy Policy and Terms of Services.").required("You must agree to the Privacy Policy and Terms of Services."),
});

export const loginValidation = yup.object({
  userName: yup.string().required("Username is not found."),
  password: yup.string().required("Password is required."),
  terms: yup.boolean().oneOf([true], "You must agree to the Privacy Policy and Terms of Services.").required("You must agree to the Privacy Policy and Terms of Services."),

});

export const forgetPassword = yup.object({
  email: yup.string().required("Email is required."),
});

export const conformPassword = yup.object({
  newPassword: yup.string().required("Password is required.").matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'The Password requires capital and lowercase letters, numbers, symbols (@$!%*?&) and be at least 8 characters long.'
  ),
  // newPassword: yup.string().required("Password is required").min(4, "Password must be at least 4 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match.")
    .required("Confirm password is required."),
});

export const editProfileValidation = yup.object({
  firstName: yup.string().required("First Name is required."),
  lastName: yup.string().required("Last Name is required."),
  mobileNumber: yup.string().required("Mobile is required."),
  dob: yup.string().required("Dob is required."),
  // country: yup.string().required("Country is required"),
  // city: yup.string().required("City is required"),
});

export const addExperinceValidation = yup.object({
  AmountsperMinute: yup.number().required("Amount per minute is required.").min(0.5,"Amount per minute must at least 0.5"),
  notesForUser: yup.string().required("Notes For User is required."),
  ExperienceName: yup.string().required("Experience Name is required."),
  about: yup.string().required("About is required.")
});

export const createOfferValidation = yup.object({
  Title: yup.string().required("Title is required."),
  price: yup.number().required("Price is required.").min(0.5, "Price must be at least $0.5."),
  Minutes: yup.string().required("Minutes is required."),
  ZipCode: yup
  .string()
  .required("ZipCode is required.")
  .matches(/^\d{5,9}$/, "ZipCode must be a number between 5 and 9 digits long."),
  Notes: yup.string().required("Notes is required."),
});

export const atarAvailableValidation = yup.object({
  from: yup.string().required("From is required."),
  to: yup.string().required("To is required."),
  fromPeriod: yup.string().required("From Period is required."),
  toPeriod: yup.string().required("To Period is required."),
  timeZone: yup.string().required("Time Zone is required."),
});
