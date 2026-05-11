# Security Specification for Blog Feature

## 1. Data Invariants
- A `BlogUser` must be unique per authenticated UID.
- A `BlogPost` must have a valid `authorId` pointing to an existing `BlogUser`.
- Only `admin` role users can set `isIncoded` to true or modify other users' roles.
- `createdAt` is immutable.
- `slug` must be unique (enforced by application, but validated as string).

## 2. Global Helpers
- `isValidId(id)`: Regex and size check.
- `isSignedIn()`: Basic auth check.
- `isAdmin()`: Check if `request.auth.uid` exists in a trusted `admins` collection OR has `admin` role in `blog_users`. Let's use `blog_users` role check.
- `isOwner(id)`: `request.auth.uid == id`.

## 3. Detailed Rules Mapping
- `/blog_users/{userId}`:
  - `get`: Any authenticated user.
  - `list`: Admins only.
  - `create`: Self (UID must match), `role` must be "user", `isVerified` must be false, `isIncoded` must be false.
  - `update`: Self (only `fullName`, `phoneNumber`). Admin (all fields).
- `/blog_posts/{postId}`:
  - `get`, `list`: Anyone (public).
  - `create`: Authenticated user. Must match `authorId`.
  - `update`: Author or Admin.
  - `delete`: Author or Admin.

## 4. The "Dirty Dozen" Payloads
1. **Identity Spoofing**: Attempt to create a `BlogUser` with someone else's UID.
2. **Privilege Escalation**: Attempt to create a `BlogUser` with `role: 'admin'`.
3. **Privilege Escalation 2**: Attempt to update own `role` to `admin`.
4. **Ghost Field**: Attempt to add `shadowField: true` during post creation.
5. **PII Leak**: Attempt to list all `blog_users` as a regular user.
6. **Orphaned Post**: Create a post with an arbitrary `authorId`.
7. **Role Hijack**: Set `isIncoded: true` as a regular user.
8. **Resource Exhaustion**: Use a 2MB string as `fullName`.
9. **ID Poisoning**: Use `../../malicious` as `userId`.
10. **State Shortcut**: Update a post's `createdAt`.
11. **Metadata Tampering**: Update `authorName` on someone else's post.
12. **Anonymous Write**: Attempt to create a post without `request.auth`.

## 5. Test Runner (Draft)
A comprehensive test suite will follow in `firestore.rules.test.ts`.
