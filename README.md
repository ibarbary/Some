# Lexi Backend API

RESTful API for the **Lexi** language learning app. Built with Node.js, Express, TypeScript, and MongoDB.

---

## Base URL

```
https://your-domain.com/api
```

All routes are prefixed with `/api`. For example:

```
POST https://your-domain.com/api/auth/signup
```

---

## Authentication

Most protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

Token types:

| Token Type     | Used For                                               |
| -------------- | ------------------------------------------------------ |
| `accessToken`  | All protected endpoints                                |
| `refreshToken` | **Only** `POST /auth/refresh-token`                    |
| `resetToken`   | **Only** `PATCH /auth/reset-password` — 5 min lifetime |

---

## Roles

| Role       | Description                                       |
| ---------- | ------------------------------------------------- |
| `User`     | Regular learner account                           |
| `Guardian` | Parent account — manages child accounts           |
| `Child`    | Child account — created and managed by a Guardian |

---

## Response Format

All successful responses:

```json
{
  "message": "Human-readable status",
  "data": {}
}
```

All error responses:

```json
{
  "message": "Error description",
  "statusCode": 400
}
```

---

---

# 🔐 Auth Module

**Base path:** `/api/auth`

---

### POST `/api/auth/signup`

Register a new user. Stores the user temporarily and sends a 6-digit OTP to their email for verification.

**Auth required:** ❌ No

**Request Body:**

```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "User",
  "birthdate": "2000-01-15"
}
```

| Field       | Type   | Required | Notes                                          |
| ----------- | ------ | -------- | ---------------------------------------------- |
| `name`      | string | ✅       |                                                |
| `username`  | string | ✅       | Must be unique                                 |
| `email`     | string | ✅       | Must be valid email format                     |
| `password`  | string | ✅       | Minimum 8 characters                           |
| `role`      | string | ❌       | `"User"` or `"Guardian"`. Defaults to `"User"` |
| `birthdate` | date   | ✅       | ISO 8601 date string e.g. `"2000-01-15"`       |

**Response `201`:**

```json
{
  "message": "Signup successful. A confirmation email has been sent."
}
```

---

### POST `/api/auth/confirmEmail`

Confirm the user's email using the OTP they received. Moves the user from pending to active and returns login credentials.

**Auth required:** ❌ No

**Request Body:**

```json
{
  "email": "john@example.com",
  "otp": "482931"
}
```

| Field   | Type   | Required | Notes            |
| ------- | ------ | -------- | ---------------- |
| `email` | string | ✅       |                  |
| `otp`   | string | ✅       | Exactly 6 digits |

**Response `200`:**

```json
{
  "message": "user logged in successfully",
  "Credentials": {
    "accessToken": "<jwt>",
    "refreshToken": "<jwt>"
  }
}
```

---

### POST `/api/auth/login`

Log in with email and password.

**Auth required:** ❌ No

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

| Field      | Type   | Required |
| ---------- | ------ | -------- |
| `email`    | string | ✅       |
| `password` | string | ✅       |

**Response `200`:**

```json
{
  "message": "user logged in successfully",
  "Credentials": {
    "accessToken": "<jwt>",
    "refreshToken": "<jwt>"
  }
}
```

---

### POST `/api/auth/oauth`

Login or register via Google or Facebook. If the user doesn't exist, a new account is created automatically.

**Auth required:** ❌ No

**Request Body:**

```json
{
  "provider": "google",
  "token": "<google_id_token_or_facebook_access_token>",
  "role": "User"
}
```

| Field      | Type   | Required | Notes                                          |
| ---------- | ------ | -------- | ---------------------------------------------- |
| `provider` | string | ✅       | `"google"` or `"facebook"`                     |
| `token`    | string | ✅       | Google ID token or Facebook access token       |
| `role`     | string | ❌       | `"User"` or `"Guardian"`. Defaults to `"User"` |

**Response `200`:**

```json
{
  "message": "Login success",
  "Credentials": {
    "accessToken": "<jwt>",
    "refreshToken": "<jwt>"
  }
}
```

---

### POST `/api/auth/forget-password`

Sends a 6-digit OTP to the user's email to begin the password reset flow.

**Auth required:** ❌ No

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Response `200`:**

```json
{
  "message": "otp sent successfully"
}
```

---

### POST `/api/auth/verify-forgot-otp`

Verify the OTP sent to the user's email. Returns a short-lived `resetToken` (valid 5 minutes) to use in the next step.

**Auth required:** ❌ No

**Request Body:**

```json
{
  "email": "john@example.com",
  "otp": "391047"
}
```

| Field   | Type   | Required | Notes            |
| ------- | ------ | -------- | ---------------- |
| `email` | string | ✅       |                  |
| `otp`   | string | ✅       | Exactly 6 digits |

**Response `200`:**

```json
{
  "message": "OTP verified successfully",
  "resetToken": "<jwt — expires in 5 minutes>"
}
```

---

### PATCH `/api/auth/reset-password`

Reset the user's password using the `resetToken` obtained from `/verify-forgot-otp`.

**Auth required:** ✅ Yes — `Authorization: Bearer <resetToken>`

> ⚠️ Use the **resetToken** from `/verify-forgot-otp` here, **not** your normal access token.

**Request Body:**

```json
{
  "password": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

| Field             | Type   | Required | Notes                         |
| ----------------- | ------ | -------- | ----------------------------- |
| `password`        | string | ✅       |                               |
| `confirmPassword` | string | ✅       | Must match `password` exactly |

**Response `200`:**

```json
{
  "message": "Password reset successfully"
}
```

---

### POST `/api/auth/logout`

Revoke the current access token. It is immediately invalidated.

**Auth required:** ✅ Yes — `Authorization: Bearer <accessToken>`

**Allowed roles:** `User`, `Guardian`, `Child`

**Response `200`:**

```json
{
  "message": "Logged out successfully"
}
```

---

### POST `/api/auth/refresh-token`

Exchange a valid refresh token for a new access + refresh token pair. The old refresh token is revoked.

**Auth required:** ✅ Yes — `Authorization: Bearer <refreshToken>`

> ⚠️ Send the **refresh token** here, not the access token.

**Allowed roles:** `User`, `Guardian`, `Child`

**Response `200`:**

```json
{
  "message": "new Credentials",
  "credentials": {
    "accessToken": "<jwt>",
    "refreshToken": "<jwt>"
  }
}
```

---

---

# 👤 User Module

**Base path:** `/api/users`

---

### GET `/api/users/me`

Fetch the authenticated user's full profile including all stages they have started and their progress in each. Sensitive fields are stripped before returning.

**Auth required:** ✅ Yes

**Allowed roles:** `User`, `Child`

**Response `200`:**

```json
{
  "message": "Profile fetched successfully",
  "data": {
    "_id": "664abc123def456abc123def",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "User",
    "provider": "local",
    "profileImage": "https://cdn.example.com/avatar.png",
    "birthdate": "2000-01-15T00:00:00.000Z",
    "parentId": null,
    "tags": ["Basics", "Intermediate"],
    "overall_progress": {
      "en": 0.4,
      "ar": 0.0
    },
    "average_accuracy": {
      "en": 0.85,
      "ar": 0.0
    },
    "achievements": [
      {
        "key": "FIRST_STEP",
        "name": "First Step",
        "earned_at": "2024-06-01T10:00:00.000Z"
      }
    ],
    "total_study_seconds": 3600,
    "current_streak_days": 5,
    "longest_streak_days": 12,
    "last_study_date": "2024-06-10T00:00:00.000Z",
    "createdAt": "2024-05-01T08:00:00.000Z",
    "updatedAt": "2024-06-10T12:00:00.000Z",
    "stages": [
      {
        "_id": "664def111aaa222bbb333ccc",
        "name": "Basics",
        "language": "en",
        "order_index": 1,
        "total_levels": 10,
        "status": "in_progress",
        "completed_levels": 4,
        "progress": 0.4
      }
    ]
  }
}
```

> `stages` only contains stages the user has **started**. Returns an empty array `[]` if none started yet.

---

### PATCH `/api/users/me`

Update the authenticated user's own profile. Returns the full updated profile including stages — same shape as `GET /users/me` — so the frontend can replace its local state directly without a follow-up call.

**Auth required:** ✅ Yes

**Allowed roles:** `User`, `Child`

**Request Body** (all optional, at least one required):

```json
{
  "name": "Jane Doe",
  "username": "janedoe",
  "birthdate": "1999-05-20",
  "profileImage": "https://cdn.example.com/avatar.png"
}
```

| Field          | Type   | Required | Notes                |
| -------------- | ------ | -------- | -------------------- |
| `name`         | string | ❌       |                      |
| `username`     | string | ❌       | Must be unique       |
| `birthdate`    | date   | ❌       | ISO 8601 date string |
| `profileImage` | string | ❌       | Must be a valid URL  |

**Response `200`:**

```json
{
  "message": "Profile updated successfully",
  "data": {
    "_id": "664abc123def456abc123def",
    "name": "Jane Doe",
    "username": "janedoe",
    "email": "john@example.com",
    "role": "User",
    "provider": "local",
    "profileImage": "https://cdn.example.com/avatar.png",
    "birthdate": "1999-05-20T00:00:00.000Z",
    "parentId": null,
    "tags": ["Basics"],
    "overall_progress": { "en": 0.4, "ar": 0.0 },
    "average_accuracy": { "en": 0.85, "ar": 0.0 },
    "achievements": [
      {
        "key": "FIRST_STEP",
        "name": "First Step",
        "earned_at": "2024-06-01T10:00:00.000Z"
      }
    ],
    "total_study_seconds": 3600,
    "current_streak_days": 5,
    "longest_streak_days": 12,
    "last_study_date": "2024-06-10T00:00:00.000Z",
    "createdAt": "2024-05-01T08:00:00.000Z",
    "updatedAt": "2024-06-10T13:00:00.000Z",
    "stages": [
      {
        "_id": "664def111aaa222bbb333ccc",
        "name": "Basics",
        "language": "en",
        "order_index": 1,
        "total_levels": 10,
        "status": "in_progress",
        "completed_levels": 4,
        "progress": 0.4
      }
    ]
  }
}
```

> The response is identical in shape to `GET /users/me`. The frontend can safely replace the entire user object with this response.

---

---

# 👨‍👧 Children Module

**Base path:** `/api/children`

> All endpoints in this module require the `Guardian` role.

---

### POST `/api/children`

Create a child account linked to the authenticated Guardian.

**Auth required:** ✅ Yes

**Allowed roles:** `Guardian`

**Request Body:**

```json
{
  "name": "Sara Doe",
  "username": "saradoe",
  "email": "sara@example.com",
  "password": "ChildPass123!",
  "birthdate": "2015-03-10"
}
```

| Field       | Type   | Required | Notes                |
| ----------- | ------ | -------- | -------------------- |
| `name`      | string | ✅       |                      |
| `username`  | string | ✅       | Must be unique       |
| `email`     | string | ✅       | Must be unique       |
| `password`  | string | ✅       | Minimum 8 characters |
| `birthdate` | date   | ✅       | ISO 8601 date string |

**Response `201`:**

```json
{
  "message": "Child created successfully"
}
```

---

### GET `/api/children`

Fetch all children linked to the authenticated Guardian, including each child's started stages and their progress.

**Auth required:** ✅ Yes

**Allowed roles:** `Guardian`

**Response `200`:**

```json
{
  "message": "Children fetched successfully",
  "children": [
    {
      "_id": "664abc123def456abc123def",
      "name": "Sara Doe",
      "username": "saradoe",
      "email": "sara@example.com",
      "role": "Child",
      "parentId": "664parent000000000000001",
      "provider": "local",
      "profileImage": null,
      "birthdate": "2015-03-10T00:00:00.000Z",
      "tags": ["Basics"],
      "overall_progress": { "en": 0.3, "ar": 0.0 },
      "average_accuracy": { "en": 0.75, "ar": 0.0 },
      "achievements": [],
      "total_study_seconds": 900,
      "current_streak_days": 2,
      "longest_streak_days": 4,
      "last_study_date": "2024-06-09T00:00:00.000Z",
      "createdAt": "2024-05-15T10:00:00.000Z",
      "updatedAt": "2024-06-09T15:00:00.000Z",
      "stages": [
        {
          "_id": "664def111aaa222bbb333ccc",
          "name": "Basics",
          "language": "en",
          "order_index": 1,
          "total_levels": 10,
          "status": "in_progress",
          "completed_levels": 3,
          "progress": 0.3
        }
      ]
    }
  ]
}
```

> `stages` is an empty array `[]` if the child hasn't started any stage yet.

---

### GET `/api/children/:childId`

Fetch a single child. The child must belong to the authenticated Guardian.

**Auth required:** ✅ Yes

**Allowed roles:** `Guardian`

**URL Params:**

| Param     | Type   | Required | Notes                  |
| --------- | ------ | -------- | ---------------------- |
| `childId` | string | ✅       | Valid MongoDB ObjectId |

**Response `200`:**

```json
{
  "message": "Child fetched successfully",
  "child": {
    "_id": "664abc123def456abc123def",
    "name": "Sara Doe",
    "username": "saradoe",
    "email": "sara@example.com",
    "role": "Child",
    "parentId": "664parent000000000000001",
    "provider": "local",
    "profileImage": null,
    "birthdate": "2015-03-10T00:00:00.000Z",
    "tags": [],
    "overall_progress": { "en": 0.0, "ar": 0.0 },
    "average_accuracy": { "en": 0.0, "ar": 0.0 },
    "achievements": [],
    "total_study_seconds": 0,
    "current_streak_days": 0,
    "longest_streak_days": 0,
    "last_study_date": null,
    "createdAt": "2024-05-15T10:00:00.000Z",
    "updatedAt": "2024-05-15T10:00:00.000Z",
    "stages": []
  }
}
```

---

### PATCH `/api/children/:childId`

Update a child's profile. Returns the full updated child object including stages — same shape as `GET /children` entries — so the frontend can replace the child in its local list directly without a follow-up call.

**Auth required:** ✅ Yes

**Allowed roles:** `Guardian`

**URL Params:**

| Param     | Type   | Required |
| --------- | ------ | -------- |
| `childId` | string | ✅       |

**Request Body** (all optional, at least one required):

```json
{
  "name": "Sara Updated",
  "username": "saraupdated",
  "birthdate": "2015-03-10",
  "profileImage": "https://cdn.example.com/child-avatar.png"
}
```

| Field          | Type   | Required | Notes                |
| -------------- | ------ | -------- | -------------------- |
| `name`         | string | ❌       |                      |
| `username`     | string | ❌       | Must be unique       |
| `birthdate`    | date   | ❌       | ISO 8601 date string |
| `profileImage` | string | ❌       | Must be a valid URL  |

**Response `200`:**

```json
{
  "message": "Child updated successfully",
  "child": {
    "_id": "664abc123def456abc123def",
    "name": "Sara Updated",
    "username": "saraupdated",
    "email": "sara@example.com",
    "role": "Child",
    "parentId": "664parent000000000000001",
    "provider": "local",
    "profileImage": "https://cdn.example.com/child-avatar.png",
    "birthdate": "2015-03-10T00:00:00.000Z",
    "tags": ["Basics"],
    "overall_progress": { "en": 0.3, "ar": 0.0 },
    "average_accuracy": { "en": 0.75, "ar": 0.0 },
    "achievements": [],
    "total_study_seconds": 900,
    "current_streak_days": 2,
    "longest_streak_days": 4,
    "last_study_date": "2024-06-09T00:00:00.000Z",
    "createdAt": "2024-05-15T10:00:00.000Z",
    "updatedAt": "2024-06-10T09:00:00.000Z",
    "stages": [
      {
        "_id": "664def111aaa222bbb333ccc",
        "name": "Basics",
        "language": "en",
        "order_index": 1,
        "total_levels": 10,
        "status": "in_progress",
        "completed_levels": 3,
        "progress": 0.3
      }
    ]
  }
}
```

> The response shape matches each child object in `GET /children`. The frontend can find the child by `_id` in its local list and replace it with this response directly.

---

### DELETE `/api/children/:childId`

Permanently delete a child account. The child must belong to the authenticated Guardian.

**Auth required:** ✅ Yes

**Allowed roles:** `Guardian`

**URL Params:**

| Param     | Type   | Required |
| --------- | ------ | -------- |
| `childId` | string | ✅       |

**Response `200`:**

```json
{
  "message": "Child deleted successfully"
}
```

---

---

# 📚 Stages Module

**Base path:** `/api/stages`

---

### GET `/api/stages?language=en`

Fetch all stages for a given language, sorted by `order_index`, with the learner's progress for each.

**Auth required:** ✅ Yes

**Allowed roles:** `User`, `Child`

**Query Params:**

| Param      | Type   | Required | Notes            |
| ---------- | ------ | -------- | ---------------- |
| `language` | string | ✅       | `"en"` or `"ar"` |

**Response `200`:**

```json
{
  "message": "Stages fetched successfully",
  "data": [
    {
      "stage": {
        "_id": "664abc111aaa222bbb333001",
        "name": "Basics",
        "language": "en",
        "order_index": 1,
        "total_levels": 10
      },
      "learner_progress": {
        "status": "in_progress",
        "completed_levels": 4,
        "progress": 0.4
      }
    },
    {
      "stage": {
        "_id": "664abc111aaa222bbb333002",
        "name": "Intermediate",
        "language": "en",
        "order_index": 2,
        "total_levels": 12
      },
      "learner_progress": null
    }
  ]
}
```

> `learner_progress` is `null` when the learner has not started that stage yet.

---

### POST `/api/stages/:stageId/start`

Mark a stage as started for the learner. Creates a `LearnerStageProgress` record. **Idempotent** — if already started, returns the existing progress with status `200` instead of creating a duplicate.

**Auth required:** ✅ Yes

**Allowed roles:** `User`, `Child`

**URL Params:**

| Param     | Type   | Required |
| --------- | ------ | -------- |
| `stageId` | string | ✅       |

**Response `201`** (first time — newly created):

```json
{
  "data": {
    "status": "in_progress",
    "completed_levels": 0,
    "progress": 0
  }
}
```

**Response `200`** (already started — returns existing progress):

```json
{
  "data": {
    "status": "in_progress",
    "completed_levels": 4,
    "progress": 0.4
  }
}
```

---

### GET `/api/stages/:stageId/levels`

Fetch all level progress records for the learner within a specific stage, sorted by `level_index` ascending.

**Auth required:** ✅ Yes

**Allowed roles:** `User`, `Child`

**URL Params:**

| Param     | Type   | Required |
| --------- | ------ | -------- |
| `stageId` | string | ✅       |

**Response `200`:**

```json
{
  "message": "Level progress fetched successfully",
  "data": [
    {
      "level_index": 1,
      "status": "completed",
      "attempts": 3,
      "accuracy": 0.9,
      "best_accuracy": 0.95,
      "completed_at": "2024-06-01T10:30:00.000Z"
    },
    {
      "level_index": 2,
      "status": "completed",
      "attempts": 1,
      "accuracy": 1.0,
      "best_accuracy": 1.0,
      "completed_at": "2024-06-01T11:00:00.000Z"
    }
  ]
}
```

> Only levels the learner has **attempted at least once** are returned.
> `completed_at` is `null` if the level was attempted but not yet completed.

---

---

# 🎮 Sessions Module

**Base path:** `/api/sessions`

Sessions track a learner's real-time activity during a single level attempt. Study time is measured accurately — gaps longer than 60 seconds (e.g. app backgrounded) are not counted toward duration.

**Standard Flutter flow:**

```
POST /sessions/start  →  (every 30s) POST /sessions/heartbeat  →  POST /sessions/end
```

---

### POST `/api/sessions/start`

Start a new learning session when the user taps "Play" on a level.

> If an existing active session is found (e.g. app crashed without calling `/end`), it is automatically **abandoned** and its partial time is saved before the new session starts.

**Auth required:** ✅ Yes

**Allowed roles:** `User`, `Child`

**Request Body:**

```json
{
  "stage_id": "664abc111aaa222bbb333001",
  "level_index": 3
}
```

| Field         | Type   | Required | Notes                                                            |
| ------------- | ------ | -------- | ---------------------------------------------------------------- |
| `stage_id`    | string | ✅       | Valid MongoDB ObjectId                                           |
| `level_index` | number | ✅       | Integer, minimum `1`. Must not exceed the stage's `total_levels` |

**Response `201`:**

```json
{
  "message": "Session started",
  "data": {
    "session_id": "664xyz000aaa111bbb222ccc"
  }
}
```

> Save `session_id` — required for heartbeat and end calls.

---

### POST `/api/sessions/heartbeat`

Send a heartbeat every ~30 seconds while the game is running. Gaps longer than 60 seconds between heartbeats are skipped — the clock resets without adding the away-time to `duration_seconds`.

**Auth required:** ✅ Yes

**Allowed roles:** `User`, `Child`

**Request Body:**

```json
{
  "session_id": "664xyz000aaa111bbb222ccc"
}
```

| Field        | Type   | Required |
| ------------ | ------ | -------- |
| `session_id` | string | ✅       |

**Response `200`:**

```json
{
  "message": "Heartbeat received"
}
```

---

### POST `/api/sessions/end`

End the session when the level finishes or is abandoned. On completion, finalizes duration and triggers updates to level progress, stage progress, overall progress, average accuracy, streak, and achievements — and logs the activity.

**Auth required:** ✅ Yes

**Allowed roles:** `User`, `Child`

**Request Body:**

```json
{
  "session_id": "664xyz000aaa111bbb222ccc",
  "accuracy": 0.87,
  "completed": true
}
```

| Field        | Type    | Required | Notes                                                             |
| ------------ | ------- | -------- | ----------------------------------------------------------------- |
| `session_id` | string  | ✅       | Valid MongoDB ObjectId                                            |
| `accuracy`   | number  | ✅       | Float `0.0` – `1.0`. Only meaningful when `completed: true`       |
| `completed`  | boolean | ❌       | `true` = level finished, `false` = abandoned. Defaults to `false` |

**Response `200` — Abandoned (`completed: false`):**

```json
{
  "message": "Session ended",
  "data": {
    "duration_seconds": 45,
    "completed": false
  }
}
```

**Response `200` — Completed (`completed: true`):**

```json
{
  "message": "Session completed",
  "data": {
    "duration_seconds": 120,
    "level_progress": {
      "level_index": 3,
      "status": "completed",
      "attempts": 2,
      "accuracy": 0.87,
      "best_accuracy": 0.95
    },
    "stage_progress": {
      "status": "in_progress",
      "completed_levels": 3,
      "progress": 0.3
    },
    "achievements": [
      {
        "key": "PERFECT_SCORE",
        "name": "Perfect Score",
        "earned_at": "2026-03-10T20:39:24.903Z"
      }
    ]
  }
}
```

> When the learner completes the **last level** of a stage, `stage_progress.status` becomes `"completed"`.
> Replaying an already-completed level updates `accuracy`, `attempts`, and `best_accuracy` but does **not** re-increment `completed_levels`.

---

---

# 📋 Activity Module

**Base path:** `/api/activity`

Activity logs are **automatically created by the system** when a learner completes a level, completes a stage, or earns an achievement. The frontend reads these logs to power history feeds and the parent dashboard.

**Activity types:**

| Type                 | When it is created                                  |
| -------------------- | --------------------------------------------------- |
| `level_completed`    | Every time a learner successfully completes a level |
| `stage_completed`    | When a learner completes all levels in a stage      |
| `achievement_earned` | When a new achievement is unlocked                  |

---

### GET `/api/activity/parent?limit=20`

Fetch recent activity across **all children** linked to the authenticated Guardian. Sorted newest-first. Each log includes the child's name and profile image.

**Auth required:** ✅ Yes

**Allowed roles:** `Guardian`

**Query Params:**

| Param   | Type   | Required | Notes                                      |
| ------- | ------ | -------- | ------------------------------------------ |
| `limit` | number | ❌       | Records to return. Default `20`, max `100` |

**Response `200`:**

```json
{
  "message": "Activity fetched successfully",
  "data": [
    {
      "_id": "664log111aaa222bbb333001",
      "type": "level_completed",
      "description": "Completed Level 3 of Basics",
      "metadata": {
        "stage_name": "Basics",
        "level_index": 3,
        "accuracy": 0.87
      },
      "created_at": "2024-06-10T14:30:00.000Z",
      "learner": {
        "_id": "664abc123def456abc123def",
        "name": "Sara Doe",
        "profileImage": "https://cdn.example.com/sara.png"
      }
    },
    {
      "_id": "664log111aaa222bbb333002",
      "type": "achievement_earned",
      "description": "Earned the \"First Step\" achievement",
      "metadata": {
        "achievement_key": "FIRST_STEP"
      },
      "created_at": "2024-06-10T14:30:01.000Z",
      "learner": {
        "_id": "664abc123def456abc123def",
        "name": "Sara Doe",
        "profileImage": null
      }
    },
    {
      "_id": "664log111aaa222bbb333003",
      "type": "stage_completed",
      "description": "Completed the Basics stage",
      "metadata": {
        "stage_name": "Basics"
      },
      "created_at": "2024-06-10T14:30:02.000Z",
      "learner": {
        "_id": "664abc123def456abc123def",
        "name": "Sara Doe",
        "profileImage": null
      }
    }
  ]
}
```

**Metadata fields by activity type:**

| `type`               | Metadata fields present                 |
| -------------------- | --------------------------------------- |
| `level_completed`    | `stage_name`, `level_index`, `accuracy` |
| `stage_completed`    | `stage_name`                            |
| `achievement_earned` | `achievement_key`                       |

---

### GET `/api/activity/me?limit=20`

Fetch the authenticated learner's own activity history. Sorted newest-first. No `learner` field since it is the current user.

**Auth required:** ✅ Yes

**Allowed roles:** `User`, `Child`

**Query Params:**

| Param   | Type   | Required | Notes                                      |
| ------- | ------ | -------- | ------------------------------------------ |
| `limit` | number | ❌       | Records to return. Default `20`, max `100` |

**Response `200`:**

```json
{
  "message": "Activity fetched successfully",
  "data": [
    {
      "_id": "664log111aaa222bbb333001",
      "type": "level_completed",
      "description": "Completed Level 3 of Basics",
      "metadata": {
        "stage_name": "Basics",
        "level_index": 3,
        "accuracy": 0.87
      },
      "created_at": "2024-06-10T14:30:00.000Z"
    },
    {
      "_id": "664log111aaa222bbb333002",
      "type": "achievement_earned",
      "description": "Earned the \"Perfect Score\" achievement",
      "metadata": {
        "achievement_key": "PERFECT_SCORE"
      },
      "created_at": "2024-06-09T09:15:00.000Z"
    }
  ]
}
```

---

---

# 🏅 Achievements Reference

Achievements are automatically awarded at the end of a session when their conditions are met. New achievements appear in the user's `achievements` array on their profile and trigger an `achievement_earned` activity log.

| Key             | Name          | Condition                                              |
| --------------- | ------------- | ------------------------------------------------------ |
| `FIRST_STEP`    | First Step    | Complete your very first level ever                    |
| `PERFECT_SCORE` | Perfect Score | Achieve 100% accuracy on any level (`accuracy >= 1.0`) |
| `FAST_LEARNER`  | Fast Learner  | Complete all levels in any stage                       |
| `STREAK_7`      | 7 Day Streak  | Maintain a study streak of 7 consecutive days          |
| `STREAK_30`     | 30 Day Streak | Maintain a study streak of 30 consecutive days         |

---

---

# 🔄 Typical Flutter Flow

### New User Registration

```
POST /api/auth/signup              → OTP sent to email
POST /api/auth/confirmEmail        → receive accessToken + refreshToken
```

### OAuth Login

```
POST /api/auth/oauth               → receive accessToken + refreshToken
```

### Password Reset

```
POST /api/auth/forget-password     → OTP sent to email
POST /api/auth/verify-forgot-otp   → receive resetToken
PATCH /api/auth/reset-password     → Authorization: Bearer <resetToken>
```

### Token Refresh

```
POST /api/auth/refresh-token       → Authorization: Bearer <refreshToken>
                                   → receive new accessToken + refreshToken
```

### Playing a Level

```
GET  /api/stages?language=en              → browse all stages + learner progress for each

  [user taps a stage]

POST /api/stages/:stageId/start           → create progress record for this stage
GET  /api/stages/:stageId/levels          → fetch which levels have been attempted + their progress
                                            Flutter matches these to its hardcoded level list
                                            using level_index. Levels not in the response are
                                            untouched and shown in their default state.

  [user taps Play on a level]

POST /api/sessions/start                  → begin session, receive session_id
  [every ~30 seconds while playing]
  POST /api/sessions/heartbeat            → { session_id }

POST /api/sessions/end                    → submit { session_id, accuracy, completed }
  → receive updated level_progress + stage_progress
     Flutter updates the matching level_index entry in its local level list
```

### Guardian Dashboard

```
GET  /api/children                      → list all children + stages
GET  /api/activity/parent?limit=20      → activity feed for all children
PATCH /api/children/:childId            → update child, receive full child + stages
DELETE /api/children/:childId           → remove child account
```

### Learner Profile

```
GET   /api/users/me                     → full profile + stages
PATCH /api/users/me                     → update profile, receive full profile + stages
GET   /api/activity/me?limit=20         → personal activity history
GET   /api/stages/:stageId/levels       → level-by-level progress for a stage
```

---

---

# ⚠️ Error Reference

| Status | Meaning                                                             |
| ------ | ------------------------------------------------------------------- |
| `400`  | Bad Request — invalid input, duplicate email/username, OTP mismatch |
| `401`  | Unauthorized — missing, invalid, or expired token                   |
| `403`  | Forbidden — role does not have permission for this endpoint         |
| `404`  | Not Found — resource does not exist                                 |
| `500`  | Internal Server Error                                               |

---

## General Notes

- All `_id` values are **MongoDB ObjectIds** — 24-character hex strings.
- All dates are returned as **ISO 8601** strings (`"2024-06-10T14:30:00.000Z"`). Input dates accept shorthand `"2000-01-15"`.
- `accuracy` and `progress` are always floats `0.0` – `1.0`. Multiply by 100 to display as a percentage.
- `total_study_seconds` is a raw integer. Divide by 60 for minutes or 3600 for hours.
- `PATCH /users/me` and `PATCH /children/:childId` both return the full object including `stages`. The frontend can replace its local state directly without any follow-up GET call.
- Replaying a completed level updates `accuracy`, `best_accuracy`, and `attempts` but does **not** re-increment `completed_levels` or `progress`.
- The streak counter resets to `1` if a full calendar day is skipped. Studying multiple times in one day counts as a single streak day.
- `last_study_date` is updated every time a session is **completed** (not abandoned).
