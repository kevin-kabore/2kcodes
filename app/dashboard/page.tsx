import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { signOut } from '@/lib/auth';
import { Box, Typography, Paper, Container, Button, Grid } from '@mui/material';
import { ExitToApp as LogoutIcon } from '@mui/icons-material';

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Dashboard
        </Typography>
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}
        >
          <Button
            type="submit"
            variant="outlined"
            startIcon={<LogoutIcon />}
          >
            Sign Out
          </Button>
        </form>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Welcome back, {session.user.name || session.user.email}!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              You&apos;re successfully logged in to your account.
            </Typography>
            
            <Box mt={3}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Account Information:
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {session.user.email}
              </Typography>
              {session.user.username && (
                <Typography variant="body2">
                  <strong>Username:</strong> {session.user.username}
                </Typography>
              )}
              {session.user.role && (
                <Typography variant="body2">
                  <strong>Role:</strong> {session.user.role}
                </Typography>
              )}
              {session.user.walletAddress && (
                <Typography variant="body2">
                  <strong>Wallet:</strong> {session.user.walletAddress}
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Blog Posts
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You haven&apos;t created any blog posts yet.
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }}>
              Create Your First Post
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your account settings and preferences.
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }}>
              Edit Profile
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}