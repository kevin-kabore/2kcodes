'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  Box,
  Typography,
  Divider,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, GitHub, Google } from '@mui/icons-material';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (error) {
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Sign in to your account
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Or{' '}
          <Link href="/auth/signup" className="text-primary hover:underline">
            create a new account
          </Link>
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          {...register('email')}
          label="Email Address"
          type="email"
          fullWidth
          margin="normal"
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={isLoading}
          autoComplete="email"
        />

        <TextField
          {...register('password')}
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          error={!!errors.password}
          helperText={errors.password?.message}
          disabled={isLoading}
          autoComplete="current-password"
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                disabled={isLoading}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />

        <Box display="flex" justifyContent="flex-end" mt={1} mb={3}>
          <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
            Forgot your password?
          </Link>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{ mb: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>
      </form>

      <Divider sx={{ my: 3 }}>OR</Divider>

      <Box display="flex" flexDirection="column" gap={2}>
        <Button
          fullWidth
          variant="outlined"
          size="large"
          startIcon={<GitHub />}
          onClick={() => handleSocialSignIn('github')}
          disabled={isLoading}
        >
          Continue with GitHub
        </Button>

        <Button
          fullWidth
          variant="outlined"
          size="large"
          startIcon={<Google />}
          onClick={() => handleSocialSignIn('google')}
          disabled={isLoading}
        >
          Continue with Google
        </Button>
      </Box>
    </Box>
  );
}