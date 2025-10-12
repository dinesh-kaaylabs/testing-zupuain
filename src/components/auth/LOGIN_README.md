# Login Page Components

This directory contains all the components for the Login Page implementation with dual authentication (Email/Password and Phone/OTP), following the requirements specified in the user prompt.

## Components Overview

### 1. **LoginPage.tsx** (Main Page)
- **Purpose**: Main login page with tab switching and automatic guest cart sync
- **Features**:
  - **Dual Auth Tabs**:
    - Email/Password tab (with Mail icon)
    - Phone/OTP tab (with MessageSquare icon)
    - Smooth tab switching with fade-in animations
    - Active tab highlighting (blue with bottom border)
  - **Guest Cart Badge**:
    - Shows item count if guest has items in cart
    - Encourages login to save cart
    - Blue info banner with icon
  - **Beautiful Gradient Header**:
    - Blue to purple gradient background
    - Welcome message with emoji
    - "Sign in to continue shopping" subtitle
  - **Automatic Redirects**:
    - Redirects to `location.state?.from?.pathname` after login
    - Falls back to home `/` if no redirect path
    - Auto-redirects if already authenticated
  - **Guest Cart Sync**:
    - Uses `useGuestCartSync()` hook
    - Automatically syncs guest cart after successful login
    - Shows success toast with item count
  - **Responsive Design**:
    - Centered card layout
    - Max width 28rem (md)
    - Gradient background
    - Mobile-optimized spacing
  - **Footer Links**:
    - "Don't have an account? Sign up now"
    - Terms of Service and Privacy Policy links
  - **SEO**: `<SEOHead title="Login" description="..." />`

**Tab Switching Logic**:
```typescript
const [activeTab, setActiveTab] = useState<AuthTab>('email');
const [isTransitioning, setIsTransitioning] = useState(false);

const handleTabChange = (tab: AuthTab) => {
  setIsTransitioning(true);
  setTimeout(() => {
    setActiveTab(tab);
    setIsTransitioning(false);
  }, 150);
};
```

### 2. **LoginForm.tsx** (Email/Password Form)
- **Purpose**: Email and password login form with validation
- **Features**:
  - **Email Field**:
    - Mail icon (left)
    - Email input type
    - Placeholder: "Enter your email"
    - Real-time validation on blur
    - Error message display
    - Autocomplete="email"
  - **Password Field**:
    - Lock icon (left)
    - Password input type (toggleable)
    - Show/Hide password button (Eye/EyeOff icon)
    - Placeholder: "Enter your password"
    - Real-time validation on blur
    - Error message display
    - Autocomplete="current-password"
  - **Remember Me Checkbox**:
    - Persistent session (if implemented)
    - Left side of row
  - **Forgot Password Link**:
    - Right side of row
    - Links to `/forgot-password`
  - **Submit Button**:
    - Blue gradient background
    - "Sign In" text
    - Loading spinner when submitting
    - Disabled during loading
    - Hover scale effect
  - **Alternative Login**:
    - Divider: "Or continue with"
    - "Try OTP Login" link
  - **Validation**:
    - Uses `useLogin()` hook
    - `handleInputChange` clears field errors
    - `validateField` shows errors on blur
    - Real-time inline error messages
  - **Loading States**:
    - Form disabled while loading
    - Button shows "Signing in..." with spinner
    - All fields disabled

**Hook Usage**:
```typescript
const {
  credentials, // { email_address, password, rememberMe }
  errors, // { email_address?: string, password?: string }
  loading,
  handleInputChange, // (field, value) => void
  handleSubmit, // (e) => Promise<boolean>
  validateField, // (field) => void
} = useLogin();

// Input example
<input 
  value={credentials.email_address}
  onChange={(e) => handleInputChange('email_address', e.target.value)}
  onBlur={() => validateField('email_address')}
/>

// Submit example
const onSubmit = async (e: React.FormEvent) => {
  const success = await handleSubmit(e);
  if (success) {
    onSuccess(); // Navigate + cart sync
  }
};
```

### 3. **OTPForm.tsx** (Phone/OTP Form)
- **Purpose**: Phone number and OTP verification form with countdown timer
- **Features**:
  - **Phone Number Field**:
    - Phone icon (left)
    - Tel input type
    - 10-digit max length
    - Number-only input
    - Placeholder: "Enter your phone number"
    - Checkmark icon when OTP sent
    - Disabled after OTP sent
    - "Change number?" link
  - **Send OTP Button**:
    - Green gradient background
    - Send icon
    - "Send OTP" text
    - Loading spinner when sending
    - Disabled if phone empty
  - **OTP Field** (shown after OTP sent):
    - Hash icon (left)
    - 6-digit input
    - Large, centered, monospace font
    - Tracking widest (letter spacing)
    - Placeholder: "● ● ● ● ● ●"
    - Number-only input (inputMode="numeric")
    - Auto-focus when shown
    - Max length 6
  - **Countdown Timer**:
    - 60-second countdown
    - "Resend OTP in Xs" display
    - Blue highlighted seconds
    - "Resend OTP" link when countdown ends
  - **Verify OTP Button**:
    - Blue gradient background
    - CheckCircle icon
    - "Verify & Sign In" text
    - Disabled if OTP not 6 digits
    - Loading spinner when verifying
  - **Info Box**:
    - Blue background
    - Shows phone number after OTP sent
    - Helpful instructions
  - **Alternative Login**:
    - "Prefer email? Use Email Login" link
  - **Validation**:
    - Uses `useOTP()` hook
    - Phone number validation
    - OTP format validation (6 digits)
    - Real-time inline errors

**Hook Usage**:
```typescript
const {
  otpData, // { phone_number, otp }
  errors, // { phone_number?: string, otp?: string }
  loading,
  otpSent, // boolean
  handleInputChange, // (field, value) => void
  handleSendOTP, // () => Promise<void>
  handleVerifyOTP, // (e) => Promise<boolean>
  validateField, // (field) => void
  resetOTP, // () => void
} = useOTP();

// Countdown timer logic
const [countdown, setCountdown] = useState(0);
const [canResend, setCanResend] = useState(true);

useEffect(() => {
  if (countdown > 0) {
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  } else if (countdown === 0 && otpSent) {
    setCanResend(true);
  }
}, [countdown, otpSent]);

// Send OTP
const handleSendOTPClick = async () => {
  await handleSendOTP();
  if (!errors.phone_number) {
    setCountdown(60);
    setCanResend(false);
  }
};
```

---

## Hooks Used

### 1. **useLogin()** (Email/Password)
**Location**: `src/hooks/auth/useLogin.tsx`

**Returns**:
```typescript
{
  credentials: {
    email_address: string;
    password: string;
    rememberMe?: boolean;
  };
  errors: Record<string, string>;
  loading: boolean;
  handleInputChange: (field: keyof LoginCredentials, value: string | boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<boolean>;
  validateField: (field: keyof LoginCredentials) => void;
  clearErrors: () => void;
}
```

**Features**:
- Manages complete form state
- Real-time validation
- Dispatches `loginUser` action
- Returns `Promise<boolean>` from handleSubmit
- Clears errors on input change
- Success toast with user name
- Error toast for failures

### 2. **useOTP()** (Phone/OTP)
**Location**: `src/hooks/auth/useOTP.tsx`

**Returns**:
```typescript
{
  otpData: {
    phone_number: string;
    otp: string;
  };
  errors: Record<string, string>;
  loading: boolean;
  otpSent: boolean;
  handleInputChange: (field: keyof OTPData, value: string) => void;
  handleSendOTP: () => Promise<void>;
  handleVerifyOTP: (e: React.FormEvent) => Promise<boolean>;
  validateField: (field: keyof OTPData) => void;
  clearErrors: () => void;
  resetOTP: () => void;
}
```

**Features**:
- Two-step process (send → verify)
- `otpSent` flag for UI state
- Phone number validation (regex)
- OTP validation (6 digits, numbers only)
- Dispatches `sendOtp` and `verifyOtp` actions
- Returns `Promise<boolean>` from handleVerifyOTP
- Success/error toasts

### 3. **useGuestCartSync()** (Cart Sync)
**Location**: `src/hooks/auth/useGuestCartSync.tsx`

**Returns**:
```typescript
{
  syncGuestCart: () => Promise<void>;
  hasGuestItems: boolean;
  guestItemCount: number;
}
```

**Features**:
- Checks if guest has items in cart
- Syncs guest cart to user account after login
- Shows success toast with item count
- Automatically called by LoginPage after successful login
- Uses Redux `syncGuestCart` action

---

## Requirements Met

### ✅ Dual Auth
- ✔️ Email/password form
- ✔️ Phone/OTP form
- ✔️ Tab switching with Mail and MessageSquare icons
- ✔️ Smooth fade-in animations

### ✅ Validation
- ✔️ Real-time field validation
- ✔️ Inline error messages (red text)
- ✔️ Email format validation
- ✔️ Password min length validation
- ✔️ Phone number validation
- ✔️ OTP format validation (6 digits)

### ✅ Loading States
- ✔️ Button spinners during submission
- ✔️ Form disabled while loading
- ✔️ "Signing in..." / "Sending OTP..." / "Verifying..." text

### ✅ Cart Sync
- ✔️ `useGuestCartSync()` automatically merges guest cart
- ✔️ Called after successful login
- ✔️ Shows guest item count badge
- ✔️ Success toast with item count

### ✅ Redirect
- ✔️ Navigate to `location.state?.from?.pathname || "/"`
- ✔️ Uses `useLocation()` and `useNavigate()`
- ✔️ Auto-redirect if already authenticated

### ✅ Remember Me
- ✔️ Checkbox for persistent session
- ✔️ Stored in credentials object

### ✅ Tab Switching
- ✔️ Smooth animations with fade-in effect
- ✔️ 150ms transition delay
- ✔️ Opacity 0 → 100

### ✅ SEO
- ✔️ `<SEOHead title="Login" description="..." />`

### ✅ Additional Features
- ✔️ Show/hide password toggle
- ✔️ Forgot password link
- ✔️ Sign up link
- ✔️ OTP countdown timer (60s)
- ✔️ Resend OTP functionality
- ✔️ Change phone number option
- ✔️ Alternative login links
- ✔️ Terms and Privacy Policy links
- ✔️ Info boxes with helpful text

---

## Constraints Followed

- ✔️ **useLogin()** manages complete form state (READ-ONLY hook)
- ✔️ Use `credentials` object for inputs:
  ```typescript
  <input 
    value={credentials.email_address}
    onChange={(e) => handleInputChange("email_address", e.target.value)}
  />
  ```
- ✔️ **handleSubmit()** returns `Promise<boolean>` (true = success)
- ✔️ **useGuestCartSync()** called internally after auth
- ✔️ Redirect uses `location.state?.from?.pathname || "/"`
- ✔️ **handleInputChange** clears field errors
- ✔️ **validateField** shows errors on blur
- ✔️ Tab switching: Smooth fade-in (opacity-0 → opacity-100)
- ✔️ OTP countdown: 60s timer with display
- ✔️ **3 SRP components**: LoginPage (layout), LoginForm (email), OTPForm (phone)
- ✔️ **Strict Hook rules**: All hooks are READ-ONLY

---

## File Structure

```
src/
├── pages/
│   └── LoginPage.tsx                 (155 lines)
├── components/auth/
│   ├── LoginForm.tsx                 (171 lines)
│   ├── OTPForm.tsx                   (233 lines)
│   └── LOGIN_README.md               (This file)
└── hooks/auth/
    ├── useLogin.tsx                  (127 lines - Already exists)
    ├── useOTP.tsx                    (161 lines - Already exists)
    └── useGuestCartSync.tsx          (40 lines - Already exists)
```

---

## Validation Rules

### Email/Password:
```typescript
// Email
- Required
- Format: /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Password
- Required
- Min length: 6 characters
```

### Phone/OTP:
```typescript
// Phone
- Required
- Format: /^[\+]?[1-9][\d]{0,15}$/
- Max length: 10 digits

// OTP
- Required
- Length: exactly 6 digits
- Format: /^\d{6}$/
```

---

## Animations

- **Tab Switch**: 150ms fade-in transition
  ```typescript
  opacity-0 → opacity-100 (300ms duration)
  ```
- **Form Content**: Fade-in on mount (`animate-fade-in`)
- **Buttons**: Scale on hover (`hover:scale-[1.02]`)
- **Loading Spinners**: Continuous rotation (`animate-spin`)
- **Error Messages**: Fade-in when shown (`animate-fade-in`)

---

## Color Scheme

**Primary**: Blue gradient (blue-600 to blue-700)
**Success**: Green gradient (green-600 to green-700)
**Error**: Red (red-500/600)
**Info**: Blue background (blue-50/100)
**Border Active**: Blue (blue-600)
**Border Error**: Red (red-500)

---

## Accessibility

- ✔️ ARIA labels on password toggle
- ✔️ Keyboard navigation (Tab/Enter)
- ✔️ Focus states on all inputs
- ✔️ Semantic HTML (form, input, button)
- ✔️ Autocomplete attributes
- ✔️ Disabled states
- ✔️ Loading states announced
- ✔️ Error messages below fields

---

## Responsive Design

- **Mobile** (< 640px): Full width, compact spacing
- **Desktop** (≥ 640px): Centered card (max-w-md), larger padding

---

## Testing Checklist

- [ ] Email validation works
- [ ] Password validation works
- [ ] Show/hide password toggle works
- [ ] Remember me checkbox works
- [ ] Login with email/password succeeds
- [ ] Login with email/password shows errors
- [ ] Phone number validation works
- [ ] Send OTP button works
- [ ] OTP countdown timer works (60s)
- [ ] Resend OTP works
- [ ] Change phone number works
- [ ] OTP verification succeeds
- [ ] OTP verification shows errors
- [ ] Tab switching works smoothly
- [ ] Guest cart badge shows when items present
- [ ] Guest cart syncs after login
- [ ] Redirect to `from` path works
- [ ] Redirect to home works if no `from`
- [ ] Auto-redirect if already authenticated
- [ ] Loading states show correctly
- [ ] All animations smooth
- [ ] Dark mode works
- [ ] Mobile responsive layout
- [ ] Toast notifications appear

---

## Error Scenarios

1. **Invalid Email**: Shows "Please enter a valid email address"
2. **Invalid Password**: Shows "Password must be at least 6 characters"
3. **Invalid Phone**: Shows "Please enter a valid phone number"
4. **Invalid OTP**: Shows "OTP must be 6 digits"
5. **Login Failed**: Shows error toast with server message
6. **OTP Send Failed**: Shows error toast
7. **OTP Verify Failed**: Shows error toast
8. **Network Error**: Shows "An unexpected error occurred"
9. **Cart Sync Failed**: Shows error toast (doesn't block login)

---

## Future Enhancements

1. Social login (Google, Facebook)
2. Biometric authentication
3. Two-factor authentication (2FA)
4. Password strength meter
5. Captcha for security
6. Login history tracking
7. Device management
8. Session timeout warnings
9. Magic link login
10. Remember device option

---

## Notes

- All hooks (`useLogin`, `useOTP`, `useGuestCartSync`) already exist and are well-tested
- Cart sync happens automatically - no manual action needed
- Redirect path passed via router state: `<Navigate to="/login" state={{ from: location }} />`
- Remember Me currently stores preference (actual implementation may vary)
- OTP is 6 digits by default (can be configured)
- Phone validation accepts international format (but UI shows 10-digit placeholder)
- Dark mode fully supported throughout

