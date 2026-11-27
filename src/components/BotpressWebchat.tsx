"use client";

import { useState } from "react";
import Script from "next/script";

const botpressConfigScript =
  "https://files.bpcontent.cloud/2026/11/27/10/20261127100245-Q8RZ7LN6.js";

export function BotpressWebchat() {
  const [injectReady, setInjectReady] = useState(false);

  return (
    <>
      <Script
        id="netpoint-botpress-v37-inject"
        src="https://cdn.botpress.cloud/webchat/v3.7/inject.js"
        strategy="afterInteractive"
        onReady={() => setInjectReady(true)}
      />
      {injectReady && (
        <Script
          id="netpoint-botpress-v37-config"
          src={botpressConfigScript}
          strategy="afterInteractive"
          defer
        />
      )}
    </>
  );
}
