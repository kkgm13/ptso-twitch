window.onload = function() {
    alert("Welcome to the Personal Textual Shoutout Overlay (PTSO) for Twitch!\nPlease note some functionality is still being developed.");
};

document.addEventListener('DOMContentLoaded', () => {  
    lucide.createIcons();

    const tabLinks = document.querySelectorAll(".tab-link");
    const tabContents = document.querySelectorAll(".tab-content");

    tabLinks.forEach(link => {
        link.addEventListener("click", () => {
            const targetId = link.getAttribute("data-tab");

            tabLinks.forEach(l => {
                l.classList.remove("text-blue-600", "border-blue-600");
                l.classList.add("text-gray-500", "border-transparent");
            });

            tabContents.forEach(content => {
                content.classList.add("hidden");
            });

            const activeTab = document.getElementById(targetId);
            if (activeTab) {
                activeTab.classList.remove("hidden");
            }

            link.classList.add("text-blue-600", "border-blue-600");
            link.classList.remove("text-gray-500", "border-transparent");
        });
    });
});