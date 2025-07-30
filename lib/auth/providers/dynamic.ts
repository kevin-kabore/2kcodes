import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers'

export interface DynamicProfile {
  id: string
  email?: string
  wallet_address: string
  chain?: string
  verified_credentials?: Array<{
    address: string
    chain: string
    format: string
    public_identifier: string
  }>
}

export default function DynamicProvider<P extends DynamicProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: 'dynamic',
    name: 'Dynamic',
    type: 'oauth',
    authorization: {
      url: 'https://app.dynamic.xyz/api/v0/oauth/authorize',
      params: {
        scope: 'openid email',
        response_type: 'code',
      },
    },
    token: 'https://app.dynamic.xyz/api/v0/oauth/token',
    userinfo: 'https://app.dynamic.xyz/api/v0/oauth/userinfo',
    client: {
      token_endpoint_auth_method: 'client_secret_post',
    },
    profile(profile) {
      return {
        id: profile.id,
        email: profile.email,
        name: profile.wallet_address,
        image: null,
        walletAddress: profile.wallet_address,
      }
    },
    style: {
      text: '#000',
      bg: '#fff',
    },
    options,
  }
}