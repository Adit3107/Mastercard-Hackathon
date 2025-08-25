import jwt from 'jsonwebtoken';

// Clerk configuration
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY;

// Verify Clerk webhook signature
export const verifyClerkWebhook = (payload, signature) => {
  try {
    if (!CLERK_SECRET_KEY) {
      throw new Error('CLERK_SECRET_KEY is not configured');
    }

    // Verify the webhook signature
    const decoded = jwt.verify(signature, CLERK_SECRET_KEY, {
      algorithms: ['HS256']
    });

    return decoded;
  } catch (error) {
    console.error('Clerk webhook verification failed:', error);
    return null;
  }
};

// Extract user data from Clerk webhook payload
export const extractUserData = (payload) => {
  try {
    const { id, email_addresses, first_name, last_name, created_at, updated_at } = payload.data;

    return {
      clerkId: id,
      email: email_addresses?.[0]?.email_address || '',
      firstName: first_name || '',
      lastName: last_name || '',
      emailVerified: email_addresses?.[0]?.verification?.status === 'verified',
      createdAt: new Date(created_at * 1000),
      updatedAt: new Date(updated_at * 1000)
    };
  } catch (error) {
    console.error('Error extracting user data from Clerk payload:', error);
    return null;
  }
};

// Get Clerk configuration
export const getClerkConfig = () => {
  return {
    secretKey: CLERK_SECRET_KEY,
    publishableKey: CLERK_PUBLISHABLE_KEY
  };
};

export default {
  verifyClerkWebhook,
  extractUserData,
  getClerkConfig
};
