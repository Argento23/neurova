"use client";

import Script from "next/script";

export default function VapiWidget() {
    return (
        <Script
            src="https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js"
            strategy="afterInteractive"
            onLoad={() => {
                // @ts-ignore
                if (window.vapiSDK) {
                    // @ts-ignore
                    window.vapiSDK.run({
                        apiKey: "3fe2e389-3dc5-4071-bfb5-c91a511af385",
                        assistant: "c500ab0f-ea72-47fd-b66f-e2caf54a0ebf", // Stefan New New
                        config: {
                            position: "bottom-right",
                            title: "Stefan - AI Concierge",
                            subtitle: "Austria Turismo 4.0",
                            color: "#ed2939"
                        },
                    });
                }
            }}
        />
    );
}
