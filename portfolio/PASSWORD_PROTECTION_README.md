# Portfolio Password Protection

Your portfolio folder is now password-protected!

## Default Password
**Password:** `portfolio123`

## Changing the Password

To change the password, follow these steps:

1. **Generate a SHA-256 hash** of your desired password:
   - Visit: https://sha256.org/
   - Enter your new password
   - Copy the generated hash

2. **Update the password hash**:
   - Open `portfolio/index.html` in a text editor
   - Find this line (around line 91):
     ```javascript
     const PASSWORD_HASH = "a665e97f08da3a6e5a85e99fa5cee0ed863873ac6abaf2f6a9e51ad2c69e03c3";
     ```
   - Replace the hash with your new hash from step 1
   - Save the file

3. **Commit and push** your changes:
   ```bash
   git add portfolio/index.html
   git commit -m "Update portfolio password"
   git push origin main
   ```

## How It Works

- When someone visits your portfolio (`/portfolio/`), they encounter a password gate
- They must enter the correct password to access the portfolio content
- The password is verified using SHA-256 hashing for basic security
- Access is remembered during the browser session (clearing cookies/cache will require re-authentication)

## Security Notes

⚠️ **Important**: This is client-side password protection. It's suitable for basic access control but is not suitable for highly sensitive data. The password can be found by viewing the page source code (SHA-256 can be reverse-looked up, though it's harder for specific phrases).

For more sensitive content, consider:
- Using a backend server with proper authentication
- Server-side password protection
- Restricting the portfolio repository to private organization access
