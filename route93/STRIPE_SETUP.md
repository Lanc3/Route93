# Stripe Setup Guide

## Getting Your Stripe API Keys

1. **Create a Stripe Account**
   - Go to https://stripe.com and create an account
   - Complete the verification process

2. **Get Your API Keys**
   - Go to https://dashboard.stripe.com/test/apikeys
   - You'll see two keys:
     - **Publishable key** (starts with `pk_test_`)
     - **Secret key** (starts with `sk_test_`)

## Setting Up Environment Variables

### For the Backend (API)
Create or update `route93/api/.env` with:
```
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
```

### For the Frontend (Web)
Create or update `route93/web/.env` with:
```
REDWOOD_ENV_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

## Important Security Notes

1. **Never commit API keys to version control**
2. **The secret key should only be used on the server**
3. **The publishable key is safe to use in the frontend**
4. **Use test keys during development (they start with `pk_test_` and `sk_test_`)**
5. **Switch to live keys only when ready for production**

## Testing the Integration

1. **Test Credit Card Numbers** (Stripe provides these for testing):
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **Insufficient Funds**: `4000 0000 0000 9995`

2. **Test Details**:
   - **Expiry**: Any future date (e.g., 12/34)
   - **CVC**: Any 3 digits (e.g., 123)
   - **ZIP**: Any 5 digits (e.g., 12345)

## Restart Your Development Server

After setting up the environment variables, restart your RedwoodJS development server:

```bash
yarn rw dev
```

## Troubleshooting

- **401 Unauthorized**: Check that your secret key is correctly set in `api/.env`
- **Invalid API Key**: Ensure you're using the correct key format and it's not expired
- **CORS Issues**: Make sure you're using the correct publishable key in the frontend

## Production Setup

When ready for production:
1. Get your live API keys from https://dashboard.stripe.com/apikeys
2. Update your production environment variables
3. Test thoroughly with small amounts first
