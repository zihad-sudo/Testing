// ==UserScript==
// @name         New Web Banai
// @namespace    https://mediabanaitgbot.onrender.com/
// @version      2025-12-09
// @description  try to take over the world!
// @author       You
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScE8INBU7OwZrsEoEEUbBRq3olJXMFYn6eiqIbVHjhvKHzIQRbsRDGIlR5&s=10
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // ================= CONFIGURATION =================
    // 🔴 REPLACE THESE WITH YOUR RENDER DETAILS
    const BOT_URL = "https://mediabanaitgbot.onrender.com/";
    const SECRET = "7936925985";
    // =================================================

    console.log("🚀 Media Banai: Script Loaded");

    // 1. Function to send data to your Bot
    function sendWebhook(tweetUrl) {
        console.log("❤️ Like Detected! Sending:", tweetUrl);

        // We use GM_xmlhttpRequest to bypass security restrictions
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://mediabanaitgbot.onrender.com/api/trigger?secret=7936925985&url=${tweetUrl}`,
            onload: function(response) {
                console.log("✅ Bot Response:", response.responseText);
            },
            onerror: function(err) {
                console.error("❌ Webhook Failed:", err);
            }
        });
    }

    // 2. Function to find the accurate Tweet URL
    function getTweetUrl(likeButton) {
        // Try to find the closest "Article" container
        const article = likeButton.closest('article');
        if (!article) return window.location.href; // Fallback to current page

        // Find the "Time" element (it always holds the permanent link)
        const timeElement = article.querySelector('time');
        if (timeElement) {
            const link = timeElement.closest('a');
            if (link) return link.href;
        }

        return window.location.href;
    }

    // 3. Main Event Listener (Watches for Clicks)
    document.addEventListener('click', function(e) {
        // Check if the clicked item is a "Like" heart
        // Twitter uses data-testid="like" for the unliked heart
        const likeBtn = e.target.closest('[data-testid="bookmark"]');

        if (likeBtn) {
            const url = getTweetUrl(likeBtn);

            // --- VISUAL FEEDBACK (Fixed Line 70 Error) ---
            // We added { } so it doesn't return the assignment
            likeBtn.style.backgroundColor = "rgba(0, 255, 0, 0.3)";

            setTimeout(() => {
                likeBtn.style.backgroundColor = "transparent";
            }, 500);
            // ---------------------------------------------

            // Send to Bot
            sendWebhook(url);
        }
    }, true);
})();