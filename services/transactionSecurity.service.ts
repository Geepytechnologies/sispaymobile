import * as SecureStore from "expo-secure-store";
import authService from "./auth.service";
import { IUserResponse } from "@/interfaces/responses/user.interface";

interface PinValidationResult {
  success: boolean;
  message?: string;
  requiresPinCreation?: boolean;
}

interface TransactionSecurityConfig {
  maxPinAttempts: number;
  pinLockoutDuration: number; // milliseconds
  requirePinForTransactions: boolean;
}

const DEFAULT_CONFIG: TransactionSecurityConfig = {
  maxPinAttempts: 3,
  pinLockoutDuration: 5 * 60 * 1000, // 5 minutes
  requirePinForTransactions: true,
};

class TransactionSecurityService {
  private config: TransactionSecurityConfig = DEFAULT_CONFIG;
  private pinAttempts: Map<string, { count: number; lastAttempt: number }> =
    new Map();

  constructor(config?: Partial<TransactionSecurityConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // PIN Management
  async setUserPin(userId: string, pin: string): Promise<boolean> {
    try {
      // Hash the PIN before storing (in production, use proper hashing)
      const hashedPin = await this.hashPin(pin);
      await SecureStore.setItemAsync(`user_pin_${userId}`, hashedPin);

      // Update user account pin status
      const user = await authService.getCurrentUser();
      if (user) {
        const updatedUser = { ...user, accountPinSet: true };
        await authService.setUser(updatedUser);
      }

      return true;
    } catch (error) {
      console.error("Failed to set user PIN:", error);
      return false;
    }
  }

  async getUserPin(userId: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(`user_pin_${userId}`);
    } catch (error) {
      console.error("Failed to get user PIN:", error);
      return null;
    }
  }

  async hasUserPin(userId: string): Promise<boolean> {
    const pin = await this.getUserPin(userId);
    return pin !== null;
  }

  async clearUserPin(userId: string): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(`user_pin_${userId}`);
      return true;
    } catch (error) {
      console.error("Failed to clear user PIN:", error);
      return false;
    }
  }

  // PIN Validation
  async validatePin(
    userId: string,
    inputPin: string
  ): Promise<PinValidationResult> {
    try {
      // Check if user is locked out
      if (this.isUserLockedOut(userId)) {
        return {
          success: false,
          message:
            "Account temporarily locked due to too many failed attempts. Please try again later.",
        };
      }

      // Check if user has a PIN set
      const hasPin = await this.hasUserPin(userId);
      if (!hasPin) {
        return {
          success: false,
          requiresPinCreation: true,
          message: "No PIN set. Please create a PIN to continue.",
        };
      }

      // Get stored PIN
      const storedPin = await this.getUserPin(userId);
      if (!storedPin) {
        return {
          success: false,
          message: "PIN not found. Please contact support.",
        };
      }

      // Hash input PIN and compare
      const hashedInputPin = await this.hashPin(inputPin);
      const isValid = hashedInputPin === storedPin;

      if (isValid) {
        // Reset attempts on successful validation
        this.pinAttempts.delete(userId);
        return { success: true };
      } else {
        // Record failed attempt
        this.recordFailedAttempt(userId);
        const attempts = this.pinAttempts.get(userId);
        const remainingAttempts =
          this.config.maxPinAttempts - (attempts?.count || 0);

        return {
          success: false,
          message: `Incorrect PIN. ${remainingAttempts} attempts remaining.`,
        };
      }
    } catch (error) {
      console.error("PIN validation error:", error);
      return {
        success: false,
        message: "An error occurred during PIN validation.",
      };
    }
  }

  // Transaction Security
  async requirePinForTransaction(
    userId: string,
    transactionType: string,
    amount?: number
  ): Promise<PinValidationResult> {
    if (!this.config.requirePinForTransactions) {
      return { success: true };
    }

    // Check if user has PIN set
    const hasPin = await this.hasUserPin(userId);
    if (!hasPin) {
      return {
        success: false,
        requiresPinCreation: true,
        message: "Please set up a PIN to make transactions.",
      };
    }

    // For high-value transactions, might want additional security
    if (amount && amount > 10000) {
      // Could add additional security measures here
      console.log(`High-value transaction detected: $${amount}`);
    }

    return { success: true };
  }

  // Security Checks
  private isUserLockedOut(userId: string): boolean {
    const attempts = this.pinAttempts.get(userId);
    if (!attempts) return false;

    const now = Date.now();
    const timeSinceLastAttempt = now - attempts.lastAttempt;

    return (
      attempts.count >= this.config.maxPinAttempts &&
      timeSinceLastAttempt < this.config.pinLockoutDuration
    );
  }

  private recordFailedAttempt(userId: string): void {
    const now = Date.now();
    const attempts = this.pinAttempts.get(userId);

    if (attempts) {
      // Reset if enough time has passed
      if (now - attempts.lastAttempt > this.config.pinLockoutDuration) {
        this.pinAttempts.set(userId, { count: 1, lastAttempt: now });
      } else {
        this.pinAttempts.set(userId, {
          count: attempts.count + 1,
          lastAttempt: now,
        });
      }
    } else {
      this.pinAttempts.set(userId, { count: 1, lastAttempt: now });
    }
  }

  // PIN Hashing (in production, use proper cryptographic hashing)
  private async hashPin(pin: string): Promise<string> {
    // This is a simple example - in production, use proper hashing like bcrypt
    const encoder = new TextEncoder();
    const data = encoder.encode(pin + "sispay_salt"); // Add salt
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Get user's PIN status
  async getUserPinStatus(userId: string): Promise<{
    hasPin: boolean;
    isLocked: boolean;
    attemptsRemaining: number;
  }> {
    const hasPin = await this.hasUserPin(userId);
    const isLocked = this.isUserLockedOut(userId);
    const attempts = this.pinAttempts.get(userId);
    const attemptsRemaining = Math.max(
      0,
      this.config.maxPinAttempts - (attempts?.count || 0)
    );

    return {
      hasPin,
      isLocked,
      attemptsRemaining,
    };
  }

  // Update configuration
  updateConfig(newConfig: Partial<TransactionSecurityConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  // Clear all PIN attempts (for testing or admin purposes)
  clearAllAttempts() {
    this.pinAttempts.clear();
  }
}

export default new TransactionSecurityService();
