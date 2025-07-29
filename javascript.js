// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mainContent = document.getElementById('mainContent');
const gameCards = document.querySelectorAll('.game-card');
const navLinks = document.querySelectorAll('.nav-links a');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Sample Game Data (Replace with your actual data source)
const gameData = [
    { name: "Stellar Odyssey", category: "Space" },
    { name: "Cyber Runner", category: "Cyberpunk" },
    { name: "Mystic Realms", category: "Fantasy" },
    { name: "Pixel Warriors", category: "Retro" },
    { name: "Neon Strike", category: "Action" },
    { name: "Quantum Puzzle", category: "Puzzle" },
    { name: "Dragon Quest", category: "RPG" },
    { name: "Space Colony", category: "Strategy" },
    { name: "Cosmic Legends", category: "MMORPG" }
];

// Sidebar functionality
let sidebarCollapsed = false;

// Sidebar toggle functionality
sidebarToggle.addEventListener('click', () => {
    sidebarCollapsed = !sidebarCollapsed;
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');

    // Change icon based on sidebar state
    if (sidebarCollapsed) {
        sidebarToggle.innerHTML = '<i class="fas fa-arrow-right"></i>'; // Show arrow icon
    } else {
        sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>'; // Show bars icon
    }
});

// Search functionality
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredGames = gameData.filter(game => game.name.toLowerCase().includes(searchTerm));

    displaySearchResults(filteredGames);
});

function displaySearchResults(results) {
    searchResults.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        searchResults.innerHTML = '<p>No search results.</p>';
    } else {
        results.forEach(game => {
            const resultElement = document.createElement('p');
            resultElement.textContent = game.name;
            searchResults.appendChild(resultElement);
        });
    }
}

// Navigation link functionality
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));

        // Add active class to clicked link
        link.classList.add('active');

        // Add click animation
        link.style.transform = 'translateX(10px)';
        setTimeout(() => {
            link.style.transform = '';
        }, 200);
    });
});

// Game card interactions
gameCards.forEach(card => {
    const playBtn = card.querySelector('.play-btn');
    const gameImage = card.querySelector('.placeholder-image');

    // Add hover effects
    card.addEventListener('mouseenter', () => {
        // Add pulse effect to play button
        if (playBtn) {
            playBtn.style.animation = 'pulse 1s infinite';
        }

        // Add glow effect to image
        gameImage.style.boxShadow = '0 0 30px rgba(138, 43, 226, 0.5)';
    });

    card.addEventListener('mouseleave', () => {
        // Remove pulse effect
        if (playBtn) {
            playBtn.style.animation = '';
        }

        // Remove glow effect
        gameImage.style.boxShadow = '';
    });

    // Play button click handler
    if (playBtn) {
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const gameName = card.dataset.game;

            // Add click animation
            playBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                playBtn.style.transform = '';
            }, 150);

            // Simulate game launch
            showGameLaunchAnimation(gameName);
        });
    }

    // Card click handler
    card.addEventListener('click', () => {
        const gameName = card.dataset.game;
        showGameInfo(gameName);
    });
});

// Game launch animation
function showGameLaunchAnimation(gameName) {
    // Create loading overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(45deg, rgba(138, 43, 226, 0.9), rgba(75, 0, 130, 0.9));
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.5s ease;
    `;

    const loadingText = document.createElement('h2');
    loadingText.textContent = `Launching ${formatGameName(gameName)}...`;
    loadingText.style.cssText = `
        color: white;
        font-size: 2rem;
        margin-bottom: 30px;
        animation: pulse 1.5s ease-in-out infinite;
    `;

    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 50px;
        height: 50px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top: 3px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;

    overlay.appendChild(loadingText);
    overlay.appendChild(spinner);
    document.body.appendChild(overlay);

    // Fade in overlay
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);

    // Remove overlay after 3 seconds
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 500);
    }, 3000);
}

// Show game info modal
function showGameInfo(gameName) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: linear-gradient(135deg, #1e1e3f, #2a2a5a);
        border-radius: 20px;
        padding: 40px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        border: 1px solid rgba(138, 43, 226, 0.3);
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;

    modalContent.innerHTML = `
        <h2 style="color: white; margin-bottom: 20px; font-size: 2rem;">${formatGameName(gameName)}</h2>
        <p style="color: #b8b8d4; margin-bottom: 30px; line-height: 1.6;">
            Experience the ultimate gaming adventure with stunning graphics,
            immersive gameplay, and endless possibilities. Join millions of players worldwide!
        </p>
        <div style="display: flex; gap: 20px; justify-content: center;">
            <button id="playGameBtn" style="
                background: linear-gradient(45deg, #8a2be2, #4b0082);
                border: none;
                padding: 12px 25px;
                border-radius: 25px;
                color: white;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            ">Play Now</button>
            <button id="closeModalBtn" style="
                background: transparent;
                border: 2px solid #8a2be2;
                padding: 10px 23px;
                border-radius: 25px;
                color: #8a2be2;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            ">Close</button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Fade in modal
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);

    // Close modal handlers
    const closeModal = () => {
        modal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.8)';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    };

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('playGameBtn').addEventListener('click', () => {
        closeModal();
        showGameLaunchAnimation(gameName);
    });
}

// Format game names for display
function formatGameName(gameName) {
    return gameName.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    const pixels = document.querySelectorAll('.pixel');

    if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
    }

    pixels.forEach((pixel, index) => {
        const speed = 0.1 + (index * 0.05);
        pixel.style.transform += ` translateY(${scrolled * speed}px)`;
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.8s ease-out forwards';
            entry.target.style.opacity = '1';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.game-card, .section-title, .spotlight-text').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Button interactions
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px) scale(1.02)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
    });

    button.addEventListener('mousedown', () => {
        button.style.transform = 'translateY(0) scale(0.98)';
    });

    button.addEventListener('mouseup', () => {
        button.style.transform = 'translateY(-2px) scale(1.02)';
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Toggle sidebar with 'S' key
    if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.altKey) {
        sidebarToggle.click();
    }

    // Close modals with Escape key
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('[style*="z-index: 10000"]');
        modals.forEach(modal => {
            if (modal.style.opacity === '1') {
                modal.click();
            }
        });
    }
});

// Mobile responsive handling
function handleResize() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        if (!sidebarCollapsed) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
            sidebarCollapsed = true;
        }

        // Add mobile-specific touch events
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 100;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0 && !sidebarCollapsed) {
                    // Swipe left - close sidebar
                    sidebarToggle.click();
                } else if (diff < 0 && sidebarCollapsed && touchStartX < 50) {
                    // Swipe right from left edge - open sidebar
                    sidebarToggle.click();
                }
            }
        }
    }
}

// Initialize responsive handling
handleResize();
window.addEventListener('resize', handleResize);

// Add loading animation on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Stagger animation of game cards
    gameCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
});

console.log('🎮 InfinitePixels loaded successfully! Press "S" to toggle sidebar.');