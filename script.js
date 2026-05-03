document.addEventListener("DOMContentLoaded", () => {
    
    // 1. INITIALIZE THE STARTING VIEW
    // Ensures everyone starts on the Home page when they refresh
    showView('view-home');

    // 2. SCROLL REVEAL ANIMATION
    // Handles things fading in/out as you scroll up and down
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                // Allows items to fade out when scrolled away
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));

    // 3. 3D MOUSE PARALLAX EFFECT
    // Only applies to elements in the active view to save performance
    document.addEventListener("mousemove", (e) => {
        const x = (e.clientX - window.innerWidth / 2) / 30;
        const y = (e.clientY - window.innerHeight / 2) / 30;
        
        document.querySelectorAll('.view.active .parallax-target').forEach(t => {
            t.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
    });

    // 4. MINECRAFT SERVER STATUS (Live Player Counter)
    const statusBox = document.getElementById('server-status');
    if (statusBox) {
        fetch(`https://api.mcsrvstat.us/2/tambayansmp.sg1-mczie.fun:9019`)
            .then(res => res.json())
            .then(data => {
                if (data.online) {
                    statusBox.innerText = `🟢 ${data.players.online} / ${data.players.max} Players Online`;
                } else {
                    statusBox.innerText = "🔴 Server is Offline";
                    statusBox.style.color = "#ff5555";
                }
            })
            .catch(err => {
                console.error("Status fetch failed:", err);
                statusBox.innerText = "Status Unavailable";
            });
    }

    // 5. IP DROPDOWN & CLIPBOARD LOGIC
    const ipBtn = document.getElementById('ip-dropdown-btn');
    const ipList = document.getElementById('ip-dropdown-list');
    const toast = document.getElementById('toast');

    // Toggle Dropdown Menu
    if (ipBtn && ipList) {
        ipBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents immediate closing
            ipList.classList.toggle('show');
        });
    }

    // Handle Clicking an IP Option
    document.querySelectorAll('.ip-option').forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.preventDefault();
            const ip = opt.getAttribute('data-ip');
            
            if (ip) {
                navigator.clipboard.writeText(ip).then(() => {
                    if (toast) {
                        toast.innerText = `Copied to Clipboard: ${ip}`;
                        toast.classList.add('show');
                        setTimeout(() => toast.classList.remove('show'), 2500);
                    }
                });
            }
            if (ipList) ipList.classList.remove('show');
        });
    });

    // Close Dropdown if user clicks anywhere else
    window.addEventListener('click', () => {
        if (ipList) ipList.classList.remove('show');
    });
});

// 6. GLOBAL VIEW SWITCHER FUNCTION
// Needs to be outside the DOMContentLoaded so HTML 'onclick' can find it
function showView(viewId) {
    const allViews = document.querySelectorAll('.view');
    const targetView = document.getElementById(viewId);

    if (targetView) {
        // Hide all current views
        allViews.forEach(v => {
            v.classList.remove('active');
            v.style.display = 'none';
        });

        // Show the target view
        targetView.style.display = 'block';
        
        // Small timeout ensures the CSS transition fires correctly
        setTimeout(() => {
            targetView.classList.add('active');
        }, 10);

        // Instantly scroll back to top so the new view starts at the header
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        console.error("Critical Error: View ID not found ->", viewId);
    }
}