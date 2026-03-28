import { API_BASE_URL } from '../../src/api/config/ApiConfig';
import StorageHelper from '../../utils/StorageHelper';
import { ENDPOINTS } from "../constants/Endpoints";

const AuthService = {

    // ✅ SEND OTP (FIXED)
    sendOtp: async (payload) => {
        try {
            console.log("Sending OTP payload:", payload);

            const response = await fetch(`${API_BASE_URL}${ENDPOINTS.SEND_OTP}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),   // ✅ FIX — no nesting अब
            });

            const data = await response.json();
            console.log("Send OTP Response:", data);

            if (data.status === "success") {
                return data;
            } else {
                throw new Error(data.message || "Failed to send OTP.");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            throw error;
        }
    },

    // ✅ VERIFY OTP
    verifyOtp: async (phoneNumber, otp) => {
        try {
            console.log("Verifying OTP for phone number:", phoneNumber);

            const response = await fetch(`${API_BASE_URL}${ENDPOINTS.VERIFY_OTP}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone: phoneNumber,
                    otp: otp,
                }),
            });

            const data = await response.json();
            console.log("Verify OTP Response:", data);

            if (data.accessToken) {
                await StorageHelper.setItem("accessToken", data.accessToken);
                return data;
            } else {
                throw new Error(data.message || "Failed to verify OTP.");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            throw error;
        }
    },

    logout: async () => {
        console.log("Logging out...");
        await StorageHelper.removeItem("accessToken");
        console.log("Tokens removed from storage");
    },
};

export default AuthService;
