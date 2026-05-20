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
                        assistant: "d446be03-dfb6-4de6-b83b-9b904af74829", // Alex Candidate
                        config: {
                            position: "bottom-left",
                            title: "Alex - AI Consultant",
                            subtitle: "Neurova Agencia AI",
                            color: "#2563eb"
                        },
                    });
                }
            }}
        />
    );
}
