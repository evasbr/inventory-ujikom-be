const userData: {
  email: string;
  firstName: string;
  fullName: string;
  role: string;
}[] = [
  {
    email: process.env.FIRST_SUPERADMIN_EMAIL ?? 'joe@example.com',
    firstName: process.env.FIRST_SUPERADMIN_FIRSTNAME ?? 'joe',
    fullName: process.env.FIRST_SUPERADMIN_FIRSTNAME ?? 'joe',
    role: 'Super Admin',
  },
];
export default userData;
