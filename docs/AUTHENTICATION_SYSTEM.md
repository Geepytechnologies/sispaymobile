# Enhanced Authentication System

This document describes the new enhanced authentication system for the Sispay fintech app, which includes JWT token management, automatic refresh, AppState monitoring, and secure PIN-based transactions.

## Features

- **JWT Token Management**: Automatic token validation and refresh
- **AppState Monitoring**: Automatic logout when app goes to background (fintech security)
- **Secure PIN System**: PIN creation, validation, and transaction protection
- **Splash Screen Auth**: Authentication handled during app initialization
- **Biometric Integration**: Optional biometric authentication on app resume
- **Store-Based API**: Tokens loaded into store during splash screen, no async calls needed
- **Automatic Token Refresh**: 401 errors trigger automatic token refresh and request retry

## Architecture

### Services

#### 1. AuthService (`services/auth.service.ts`)

Handles all authentication-related operations:

- Token storage and retrieval
- JWT validation and refresh
- User management
- Automatic token refresh when expiring

```typescript
import authService from "@/services/auth.service";

// Check if user is authenticated
const isAuth = await authService.isAuthenticated();

// Get current user with fresh token
const user = await authService.getCurrentUser();

// Set user and tokens
await authService.setUser(userData);

// Clear user data
await authService.clearUser();
```

#### 2. AppStateService (`services/appState.service.ts`)

Monitors app state changes for security:

- Immediate logout on background (fintech requirement)
- Biometric authentication on resume
- Proactive token refresh

```typescript
import appStateService from "@/services/appState.service";

// Initialize app state monitoring
const cleanup = appStateService.initialize();

// Update configuration
appStateService.updateConfig({
  backgroundLogoutDelay: 0, // Immediate logout
  requireBiometricOnResume: true,
  inactivityLockThreshold: 2 * 60 * 1000, // 2 minutes
});
```

#### 3. TransactionSecurityService (`services/transactionSecurity.service.ts`)

Handles PIN-based transaction security:

- PIN creation and validation
- Transaction security checks
- Attempt limiting and lockout

```typescript
import transactionSecurityService from "@/services/transactionSecurity.service";

// Set user PIN
await transactionSecurityService.setUserPin(userId, pin);

// Validate PIN
const result = await transactionSecurityService.validatePin(userId, inputPin);

// Check if PIN required for transaction
const canProceed = await transactionSecurityService.requirePinForTransaction(
  userId,
  "transfer",
  1000
);
```

### Hooks

#### 1. useAppInitialization (`hooks/useAppInitialization.tsx`)

Handles app initialization with authentication:

- Checks auth status during splash screen
- Automatic navigation based on auth state
- Error handling

```typescript
import { useAppInitialization } from "@/hooks/useAppInitialization";

const { isInitialized, isAuthenticated, user, error } = useAppInitialization();
```

#### 2. useTransactionSecurity (`hooks/useTransactionSecurity.tsx`)

Provides easy integration for PIN-protected transactions:

- PIN status management
- Modal state handling
- Transaction flow integration

```typescript
import useTransactionSecurity from "@/hooks/useTransactionSecurity";

const {
  hasPin,
  showPinModal,
  setShowPinModal,
  validatePin,
  createPin,
  initiateTransaction,
} = useTransactionSecurity();
```

### Components

#### 1. SecureKeypadModal (`components/SecureKeypad/SecureKeypadModal.tsx`)

Enhanced keypad component with:

- PIN input with visual feedback
- PIN creation with confirmation
- Error handling and attempt limiting
- Shake animation for wrong PIN

```typescript
<SecureKeypadModal
  visible={showModal}
  onClose={() => setShowModal(false)}
  onSuccess={handlePinSuccess}
  onError={handlePinError}
  title="Enter PIN"
  subtitle="Enter your 4-digit PIN to continue"
  maxLength={4}
  requireConfirmation={true}
  isCreatingPin={true}
/>
```

#### 2. TransactionWithPin (`components/Transaction/TransactionWithPin.tsx`)

Wrapper component for PIN-protected transactions:

- Automatic PIN requirement check
- PIN creation flow if needed
- Transaction execution after PIN validation

```typescript
<TransactionWithPin
  transactionType="Transfer"
  amount={1000}
  onTransactionSuccess={handleSuccess}
  onTransactionError={handleError}
>
  <YourTransactionButton />
</TransactionWithPin>
```

## Usage Examples

### 1. Basic Transaction with PIN

```typescript
import TransactionWithPin from "@/components/Transaction/TransactionWithPin";

const TransferScreen = () => {
  const handleTransactionSuccess = () => {
    // Transaction completed successfully
    console.log("Transfer completed");
  };

  const handleTransactionError = (error: string) => {
    Alert.alert("Transaction Failed", error);
  };

  return (
    <TransactionWithPin
      transactionType="Transfer"
      amount={500}
      onTransactionSuccess={handleTransactionSuccess}
      onTransactionError={handleTransactionError}
    >
      <TouchableOpacity style={styles.transferButton}>
        <Text>Send $500</Text>
      </TouchableOpacity>
    </TransactionWithPin>
  );
};
```

### 2. Manual PIN Management

```typescript
import useTransactionSecurity from "@/hooks/useTransactionSecurity";

const SettingsScreen = () => {
  const {
    hasPin,
    showCreatePinModal,
    setShowCreatePinModal,
    createPin,
    handleCreatePinSuccess,
  } = useTransactionSecurity();

  const handleCreatePin = () => {
    setShowCreatePinModal(true);
  };

  return (
    <View>
      <Text>PIN Status: {hasPin ? "Set" : "Not Set"}</Text>
      <TouchableOpacity onPress={handleCreatePin}>
        <Text>Create/Change PIN</Text>
      </TouchableOpacity>

      <SecureKeypadModal
        visible={showCreatePinModal}
        onClose={() => setShowCreatePinModal(false)}
        onSuccess={handleCreatePinSuccess}
        title="Create PIN"
        requireConfirmation={true}
        isCreatingPin={true}
      />
    </View>
  );
};
```

### 3. Custom Transaction Flow

```typescript
import useTransactionSecurity from "@/hooks/useTransactionSecurity";

const CustomTransactionScreen = () => {
  const {
    hasPin,
    validatePin,
    requirePinForTransaction,
    showPinModal,
    setShowPinModal,
  } = useTransactionSecurity();

  const handleTransfer = async () => {
    // Check if PIN is required
    const canProceed = await requirePinForTransaction("transfer", 1000);
    if (!canProceed) return;

    if (hasPin) {
      setShowPinModal(true);
    } else {
      // Show PIN creation flow
    }
  };

  const handlePinSuccess = async (pin: string) => {
    const isValid = await validatePin(pin);
    if (isValid) {
      // Proceed with transaction
      executeTransfer();
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleTransfer}>
        <Text>Transfer Money</Text>
      </TouchableOpacity>

      <SecureKeypadModal
        visible={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinSuccess}
        title="Enter PIN"
      />
    </View>
  );
};
```

## Configuration

### AppState Configuration

```typescript
// In your app initialization
appStateService.updateConfig({
  backgroundLogoutDelay: 0, // Immediate logout for fintech
  requireBiometricOnResume: true,
  inactivityLockThreshold: 2 * 60 * 1000, // 2 minutes
});
```

### Transaction Security Configuration

```typescript
// In your app initialization
transactionSecurityService.updateConfig({
  maxPinAttempts: 3,
  pinLockoutDuration: 5 * 60 * 1000, // 5 minutes
  requirePinForTransactions: true,
});
```

## API Integration

### Automatic Token Management

The API system now automatically handles tokens:

```typescript
import Api from "@/utils/Api";

// No need to manually add tokens - they're automatically included
const response = await Api.get("/user/profile");
const transferResponse = await Api.post("/transactions/transfer", {
  amount: 1000,
  recipient: "1234567890",
});
```

### How It Works

1. **During Splash Screen**: Tokens are loaded from secure storage into the store
2. **Proactive Timer**: Automatic token refresh 5 minutes before expiry
3. **API Requests**: Automatically use tokens from the store (no async calls)
4. **Fallback Refresh**: 401 errors trigger automatic refresh and request retry
5. **Store Updates**: Refreshed tokens are automatically saved to store

## Security Features

1. **Automatic Logout**: App logs out immediately when going to background
2. **Biometric Authentication**: Required on app resume after inactivity
3. **PIN Protection**: All transactions require PIN validation
4. **Attempt Limiting**: PIN attempts are limited with lockout
5. **Proactive Token Refresh**: Automatic refresh 5 minutes before expiry via timer
6. **Fallback Token Refresh**: 401 errors trigger automatic refresh and request retry
7. **Secure Storage**: All sensitive data stored in Expo SecureStore
8. **Store-Based Auth**: No async token calls needed for API requests

## Migration from Old System

1. Replace `AuthContextProvider` with `useAppInitialization` in `_layout.tsx`
2. Update authentication checks to use `authService`
3. Wrap transaction buttons with `TransactionWithPin` component
4. Use `useTransactionSecurity` hook for PIN management

## Best Practices

1. Always wrap sensitive transactions with `TransactionWithPin`
2. Use the provided hooks instead of direct service calls
3. Handle errors gracefully in transaction flows
4. Test PIN creation and validation flows thoroughly
5. Ensure proper cleanup of app state listeners

## Troubleshooting

### Common Issues

1. **PIN not saving**: Check if user is properly authenticated
2. **Token refresh failing**: Verify refresh token endpoint
3. **App not logging out on background**: Check AppState configuration
4. **PIN modal not showing**: Ensure proper state management

### Debug Tips

1. Check console logs for authentication errors
2. Verify token expiration times
3. Test with different app state transitions
4. Monitor PIN attempt counts in store
