import * as Device from "expo-device";
import * as Crypto from "expo-crypto";

export async function getDeviceFingerprint() {
  const info = `${Device.deviceName}-${Device.osBuildId}-${Device.modelName}-${Device.osVersion}`;

  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    info
  );

  return hash;
}
