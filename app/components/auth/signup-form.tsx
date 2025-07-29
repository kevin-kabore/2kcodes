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

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be less than 20 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to create account');
        return;
      }

      // Sign in the user after successful registration
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError('Account created but sign in failed. Please try signing in manually.');
        router.push('/auth/signin');
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
          Create your account
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-primary hover:underline">
            Sign in
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
          {...register('username')}
          label="Username"
          fullWidth
          margin="normal"
          error={!!errors.username}
          helperText={errors.username?.message}
          disabled={isLoading}
          autoComplete="username"
        />

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
          autoComplete="new-password"
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

        <TextField
          {...register('confirmPassword')}
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          disabled={isLoading}
          autoComplete="new-password"
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
                disabled={isLoading}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{ mt: 3, mb: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Create Account'}
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

      <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 3 }} color="text.secondary">
        By creating an account, you agree to our{' '}
        <Link href="/terms" className="text-primary hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
      </Typography>
    </Box>
  );
}