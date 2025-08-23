import { API_BASE_URL } from '../../src/api/config/ApiConfig';

import StorageHelper from '../../utils/StorageHelper';
import { ENDPOINTS } from "../constants/Endpoints";

// console.log(ENDPOINTS); 
// console.log("API_BASE_URL:============== ", API_BASE_URL);  
const AuthService = {
    // Send OTP to the provided phone number
    sendOtp: async (phone) => {
        try {
            console.log("Sending OTP for phone number: ", phone);

            const response = await fetch(`${API_BASE_URL}${ENDPOINTS.SEND_OTP}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });

            const data = await response.json();
            console.log("Send OTP Response: ", data);

            if (data.status === "success") {
                return data;  // Success message or any relevant info from the API
            } else {
                throw new Error(data.message || "Failed to send OTP.");
            }
        } catch (error) {
            console.error("Error sending OTP: ", error);
            throw error;
        }
    },

    // Verify the OTP sent to the phone number
    verifyOtp: async (phoneNumber, otp) => {
        try {
            console.log("Verifying OTP for phone number: ", phone);

            const response = await fetch(`${API_BASE_URL}${ENDPOINTS.VERIFY_OTP}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, otp }),
            });

            const data = await response.json();
            console.log("Verify OTP Response: ", data);

            if (data.accessToken) {
                // Save the access token if verification is successful
                await StorageHelper.setItem("accessToken", data.accessToken);
                return data;  // Return data (access token and user info)
            } else {
                throw new Error(data.message || "Failed to verify OTP.");
            }
        } catch (error) {
            console.error("Error verifying OTP: ", error);
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
