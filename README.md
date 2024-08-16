# 1. Summary

The project involves creating a personal website for Kevin Kaboré, consisting of
a landing page and a blog page. The blog page will allow visitors to view blog
posts, while logged-in users can create, view, update, and delete posts. Blog
posts will be minted as Solana-based NFTs, with an integrated wallet using
Privy. Logged-in users can also "Save" posts to their gallery (minting an NFT
edition), like and comment on posts, and subscribe to other users for content
updates.

# 2. Functional Requirements

## Landing Page:

- Display introductory information about Kevin Kaboré.
- Provide navigation to the blog page and other relevant sections.

## Blog Page (Visitor):

- View all blog posts.
- Search and filter blog posts.

## Blog Page (Logged-in User):

- Create, view, update, and delete their own blog posts.
- Like and comment on posts.
- Save posts to their gallery (minting an NFT edition).
- Subscribe to other users for new content updates.

## Authentication:

- User registration and login.
- Integrated wallet creation using Privy.

## NFT Integration:

- Mint NFTs on the Solana blockchain when a post is saved.
- Display the user’s NFT gallery.

## Notifications:

- Notify users about new content from subscribed users.

# 3. Non-Functional Requirements

## Performance:

- The website should load within 2 seconds.
- The NFT minting process should be completed within a few seconds.

## Scalability:

- Handle up to 100 concurrent users.
- Efficiently handle an increasing number of blog posts and NFTs.

## Security:

- Use HTTPS for secure communication.
- Protect user data and wallets with encryption.
- Implement rate limiting and protection against common web vulnerabilities.

## Reliability:

- Ensure 99.9% uptime.
- Implement backup and recovery for blog posts and NFT data.

## Usability:

- Provide a responsive design for mobile and desktop users.
- Maintain a user-friendly interface for both visitors and logged-in users.

# 4. Design Consideration & Architecture

1. **Frontend:**

   - **Technology:** Next.js
   - **Role:** Handles client-side rendering, page routing, and API requests.
     Integrates with Privy for wallet management.
   - **Considerations:** Use static site generation (SSG) or server-side
     rendering (SSR) for performance where appropriate.

2. **Backend:**

   - **Technology:** Next.js API Routes
   - **Role:** Provides REST APIs for the frontend, handles business logic, and
     interacts with the database and Solana blockchain.

3. **Database:**

   - **Technology:** PostgreSQL (hosted on Supabase)
   - **Role:** Stores user data, blog posts, comments, and user interactions.

4. **Blockchain Integration:**

   - **Technology:** Solana with Metaplex or Phantom SDKs
   - **Role:** Facilitates NFT minting and management for blog posts.

5. **Media Storage:**

   - **Technology:** Cloudinary or Supabase Storage
   - **Role:** Store images and media associated with blog posts.

6. **Authentication & Wallet:**

   - **Technology:** OAuth2/JWT for user authentication; Privy for wallet
     integration
   - **Role:** Manage secure user authentication and Solana wallet creation.

7. **Notifications:**
   - **Technology:** WebSockets
   - **Role:** Provide real-time notifications to users.

# 5. API Model

## Entity Models

````typescript
// User Entity
interface User {
  id: string;             // UUID
  username: string;
  email: string;
  password: string;
  walletAddress: string;
  createdAt: Date;        // datetime
  updatedAt: Date;        // datetime
}

// Blog Post Entity
interface BlogPost {
  id: string;             // UUID
  authorId: string;       // UUID
  title: string;
  content: string;        // text
  createdAt: Date;        // datetime
  updatedAt: Date;        // datetime
}

// Comment Entity
interface Comment {
  id: string;             // UUID
  postId: string;         // UUID
  authorId: string;       // UUID
  content: string;
  createdAt: Date;        // datetime
}

// NFT Entity
interface NFT {
  id: string;             // UUID
  ownerId: string;        // UUID
  postId: string;         // UUID
  mintedAt: Date;         // datetime
  metadata: Record<string, any>;  // JSON
}

// Notification Entity
interface Notification {
  id: string;             // UUID
  userId: string;         // UUID
  content: string;
  createdAt: Date;        // datetime
}
```

## Endpoints

### Authentication API Endpoints

#### `POST /auth/signup`

**Description:** Registers a new user.

- **Request Body:**

  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
````

- **Responses:**
  - `201 Created`: User successfully registered.
    ```json
    {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "walletAddress": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
    ```
  - `400 Bad Request`: Invalid input data.
  - `409 Conflict`: Email already exists.

#### `POST /auth/login`

**Description:** Authenticates a user and issues a JWT.

- **Request Body:**

  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

- **Responses:**
  - `200 OK`: Login successful.
    ```json
    {
      "token": "jwt",
      "expiresIn": "number"
    }
    ```
  - `400 Bad Request`: Missing email or password.
  - `401 Unauthorized`: Invalid credentials.

#### `POST /auth/logout`

**Description:** Logs out the user.

- **Request Headers:**

  - `Authorization: Bearer <token>`

- **Responses:**
  - `200 OK`: Logout successful.
  - `401 Unauthorized`: Invalid or missing token.

#### `GET /auth/user`

**Description:** Fetches the currently authenticated user's profile.

- **Request Headers:**

  - `Authorization: Bearer <token>`

- **Responses:**
  - `200 OK`: Returns user profile.
    ```json
    {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "walletAddress": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
    ```
  - `401 Unauthorized`: Invalid or missing token.

### User Management API Endpoints

#### `GET /user/{id}`

**Description:** Retrieve profile information of a specific user.

- **Path Parameters:**

  - `id: UUID`

- **Responses:**
  - `200 OK`: Returns user profile.
    ```json
    {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "walletAddress": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
    ```
  - `404 Not Found`: User not found.

#### `POST /user/{id}/subscribe`

**Description:** Subscribe to another user for updates.

- **Path Parameters:**

  - `id: UUID`

- **Request Headers:**

  - `Authorization: Bearer <token>`

- **Responses:**
  - `200 OK`: Subscription successful.
  - `400 Bad Request`: Invalid user ID.
  - `401 Unauthorized`: Invalid or missing token.
  - `404 Not Found`: User not found.

### Blog Post API Endpoints

#### `GET /posts`

**Description:** Fetch all blog posts, with pagination.

- **Query Parameters:**

  - `page: integer` (default: 1)
  - `limit: integer` (default: 10)

- **Responses:**
  - `200 OK`: Returns a list of blog posts.
    ```json
    [
      {
        "id": "uuid",
        "authorId": "uuid",
        "title": "string",
        "content": "text",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      },
      ...
    ]
    ```

#### `GET /posts/{id}`

**Description:** Fetch a single blog post by ID.

- **Path Parameters:**

  - `id: UUID`

- **Responses:**
  - `200 OK`: Returns the blog post.
    ```json
    {
      "id": "uuid",
      "authorId": "uuid",
      "title": "string",
      "content": "text",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
    ```
  - `404 Not Found`: Blog post not found.

#### `POST /posts`

**Description:** Create a new blog post (authenticated users only).

- **Request Headers:**

  - `Authorization: Bearer <token>`

- **Request Body:**

  ```json
  {
    "title": "string",
    "content": "text"
  }
  ```

- **Responses:**
  - `201 Created`: Blog post created successfully.
    ```json
    {
      "id": "uuid",
      "authorId": "uuid",
      "title": "string",
      "content": "text",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
    ```
  - `400 Bad Request`: Invalid input data.
  - `401 Unauthorized`: Invalid or missing token.

#### `PUT /posts/{id}`

**Description:** Update a blog post (authenticated users only).

- **Path Parameters:**

  - `id: UUID`

- **Request Headers:**

  - `Authorization: Bearer <token>`

- **Request Body:**

  ```json
  {
    "title": "string",
    "content": "text"
  }
  ```

- **Responses:**
  - `200 OK`: Blog post updated successfully.
    ```json
    {
      "id": "uuid",
      "authorId": "uuid",
      "title": "string",
      "content": "text",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
    ```
  - `400 Bad Request`: Invalid input data.
  - `401 Unauthorized`: Invalid or missing token.
  - `404 Not Found`: Blog post not found.

#### `DELETE /posts/{id}`

**Description:** Delete a blog post (authenticated users only).

- **Path Parameters:**

  - `id: UUID`

- **Request Headers:**

  - `Authorization: Bearer <token>`

- **Responses:**
  - `200 OK`: Blog post deleted successfully.
  - `401 Unauthorized`: Invalid or missing token.
  - `404 Not Found`: Blog post not found.

### User Interaction API Endpoints

#### `POST /posts/{id}/like`

**Description:** Like a blog post (one like per user).

- **Path Parameters:**

  - `id: UUID`

- **Request Headers:**

  - `Authorization: Bearer <token>`

- **Responses:**
  - `200 OK`: Like registered successfully.
  - `400 Bad Request`: Invalid post ID.
  - `401 Unauthorized`: Invalid or missing token.
  - `404 Not Found`: Blog post not found.

#### `POST /posts/{id}/comment`

**Description:** Add a comment to a blog post.

- **Path Parameters:**

  - `id: UUID`

- **Request Headers:**

  - `Authorization: Bearer <token>`

- **Request Body:**

  ```json
  {
    "content": "string"
  }
  ```

- **Responses:**
  - `201 Created`: Comment added successfully.
    ```json
    {
      "id": "uuid",
      "postId": "uuid",
      "authorId": "uuid",
      "content": "string",
      "createdAt": "datetime"
    }
    ```
  - `400 Bad Request
