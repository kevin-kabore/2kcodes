'use client'

import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Box, Typography, Paper, Container, Button, Grid } from '@mui/material'
import { ExitToApp as LogoutIcon } from '@mui/icons-material'

export function DashboardContent() {
  const { user, handleLogOut } = useDynamicContext()
  const router = useRouter()
  
  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user, router])

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Dashboard
        </Typography>
        <Button
          onClick={() => handleLogOut()}
          variant="outlined"
          startIcon={<LogoutIcon />}
        >
          Sign Out
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Welcome back, {user.alias || user.email}!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              You&apos;re successfully logged in to your account.
            </Typography>
            
            <Box mt={3}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Account Information:
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {user.email || 'Not provided'}
              </Typography>
              {user.alias && (
                <Typography variant="body2">
                  <strong>Username:</strong> {user.alias}
                </Typography>
              )}
              {user.verifiedCredentials?.[0]?.address && (
                <Typography variant="body2">
                  <strong>Wallet:</strong> {user.verifiedCredentials[0].address}
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
  )
}