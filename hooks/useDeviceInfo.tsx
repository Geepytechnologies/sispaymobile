import { useEffect, useState } from "react";
import * as Device from "expo-device";

const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState<{
    deviceId: string;
    manufacturer: string | null;
    model: string | null;
  }>({
    deviceId: "",
    model: "",
    manufacturer: "",
  });

  useEffect(() => {
    const getDeviceInfo = () => {
      const model = Device.modelName;
      const manufacturer = Device.manufacturer;
      const id = `${manufacturer}-${model}`;

      setDeviceInfo({
        deviceId: id,
        model: model,
        manufacturer: manufacturer,
      });
    };

    getDeviceInfo();
  }, []);

  return deviceInfo;
};

export default useDeviceInfo;
