window.onload = function() {
    alert("Welcome to the Personal Textual Shoutout Overlay (PTSO) for Twitch!\nPlease note some functionality is still being developed.");
};

document.addEventListener('DOMContentLoaded', () => {
    // const tabLinks = document.querySelectorAll('.tab-link');
    // const tabContents = document.querySelectorAll('[id$="Tab"]');

    // tabLinks.forEach(link => {
    //     link.addEventListener('click', () => {
    //         const target = link.getAttribute('data-tab');

    //         // Remove active classes from all tabs
    //         tabLinks.forEach(l => l.classList.remove('text-blue-600', 'border-blue-600'));
    //         tabContents.forEach(c => c.classList.add('hidden'));

    //         // Activate selected tab and content
    //         link.classList.add('text-blue-600', 'border-blue-600');
    //         document.getElementById(target).classList.remove('hidden');
    //     });
    // });

  
    const tabLinks = document.querySelectorAll(".tab-link");
    const tabContents = document.querySelectorAll(".tab-content");

    tabLinks.forEach(link => {
        link.addEventListener("click", () => {
            const targetId = link.getAttribute("data-tab");

            // Remove active styles and hide all tab content
            tabLinks.forEach(l => {
            l.classList.remove("text-blue-600", "border-blue-600");
            l.classList.add("text-gray-500", "border-transparent");
            });

            tabContents.forEach(content => {
            content.classList.add("hidden");
            });

            // Add active styles and show selected tab
            const activeTab = document.getElementById(targetId);
            if (activeTab) {
            activeTab.classList.remove("hidden");
            }

            link.classList.add("text-blue-600", "border-blue-600");
            link.classList.remove("text-gray-500", "border-transparent");
        });
    });
});