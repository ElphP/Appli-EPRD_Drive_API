import { useEffect } from "react";

const useTokenExpiration = () => {
    useEffect(() => {
        const getTokenExpirationTime = (token) => {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map(function (c) {
                        return (
                            "%" +
                            ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                        );
                    })
                    .join("")
            );

            
            const payload = JSON.parse(jsonPayload);
            return payload.exp * 1000;
        };

        const startTokenCountdown = () => {
            const token = localStorage.getItem("token");
            if (token) {
               
                const timeRemaining =
                    getTokenExpirationTime(token) - Date.now();
                if (timeRemaining <= 0) {
                    window.location.href = "/login";
                } else {
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, timeRemaining);
                }
                
            }
        };

        startTokenCountdown();
    }, []);
};

export default useTokenExpiration;
