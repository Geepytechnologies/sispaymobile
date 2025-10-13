// ToastContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "@/assets/images/app_icon.svg"; // Adjust import based on your SVG setup
import { AntDesign } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");

interface ToastOptions {
  type?: "success" | "error" | "info";
  text1?: string;
  text2?: string;
  onPress?: () => void;
  duration?: number;
}

interface ToastMessageProps extends ToastOptions {
  id?: number;
  onHide: () => void;
  top?: number;
}

interface ToastContextType {
  showMessage: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const ToastMessage: React.FC<ToastMessageProps> = ({
  type = "success",
  text1,
  text2,
  onPress,
  duration,
  onHide,
  top,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }, duration || 4000);

    return () => clearTimeout(timer);
  }, []);

  const getBackgroundColor = (): string => {
    switch (type) {
      case "success":
        return "hsl(154, 72%, 40%)";
      case "error":
        return "#F44336";
      case "info":
        return "#2196F3";
      default:
        return "#031D42";
    }
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: getBackgroundColor(),
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          top: 50,
        },
      ]}
    >
      <View style={styles.content}>
        <Image
          source={require("@/assets/images/app_icon.png")}
          style={styles.icon}
        />

        <View style={styles.textContainer}>
          {text1 && <Text style={styles.text1}>{text1}</Text>}
          {text2 && <Text style={styles.text2}>{text2}</Text>}
        </View>

        <TouchableOpacity onPress={onPress} style={styles.closeButton}>
          <AntDesign name="closecircle" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [message, setMessage] = useState<ToastMessageProps | null>();
  // const [visibleMessages, setVisibleMessages] = useState<ToastMessageProps[]>([
  //   {
  //     id: 1,
  //     type: "success",
  //     text1: "Welcome to Sispay!",
  //     text2: "Your action was completed.",
  //     onHide: () => {},
  //   },
  // ]);

  const showMessage = (options: ToastOptions) => {
    const toast: ToastMessageProps = {
      ...options,
      onHide: () => hideMessage(),
    };
    setMessage(toast);
    // setVisibleMessages((prev) => [...prev, toast]);
  };

  const hideMessage = () => {
    setMessage(null);
  };

  useEffect(() => {
    console.log("Visible Message updated:", message);
  }, [message]);

  return (
    <ToastContext.Provider value={{ showMessage }}>
      <View style={{ flex: 1 }}>
        {children}
        <View style={styles.overlay} pointerEvents="box-none">
          {message && (
            <ToastMessage
              onPress={() => hideMessage()}
              top={50 + 1 * 70}
              onHide={() => {}}
            />
          )}
          {/* {visibleMessages.map((msg, idx) => (
          ))} */}
        </View>
      </View>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // height: 100,
    // backgroundColor: "red",
    zIndex: 9999, // make sure it's above everything
    elevation: 9999, // Android fix
    alignItems: "center",
  },
  toast: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 10,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
    width: 20,
    height: 20,
    resizeMode: "contain",
    borderRadius: 4,
  },
  textContainer: {
    flex: 1,
  },
  text1: {
    color: "white",
    fontSize: 16,
  },
  text2: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
