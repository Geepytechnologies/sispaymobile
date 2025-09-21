import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useUserStore } from "@/config/store";
import authService from "@/services/auth.service";
import { jwtDecode } from "jwt-decode";

const TokenRefreshTest = () => {
  const { user } = useUserStore();
  const [tokenInfo, setTokenInfo] = useState<{
    expiresAt: string;
    timeUntilExpiry: number;
    isExpiringSoon: boolean;
  } | null>(null);

  useEffect(() => {
    if (user?.accessToken) {
      updateTokenInfo();
      // Update token info every 10 seconds
      const interval = setInterval(updateTokenInfo, 10000);
      return () => clearInterval(interval);
    }
  }, [user?.accessToken]);

  const updateTokenInfo = () => {
    if (!user?.accessToken) return;

    try {
      const decoded = jwtDecode(user.accessToken);
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = (decoded.exp || 0) - currentTime;
      const expiresAt = new Date((decoded.exp || 0) * 1000).toLocaleString();
      const isExpiringSoon = timeUntilExpiry < 300; // 5 minutes

      setTokenInfo({
        expiresAt,
        timeUntilExpiry: Math.max(0, timeUntilExpiry),
        isExpiringSoon,
      });
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  };

  const handleManualRefresh = async () => {
    try {
      const refreshed = await authService.refreshTokenIfNeeded();
      if (refreshed) {
        console.log("Manual token refresh successful");
        updateTokenInfo();
      } else {
        console.log("Token refresh not needed");
      }
    } catch (error) {
      console.error("Manual refresh failed:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Token Refresh Test</Text>

      {user?.accessToken ? (
        <View style={styles.tokenInfo}>
          <Text style={styles.label}>Token Status:</Text>
          <Text style={styles.value}>✅ Available</Text>

          {tokenInfo && (
            <>
              <Text style={styles.label}>Expires At:</Text>
              <Text style={styles.value}>{tokenInfo.expiresAt}</Text>

              <Text style={styles.label}>Time Until Expiry:</Text>
              <Text
                style={[
                  styles.value,
                  tokenInfo.isExpiringSoon && styles.warning,
                ]}
              >
                {formatTime(tokenInfo.timeUntilExpiry)}
              </Text>

              {tokenInfo.isExpiringSoon && (
                <Text style={styles.warningText}>
                  ⚠️ Token will refresh automatically in 5 minutes
                </Text>
              )}
            </>
          )}
        </View>
      ) : (
        <Text style={styles.noToken}>No token available</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleManualRefresh}>
        <Text style={styles.buttonText}>Test Manual Refresh</Text>
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.infoTitle}>How it works:</Text>
        <Text style={styles.infoText}>
          • Token refresh timer is set up automatically when user logs in
        </Text>
        <Text style={styles.infoText}>
          • Timer refreshes token 5 minutes before expiry
        </Text>
        <Text style={styles.infoText}>
          • 401 errors trigger fallback refresh (should rarely happen)
        </Text>
        <Text style={styles.infoText}>
          • All API calls use tokens from store (no async calls)
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  tokenInfo: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  warning: {
    color: "#ff6b6b",
    fontWeight: "bold",
  },
  warningText: {
    color: "#ff6b6b",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
  },
  noToken: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  info: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1976d2",
  },
  infoText: {
    fontSize: 14,
    color: "#1976d2",
    marginBottom: 5,
  },
});

export default TokenRefreshTest;
