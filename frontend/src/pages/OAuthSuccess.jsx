import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const OAuthSuccess = () => {
    const navigate = useNavigate();
    const loadUser = useAuthStore(state => state.loadUser);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token);
            loadUser().then(() => {
                navigate("/dashboard");
            });
        } else {
            loadUser().then(() => {
                navigate("/");
            });
        }
    }, [navigate]);

    return <div>Logging you in...</div>;
};

export default OAuthSuccess;
