'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Box, Typography, Button, Alert, AlertTitle } from '@mui/material';
import { Home as HomeIcon, Login as LoginIcon } from '@mui/icons-material';

export default function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'You do not have permission to sign in.';
      case 'Verification':
        return 'The sign in link is no longer valid. It may have been used already or it may have expired.';
      case 'OAuthSignin':
        return 'Error in constructing an authorization URL.';
      case 'OAuthCallback':
        return 'Error in handling the response from the OAuth provider.';
      case 'OAuthCreateAccount':
        return 'Could not create OAuth provider user in the database.';
      case 'EmailCreateAccount':
        return 'Could not create email provider user in the database.';
      case 'Callback':
        return 'Error in the OAuth callback handler route.';
      case 'OAuthAccountNotLinked':
        return 'The email on the account is already linked to another account.';
      case 'EmailSignin':
        return 'Check your email address.';
      case 'CredentialsSignin':
        return 'Sign in failed. Check the details you provided are correct.';
      default:
        return 'An unexpected error occurred during authentication.';
    }
  };

  return (
    <Box>
      <Alert severity="error" sx={{ mb: 4 }}>
        <AlertTitle>Authentication Error</AlertTitle>
        {getErrorMessage()}
      </Alert>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }} textAlign="center">
        If this error persists, please contact support.
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        <Button
          component={Link}
          href="/auth/signin"
          variant="contained"
          fullWidth
          startIcon={<LoginIcon />}
        >
          Try Again
        </Button>

        <Button
          component={Link}
          href="/"
          variant="outlined"
          fullWidth
          startIcon={<HomeIcon />}
        >
          Go to Homepage
        </Button>
      </Box>
    </Box>
  );
}