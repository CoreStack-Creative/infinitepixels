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
   { name: "1v1 Lol", link: "/game.html?game=1v1lol" },
   { name: "3D Formula Racing", link: "/game.html?game=3dformularacing" },
   { name: "Basket Random", link: "/game.html?game=basketrandom" },
   { name: "Cookie Clicker", link: "/game.html?game=cookieclicker" },
   { name: "Cube Arena 2048", link: "/game.html?game=cubearena2048" },
   { name: "Draw Climber", link: "/game.html?game=drawclimber" },
   { name: "Fruit Merge", link: "/game.html?game=fruitmerge" },
   { name: "Helix Jump", link: "/game.html?game=helixjump" },
   { name: "Masked Special Forces", link: "/game.html?game=maskedspecialforces" },
   { name: "Paper Io", link: "/game.html?game=paperio" },
   { name: "Parkour Block 3D", link: "/game.html?game=parkourblock3d" },
   { name: "Poly Track", link: "/game.html?game=polytrack" },
   { name: "Rodeo Stampede", link: "/game.html?game=rodeostampede" },
   { name: "Spiral Roll", link: "/game.html?game=spiralroll" },
   { name: "Subway Surfers", link: "/game.html?game=subwaysurfers" },
   { name: "Tiny Fishing", link: "/game.html?game=tinyfishing" },
   { name: "Bloxd io", link: "/game.html?game=bloxdio" },
   { name: "Moto X3M", link: "/game.html?game=motox3m" },
   { name: "Tall Man Run", link: "/game.html?game=tallmanrun" },
   { name: "Happy Wheels", link: "/game.html?game=happywheels" },
   { name: "Madalin Stunt Cars Pro", link: "/game.html?game=madalinstuntcarspro" },
   { name: "Fall Cars: Hexagon", link: "/game.html?game=fallcarshexagon" },
   { name: "Fruit Ninja", link: "/game.html?game=fruitninja" },
   { name: "Ball 2048", link: "/game.html?game=ball2048" },
   { name: "Ice Fishing", link: "/game.html?game=icefishing" },
   { name: "Stick Fighter", link: "/game.html?game=stickfighter" },
   { name: "Papas Burgeria", link: "/game.html?game=papasburgeria" },
   { name: "Bullet Army Run", link: "/game.html?game=bulletarmyrun" },
   { name: "Survival Race", link: "/game.html?game=survivalrace" },
   { name: "Block Stack 3D", link: "/game.html?game=blockstack3d" },
   { name: "Rocket Bikes Highway Race", link: "/game.html?game=rocketbikeshighwayrace" },
   { name: "Offroad Cycle 3D", link: "/game.html?game=offroadcycle3d" },
   { name: "Funny Shooter 2", link: "/game.html?game=funnyshooter2" },
   { name: "Draw the Car Path", link: "/game.html?game=drawthecarpath" },
   { name: "Ninja Arashi", link: "/game.html?game=ninjaarashi" },
   { name: "Shell Shockers", link: "/game.html?game=shellschockers" },
   { name: "Smash Karts", link: "/game.html?game=smashkarts" },
   { name: "Ships 3D", link: "/game.html?game=ships3d" },
   { name: "Goober Dash", link: "/game.html?game=gooberdash" },
   { name: "Golf Clash", link: "/game.html?game=golfclash" }, 
   { name: "Similing Glass", link: "/game.html?game=similingglass" },
   { name: "Crowdy City IO", link: "/game.html?game=crowdycityio" }, 
   { name: "Archery King 3D", link: "/game.html?game=archeryking3d" },
   { name: "Scooter Touchgrind", link: "/game.html?game=scootertouchgrind" },
   { name: "Dunk Shot", link: "/game.html?game=dunkshot" },
   { name: "Uno Online", link: "/game.html?game=unoonline" },
   { name: "Snowball IO", link: "/game.html?game=snowballio" },
   { name: "Realistic Lion Hunting", link: "/game.html?game=realisticlionhunting" },
   { name: "Iron Legion", link: "/game.html?game=ironlegion" },
   { name: "Narrow One", link: "/game.html?game=narrowone" },
   { name: "Hole IO", link: "/game.html?game=holeio" },
   { name: "Only Up! Parkour", link: "/game.html?game=onlyup!parkour" },
   { name: "Bit Life", link: "/game.html?game=bitlife" },
   { name: "Gulper IO", link: "/game.html?game=gulperio" },
   { name: "Moto X3M Winter", link: "/game.html?game=motox3mwinter" },
   { name: "Rocket Bot Royale", link: "/game.html?game=rocketbotroyale" },
   { name: "Rocket League", link: "/game.html?game=rocketleague" },
   { name: "Slope 3", link: "/game.html?game=slope3" },
   { name: "Stair Race 3D", link: "/game.html?game=stairrace3d" },
   { name: "Rise Up", link: "/game.html?game=riseup" },  
   { name: "Mr Racer", link: "/game.html?game=mrracer" }, 
   { name: "Stick Duel Battle", link: "/game.html?game=stickduelbattle" },  
   { name: "Gansta Duel", link: "/game.html?game=Gansta Duel" },  
   { name: "Power Slap", link: "/game.html?game=powerslap" },  
   { name: "Rise Up", link: "/game.html?game=riseup" },  
   { name: "Archer Hero", link: "/game.html?game=archerhero" }, 
   { name: "Jelly Run 2048", link: "/game.html?game=jellyrun2048" },  
   { name: "Winter Clash 3D", link: "/game.html?game=winterclash3d" }, 
   { name: "Stickman Sniper", link: "/game.html?game=stickmansniper" },   
   { name: "American 18 Wheeler Sim", link: "/game.html?game=american18wheelersim" },  
   { name: "Billard 8Ball Pool", link: "/game.html?game=billard8ballpool" },
   { name: "Flip Master", link: "/game.html?game=flipmaster" },
   { name: "Curvy Punch 2", link: "/game.html?game=curvypunch2" },
   { name: "Rider Online Pro", link: "/game.html?game=rideronlinepro" },
   { name: "Sniper Simulator", link: "/game.html?game=snipersimulator" },
   { name: "Momo Horror Story", link: "/game.html?game=momohorrorstory" },
   { name: "Boat Rescue", link: "/game.html?game=boatrescue" }, 
   { name: "Bus Simulator", link: "/game.html?game=snipersimulator" },
   { name: "Stickman Online", link: "/game.html?game=momohorrorstory" },
   { name: "Bird Simulator", link: "/game.html?game=Bird Simulator" },
   { name: "Nightwalkers IO", link: "/game.html?game=nightwalkersio" }, 
   { name: "Zombie Escape", link: "/game.html?game=zombieescape" }, 
   { name: "Escape Your Birthday", link: "/game.html?game=escapeyourbirthday" }, 
   { name: "Night Racer", link: "/game.html?game=nightracer" }, 
   { name: "Mirage Online Clasic", link: "/game.html?game=mirageonlineclasic" },
   { name: "Gang Fall Party", link: "/game.html?game=gangfallparty" },
   { name: "Trial Bike Racing Clash", link: "/game.html?game=trialbikeracingclash" },
   { name: "Stickman Sports Badminton", link: "/game.html?game=stickmansportsbadminton" },
   { name: "Command Strike FPS", link: "/game.html?game=commandstrikefps" },
   { name: "Zombie Survival 2", link: "/game.html?game=zombiesurvival2" },
   { name: "Silent Fear", link: "/game.html?game=silentfear" },
   { name: "Save the Dummy", link: "/game.html?game=savethedummy" },
   { name: "Slowroads IO", link: "/game.html?game=slowroadsio" },
   { name: "Slope", link: "/game.html?game=slope" },
   { name: "Snow Rider 3D", link: "/game.html?game=snowrider3d" },
   { name: "Retro Bowl", link: "/game.html?game=retrobowl" },
   { name: "Basketball Line", link: "/game.html?game=basketballline" },
   { name: "Pop the Bubble", link: "/game.html?game=popthebubble" }, 
   { name: "Classic Car Parking", link: "/game.html?game=classiccarparking" }

];


// Sidebar functionality
let sidebarCollapsed = false;


// DOM references for Paper.io simulation
const gameCanvas = document.getElementById('gameCanvas');
const gameContainer = document.getElementById('gameContainer');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const gameControlBar = document.getElementById('gameControlBar');
const collapseArrow = document.getElementById('collapseArrow'); 
const shareBtn = document.getElementById('shareBtn');
const shareModal = document.getElementById('shareModal');
const closeModal = document.getElementById('closeModal');
const copyBtn = document.getElementById('copyBtn');
const shareLink = document.getElementById('shareLink');
const shareMessage = document.getElementById('shareMessage');
const gameItems = document.querySelectorAll('.game-item');


let isFullscreen = false;
let barCollapsed = false;


// Initialize Paper.io game simulation
function initializeGame() {
   const canvas = gameCanvas;
  
   // Add null check to prevent errors
   if (!canvas) {
       console.log('Canvas not found, skipping game initialization');
       return;
   }
  
   const ctx = canvas.getContext('2d');
  
   // Set canvas size
   canvas.width = 800;
   canvas.height = 600;
  
   // Game state
   let player = {
       x: canvas.width / 2,
       y: canvas.height / 2,
       trail: [],
       territory: [],
       color: '#8a2be2'
   };
  
   let particles = [];
   let gameRunning = true;
  
   // Create background particles
   for (let i = 0; i < 50; i++) {
       particles.push({
           x: Math.random() * canvas.width,
           y: Math.random() * canvas.height,
           size: Math.random() * 3 + 1,
           speed: Math.random() * 0.5 + 0.1,
           opacity: Math.random() * 0.5 + 0.2
       });
   }
  
   // Game loop
   function gameLoop() {
       // Clear canvas
       ctx.fillStyle = 'rgba(26, 26, 62, 0.1)';
       ctx.fillRect(0, 0, canvas.width, canvas.height);
      
       // Draw background particles
       particles.forEach(particle => {
           ctx.fillStyle = `rgba(138, 43, 226, ${particle.opacity})`;
           ctx.beginPath();
           ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
           ctx.fill();
          
           particle.y += particle.speed;
           if (particle.y > canvas.height) {
               particle.y = -10;
               particle.x = Math.random() * canvas.width;
           }
       });
      
       // Draw game title
       ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
       ctx.font = 'bold 48px Arial';
       ctx.textAlign = 'center';
       ctx.fillText('Paper.io', canvas.width / 2, canvas.height / 2 - 50);
      
       ctx.fillStyle = 'rgba(184, 184, 212, 0.8)';
       ctx.font = '20px Arial';
       ctx.fillText('Click to start playing!', canvas.width / 2, canvas.height / 2 + 20);
      
       // Draw animated border
       const time = Date.now() * 0.005;
       ctx.strokeStyle = `hsl(${270 + Math.sin(time) * 30}, 70%, 60%)`;
       ctx.lineWidth = 3;
       ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      
       if (gameRunning) {
           requestAnimationFrame(gameLoop);
       }
   }
  
   // Start game loop
   gameLoop();
  
   // Canvas click handler
   canvas.addEventListener('click', () => {
       // Simulate game start
       ctx.fillStyle = 'rgba(26, 26, 62, 0.9)';
       ctx.fillRect(0, 0, canvas.width, canvas.height);
      
       ctx.fillStyle = '#ffffff';
       ctx.font = 'bold 32px Arial';
       ctx.textAlign = 'center';
       ctx.fillText('Game Starting...', canvas.width / 2, canvas.height / 2);
      
       setTimeout(() => {
           gameLoop();
       }, 2000);
   });
}


// Sidebar toggle functionality
if (sidebarToggle) {
   sidebarToggle.addEventListener('click', () => {
       sidebarCollapsed = !sidebarCollapsed;
       if (sidebar) sidebar.classList.toggle('collapsed');
       if (mainContent) mainContent.classList.toggle('expanded');
       
       // ADD THESE LINES: Toggle expanded class for news page elements
       const newsMainContent = document.querySelector('.news-page-container .news-main-content');
       const newsFooter = document.querySelector('.news-page-container .site-footer');
       
       if (newsMainContent) newsMainContent.classList.toggle('expanded');
       if (newsFooter) newsFooter.classList.toggle('expanded');
       
       mobileSidebarOverlayHandler();

       // Selected when menu is open, unselected when closed
       if (!sidebarCollapsed) {
           sidebarToggle.classList.add('selected'); // Selected when open
       } else {
           sidebarToggle.classList.remove('selected'); // Unselected when closed
       }
       sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>'; // Always show bars icon
   });
}


// --- Mobile sidebar overlay and toggle logic ---
function mobileSidebarOverlayHandler() {
   if (window.innerWidth <= 900) {
       if (!sidebarCollapsed) {
           document.body.classList.add('sidebar-open');
       } else {
           document.body.classList.remove('sidebar-open');
       }
   } else {
       document.body.classList.remove('sidebar-open');
   }
}


window.addEventListener('resize', () => {
   handleResize();
   mobileSidebarOverlayHandler();
});



document.addEventListener('DOMContentLoaded', () => {
   // Initialize game only if canvas exists
   if (gameCanvas) {
       initializeGame();
   } else {
       console.log('Game canvas not found, skipping game initialization');
   }
  
   // Handle initial responsive state
   handleResize();
  
   // Add load animation
   document.body.style.opacity = '0';
   document.body.style.transition = 'opacity 0.5s ease';
  
   setTimeout(() => {
       document.body.style.opacity = '1';
   }, 100);
  
   // Stagger animation of game items
   gameItems.forEach((item, index) => {
       item.style.opacity = '0';
       item.style.transform = 'translateX(-20px)';
       item.style.transition = 'all 0.6s ease';
      
       setTimeout(() => {
           item.style.opacity = '1';
           item.style.transform = 'translateX(0)';
       }, 300 + (index * 100));
   });
   mobileSidebarOverlayHandler();
});


// Close sidebar when clicking overlay on mobile
document.addEventListener('click', function(e) {
   if (
       window.innerWidth <= 900 &&
       document.body.classList.contains('sidebar-open') &&
       sidebar && !sidebar.contains(e.target) &&
       sidebarToggle && !sidebarToggle.contains(e.target)
   ) {
       sidebarCollapsed = true;
       sidebar.classList.add('collapsed');
       if (mainContent) mainContent.classList.remove('expanded');
       document.body.classList.remove('sidebar-open');
   }
}, true);


// Enhanced Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchIconBtn = document.getElementById('searchIconBtn');
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchWrapper = document.querySelector('.search-wrapper');

    // Open search box
    function openSearch() {
        searchWrapper.classList.add('search-active');
        searchBox.classList.add('active');
        // Small delay to ensure animation starts, then focus input
        setTimeout(() => {
            searchInput.focus();
        }, 300);
    }

    // Close search box
    function closeSearch() {
        searchWrapper.classList.remove('search-active');
        searchBox.classList.remove('active');
        searchInput.value = '';
        searchResults.classList.remove('active');
        searchInput.blur();
    }

    // Event listeners
    searchIconBtn.addEventListener('click', openSearch);

    // Close search when clicking outside
    document.addEventListener('click', function(event) {
        if (!searchWrapper.contains(event.target) && !searchResults.contains(event.target)) {
            closeSearch();
        }
    });

    // Prevent closing when clicking inside search box
    searchBox.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // Handle escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeSearch();
        }
    });

    // Your existing search functionality integrated
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();

            if (searchTerm.trim() === '') {
                // Hide results if input is empty
                if (searchResults) {
                    searchResults.classList.remove('active');
                    searchResults.innerHTML = '';
                }
                return;
            }

            const filteredGames = gameData.filter(game =>
                game.name.toLowerCase().includes(searchTerm)
            );

            displaySearchResults(filteredGames);
        });
    }

    function displaySearchResults(results) {
        if (!searchResults) return;

        searchResults.innerHTML = ''; // Clear previous results

        if (results.length === 0) {
            // Show "No results found" message
            searchResults.innerHTML = '<p class="no-results">No results found.</p>';
            searchResults.classList.add('active');
        } else {
            // Display results
            results.forEach(game => {
                const resultElement = document.createElement('p');
                resultElement.textContent = game.name;
                resultElement.style.cursor = 'pointer';
                resultElement.addEventListener('click', () => {
                    if (game.link) {
                        let destination = game.link;

                        // If link is relative (starts with "/"), prepend domain
                        if (destination.startsWith('/')) {
                            destination = 'https://www.infinite-pixels.com' + destination;
                        }

                        window.location.href = destination;
                    }

                    searchResults.classList.remove('active');
                    searchInput.value = '';
                    closeSearch(); // Close the search box after selection
                });
                searchResults.appendChild(resultElement);
            });

            searchResults.classList.add('active');
        }
    }

    // Enhanced search button functionality
    // Search triggers automatically on input, no separate search button needed
});


// Fullscreen functionality - Native browser fullscreen on game container


if (fullscreenBtn) {
   fullscreenBtn.addEventListener('click', toggleFullscreen);
} else {
   console.log('Fullscreen button not found');
}

let exitNotification = null;

function toggleFullscreen() {
   if (!gameContainer || !fullscreenBtn) {
       console.log('Required elements for fullscreen not found');
       return;
   }
   
   if (!document.fullscreenElement) {
       enterNativeFullscreen();
   } else {
       exitNativeFullscreen();
   }
}

async function enterNativeFullscreen() {
   try {
       // Request fullscreen directly on the game container
       const element = gameContainer;
       
       if (element.requestFullscreen) {
           await element.requestFullscreen();
       } else if (element.mozRequestFullScreen) {
           await element.mozRequestFullScreen();
       } else if (element.webkitRequestFullscreen) {
           await element.webkitRequestFullscreen();
       } else if (element.msRequestFullscreen) {
           await element.msRequestFullscreen();
       }
       
   } catch (error) {
       console.error('Error entering fullscreen:', error);
   }
}

function exitNativeFullscreen() {
   if (document.exitFullscreen) {
       document.exitFullscreen();
   } else if (document.mozCancelFullScreen) {
       document.mozCancelFullScreen();
   } else if (document.webkitExitFullscreen) {
       document.webkitExitFullscreen();
   } else if (document.msExitFullscreen) {
       document.msExitFullscreen();
   }
}

function showExitNotification() {
   // Remove existing notification if any
   removeExitNotification();
   
   // Create the exit notification
   exitNotification = document.createElement('div');
   exitNotification.style.cssText = `
       position: fixed;
       top: 50%;
       left: 50%;
       transform: translateX(-50%) translateY(-50%);
       background: rgba(0, 0, 0, 0.8);
       color: white;
       padding: 8px 16px;
       border-radius: 4px;
       font-size: 14px;
       font-family: Arial, sans-serif;
       z-index: 10001;
       pointer-events: none;
       opacity: 0;
       transition: opacity 0.3s ease;
   `;
   exitNotification.textContent = `${window.location.hostname} — To exit full screen, press esc`;
   
   // Add to document
   document.body.appendChild(exitNotification);
   
   // Show notification briefly
   setTimeout(() => {
       if (exitNotification) {
           exitNotification.style.opacity = '1';
       }
   }, 100);
   
   setTimeout(() => {
       if (exitNotification) {
           exitNotification.style.opacity = '0';
       }
   }, 3000);
}

function removeExitNotification() {
   if (exitNotification && document.body.contains(exitNotification)) {
       document.body.removeChild(exitNotification);
       exitNotification = null;
   }
}

// Listen for fullscreen change events
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
   if (document.fullscreenElement || 
       document.webkitFullscreenElement || 
       document.mozFullScreenElement || 
       document.msFullscreenElement) {
       // Entered fullscreen
       isFullscreen = true;
       fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i><span>Exit Fullscreen</span>';
       
       // Add CSS to make the game fill the fullscreen container
       const gameFrame = document.getElementById('gameFrame');
       if (gameFrame) {
           gameFrame.style.width = '100%';
           gameFrame.style.height = '100vh';
       }
       
       // Hide other elements in the container during fullscreen
       const controlBar = document.getElementById('gameControlBar');
       const collapseArrow = document.getElementById('collapseArrow');
       
       if (controlBar) controlBar.style.display = 'none';
       if (collapseArrow) collapseArrow.style.display = 'none';
       
       // Show exit notification
       showExitNotification();
       
   } else {
       // Exited fullscreen
       isFullscreen = false;
       fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i><span>Fullscreen</span>';
       
       // Restore original game styles
       const gameFrame = document.getElementById('gameFrame');
       if (gameFrame) {
           gameFrame.style.width = '100%';
           gameFrame.style.height = '600px';
       }
       
       // Show other elements again
       const controlBar = document.getElementById('gameControlBar');
       const collapseArrow = document.getElementById('collapseArrow');
       
       if (controlBar) controlBar.style.display = '';
       if (collapseArrow) collapseArrow.style.display = '';
       
       // Remove exit notification
       removeExitNotification();
   }
}

// Show fullscreen exit message (keeping your original function for compatibility)
function showFullscreenMessage() {
   showExitNotification();
}

function removeFullscreenMessage() {
   removeExitNotification();
}

// Collapse arrow functionality (simplified for native fullscreen)
if (collapseArrow) {
   collapseArrow.addEventListener('click', () => {
       barCollapsed = !barCollapsed;

       if (gameControlBar) {
           if (barCollapsed) {
               gameControlBar.classList.add('collapsed');
               collapseArrow.classList.add('rotated');
           } else {
               gameControlBar.classList.remove('collapsed');
               collapseArrow.classList.remove('rotated');
           }
       }
   });
}

// Enhanced window resize handler
function handleResize() {
   const isMobile = window.innerWidth <= 768;

   if (isMobile && !sidebarCollapsed && sidebar && mainContent && sidebarToggle) {
       sidebar.classList.add('collapsed');
       mainContent.classList.add('expanded');
       sidebarCollapsed = true;
       sidebarToggle.classList.remove('selected');
   }

   // No special handling needed for native fullscreen
   if (!isFullscreen && gameContainer && gameCanvas) {
       const container = gameContainer.getBoundingClientRect();
       if (container.width > 0) {
           gameCanvas.style.width = '100%';
           gameCanvas.style.height = 'auto';
       }
   }
}

// Make sure resize handler is properly attached
window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', () => {
   setTimeout(handleResize, 100);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
   // Toggle sidebar with 'S' key
   if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.altKey &&
       document.activeElement !== searchInput) {
       if (sidebarToggle) sidebarToggle.click();
   }

   // Toggle fullscreen with 'F' key
   if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.altKey &&
       document.activeElement !== searchInput) {
       if (fullscreenBtn) fullscreenBtn.click();
   }

   // Close modals with Escape key
   if (e.key === 'Escape') {
       if (shareModal && shareModal.classList.contains('active')) {
           shareModal.classList.remove('active');
       }
       // Exit fullscreen if active
       if (document.fullscreenElement) {
           exitNativeFullscreen();
       }
      
       // Close video modal if active
       const videoModal = document.getElementById('videoModal');
       if (videoModal && videoModal.classList.contains('active')) {
           closeVideoModal();
       }
   }
});


// Share functionality
if (shareBtn) {
   shareBtn.addEventListener('click', () => {
       if (shareModal) shareModal.classList.add('active');
   });
}


if (closeModal) {
   closeModal.addEventListener('click', () => {
       if (shareModal) shareModal.classList.remove('active');
   });
}


if (shareModal) {
   shareModal.addEventListener('click', (e) => {
       if (e.target === shareModal) {
           shareModal.classList.remove('active');
       }
   });
}


if (copyBtn) {
   copyBtn.addEventListener('click', () => {
       if (shareLink) shareLink.select();
       if (shareLink) shareLink.setSelectionRange(0, 99999);
      
       try {
           document.execCommand('copy');
           if (shareMessage) shareMessage.classList.add('show');
           copyBtn.textContent = 'Copied!';
          
           setTimeout(() => {
               if (shareMessage) shareMessage.classList.remove('show');
               copyBtn.textContent = 'Copy';
           }, 2000);
       } catch (err) {
           console.error('Copy failed:', err);
       }
   });
}


// Navigation link functionality
navLinks.forEach(link => {
   link.addEventListener('click', (e) => {
       // Only animate if href is "#" or missing, otherwise let browser navigate
       const href = link.getAttribute('href');
       if (!href || href === '#') {
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
       }
       // If href is present and not "#", let browser handle navigation
   });
});


// Game item interactions
gameItems.forEach(item => {
   item.addEventListener('click', () => {
       const gameName = item.dataset.game;
       // Try to navigate to the corresponding game page if it exists
       let page = '';
       switch (gameName) {
           case 'slither-io': page = 'slither-io.html'; break;
           case 'agar-io': page = 'agar-io.html'; break;
           case 'hole-io': page = 'hole-io.html'; break;
           case 'wings-io': page = 'wings-io.html'; break;
           case 'zombs-io': page = 'zombs-io.html'; break;
           default: page = '';
       }
       if (page) {
           window.location.href = page;
           return;
       }


       // If no page, just animate
       item.style.transform = 'translateX(10px) scale(0.98)';
       setTimeout(() => {
           item.style.transform = '';
       }, 200);


       // Simulate game navigation
       showGameTransition(gameName);
   });
  
   // Hover effects
   item.addEventListener('mouseenter', () => {
       item.style.backgroundColor = 'rgba(138, 43, 226, 0.15)';
   });
  
   item.addEventListener('mouseleave', () => {
       item.style.backgroundColor = '';
   });
});


// Game transition animation
function showGameTransition(gameName) {
   const overlay = document.createElement('div');
   overlay.style.cssText = `
       position: fixed;
       top: 0;
       left: 0;
       width: 100vw;
       height: 100vh;
       background: linear-gradient(45deg, rgba(138, 43, 226, 0.95), rgba(75, 0, 130, 0.95));
       display: flex;
       flex-direction: column;
       align-items: center;
       justify-content: center;
       z-index: 10001;
       opacity: 0;
       transition: opacity 0.4s ease;
   `;


   const loadingText = document.createElement('h2');
   loadingText.textContent = `Loading ${formatGameName(gameName)}...`;
   loadingText.style.cssText = `
       color: white;
       font-size: 2.5rem;
       margin-bottom: 30px;
       animation: pulse 1.5s ease-in-out infinite;
   `;


   const progressBar = document.createElement('div');
   progressBar.style.cssText = `
       width: 300px;
       height: 6px;
       background: rgba(255, 255, 255, 0.2);
       border-radius: 3px;
       overflow: hidden;
       margin-bottom: 20px;
   `;


   const progressFill = document.createElement('div');
   progressFill.style.cssText = `
       width: 0%;
       height: 100%;
       background: linear-gradient(90deg, #8a2be2, #4b0082);
       border-radius: 3px;
       transition: width 2s ease;
   `;


   progressBar.appendChild(progressFill);
   overlay.appendChild(loadingText);
   overlay.appendChild(progressBar);
   document.body.appendChild(overlay);


   // Animate overlay
   setTimeout(() => {
       overlay.style.opacity = '1';
   }, 10);


   // Animate progress bar
   setTimeout(() => {
       progressFill.style.width = '100%';
   }, 100);


   // Remove overlay
   setTimeout(() => {
       overlay.style.opacity = '0';
       setTimeout(() => {
           document.body.removeChild(overlay);
       }, 400);
   }, 2500);
}


// Format game names
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


   @keyframes fadeIn {
       from { opacity: 0; }
       to { opacity: 1; }
   }
`;
document.head.appendChild(style);


// Button interactions
document.querySelectorAll('button').forEach(button => {
   button.addEventListener('mouseenter', () => {
       if (!button.classList.contains('sidebar-toggle')) {
           button.style.transform = 'translateY(-2px) scale(1.02)';
       }
   });


   button.addEventListener('mouseleave', () => {
       if (!button.classList.contains('sidebar-toggle')) {
           button.style.transform = '';
       }
   });


   button.addEventListener('mousedown', () => {
       if (!button.classList.contains('sidebar-toggle')) {
           button.style.transform = 'translateY(0) scale(0.98)';
       }
   });


   button.addEventListener('mouseup', () => {
       if (!button.classList.contains('sidebar-toggle')) {
           button.style.transform = 'translateY(-2px) scale(1.02)';
       }
   });
});


// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
   // Toggle sidebar with 'S' key
   if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.altKey &&
       document.activeElement !== searchInput) {
       if (sidebarToggle) sidebarToggle.click();
   }


   // Toggle fullscreen with 'F' key
   if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.altKey &&
       document.activeElement !== searchInput) {
       if (fullscreenBtn) fullscreenBtn.click();
   }


   // Close modals with Escape key
   if (e.key === 'Escape') {
       if (shareModal && shareModal.classList.contains('active')) {
           shareModal.classList.remove('active');
       }
       // Exit fullscreen if active
       if (isFullscreen) {
           toggleFullscreen();
       }
      
       // Close video modal if active
       const videoModal = document.getElementById('videoModal');
       if (videoModal && videoModal.classList.contains('active')) {
           closeVideoModal();
       }
   }
});


// Window resize handler
function handleResize() {
   const isMobile = window.innerWidth <= 768;


   if (isMobile && !sidebarCollapsed && sidebar && mainContent && sidebarToggle) {
       sidebar.classList.add('collapsed');
       mainContent.classList.add('expanded');
       sidebarCollapsed = true;
       sidebarToggle.classList.remove('selected');
   }


   // Adjust canvas size
   if (!isFullscreen && gameContainer && gameCanvas) {
       const container = gameContainer.getBoundingClientRect();
       if (container.width > 0) {
           gameCanvas.style.width = '100%';
           gameCanvas.style.height = 'auto';
       }
   }
}


// Mobile touch gestures
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
       if (diff > 0 && !sidebarCollapsed && sidebarToggle) {
           // Swipe left - close sidebar
           sidebarToggle.click();
       } else if (diff < 0 && sidebarCollapsed && touchStartX < 50 && sidebarToggle) {
           // Swipe right from left edge - open sidebar
           sidebarToggle.click();
       }
   }
}


// Scroll effects
window.addEventListener('scroll', () => {
   const scrolled = window.pageYOffset;
   const gameSection = document.querySelector('.game-section');
  
   if (gameSection && !isFullscreen) {
       gameSection.style.transform = `translateY(${scrolled * 0.1}px)`;
   }
});


// Prevent accidental interactions
if (searchInput) {
   searchInput.addEventListener('focus', (e) => {
       e.stopPropagation();
   });


   searchInput.addEventListener('mousedown', (e) => {
       e.stopPropagation();
   });
}


// Settings Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
   // Only initialize settings if we're on the settings page
   if (document.querySelector('.settings-container')) {
       initializeSettings();
       setupTabNavigation();
       setupSliders();
       setupKeybinds();
       setupColorPicker();
       setupSaveSystem();
       setupModalSystem();
       setupResetFunctionality();
       loadSettings();
       console.log('🎮 Settings page initialized successfully!');
   }
});


// Settings data structure
let settingsData = {
   display: {
       theme: 'dark',
       accentColor: '#8a2be2',
       dynamicBg: true,
       reducedMotion: false,
       uiScale: 100,
       fullscreenDefault: false,
       showFps: false
   },
   audio: {
       masterVolume: 80,
       gameVolume: 90,
       musicVolume: 60,
       sfxVolume: 85,
       spatialAudio: false,
       bassBoost: false,
       audioQuality: 'high'
   },
   controls: {
       keybinds: {
           moveUp: 'KeyW',
           moveLeft: 'KeyA',
           moveDown: 'KeyS',
           moveRight: 'KeyD',
           action: 'Space',
           pause: 'Escape'
       },
       gamepadEnabled: true,
       gamepadSensitivity: 1.0,
       gamepadVibration: true,
       deadzone: 15
   },
   gameplay: {
       targetFps: 60,
       graphicsQuality: 'medium',
       vsync: false,
       autoSave: true,
       skipIntros: false,
       streamerMode: false,
       difficulty: 'normal'
   },
   account: {
       username: 'GamerPro123',
       email: 'gamer@example.com',
       displayName: 'Pro Gamer',
       gameUpdates: true,
       friendRequests: true,
       achievements: true,
       promotions: false
   },
   privacy: {
       profileVisibility: 'friends',
       showOnlineStatus: true,
       showCurrentGame: true,
       allowMessages: true,
       analytics: true,
       crashReports: true
   },
   advanced: {
       devMode: false,
       showConsole: false,
       betaFeatures: false,
       serverRegion: 'auto',
       bandwidth: 'unlimited'
   }
};


// Settings functions (only run if on settings page)
function initializeSettings() {
   if (!document.querySelector('.settings-container')) return;
  
   applyTheme(settingsData.display.theme);
   applyAccentColor(settingsData.display.accentColor);
   updateAllUIElements();
}


function setupTabNavigation() {
   const tabs = document.querySelectorAll('.settings-tab');
   const panels = document.querySelectorAll('.settings-panel');
  
   tabs.forEach(tab => {
       tab.addEventListener('click', () => {
           const targetPanel = tab.dataset.tab;
          
           tabs.forEach(t => t.classList.remove('active'));
           panels.forEach(p => p.classList.remove('active'));
          
           tab.classList.add('active');
           const panel = document.getElementById(`${targetPanel}-panel`);
           if (panel) panel.classList.add('active');
          
           tab.style.transform = 'scale(0.95)';
           setTimeout(() => {
               tab.style.transform = '';
           }, 150);
       });
   });
}


function setupSliders() {
   const sliders = document.querySelectorAll('.setting-slider');
  
   sliders.forEach(slider => {
       const valueDisplay = slider.parentElement.querySelector('.slider-value');
      
       slider.addEventListener('input', (e) => {
           const value = parseFloat(e.target.value);
           const id = e.target.id;
          
           let displayValue;
           if (id === 'uiScale') {
               displayValue = `${value}%`;
           } else if (id === 'gamepadSensitivity') {
               displayValue = `${value.toFixed(1)}x`;
           } else if (id === 'deadzone') {
               displayValue = `${value}%`;
           } else {
               displayValue = `${value}%`;
           }
          
           if (valueDisplay) valueDisplay.textContent = displayValue;
           updateSettingValue(id, value);
          
           if (id === 'uiScale') {
               applyUIScale(value);
           }
       });
   });
}


function setupKeybinds() {
   const keybindButtons = document.querySelectorAll('.keybind-btn');
   let listeningForKey = false;
   let currentButton = null;
  
   keybindButtons.forEach(button => {
       button.addEventListener('click', () => {
           if (listeningForKey) return;
          
           listeningForKey = true;
           currentButton = button;
           button.classList.add('listening');
           button.textContent = 'Press key...';
       });
   });
  
   // Listen for keypress when setting keybinds
   document.addEventListener('keydown', (e) => {
       if (listeningForKey && currentButton) {
           e.preventDefault();
          
           const keyName = getKeyDisplayName(e.code);
           const action = currentButton.dataset.action;
          
           currentButton.textContent = keyName;
           currentButton.classList.remove('listening');
          
           settingsData.controls.keybinds[action] = e.code;
          
           listeningForKey = false;
           currentButton = null;
          
           currentButton.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
           setTimeout(() => {
               currentButton.style.background = '';
           }, 1000);
       }
   });
}


function setupColorPicker() {
   const colorPicker = document.getElementById('accentColor');
   const colorPresets = document.querySelectorAll('.color-preset');
  
   if (colorPicker) {
       colorPicker.addEventListener('change', (e) => {
           const color = e.target.value;
           applyAccentColor(color);
           settingsData.display.accentColor = color;
           updatePresetSelection(color);
       });
   }
  
   colorPresets.forEach(preset => {
       preset.addEventListener('click', () => {
           const color = preset.dataset.color;
           if (colorPicker) colorPicker.value = color;
           applyAccentColor(color);
           settingsData.display.accentColor = color;
           updatePresetSelection(color);
          
           preset.style.transform = 'scale(1.2)';
           setTimeout(() => {
               preset.style.transform = '';
           }, 200);
       });
   });
}


function setupSaveSystem() {
   const saveButton = document.getElementById('saveBtn');
  
   if (saveButton) {
       saveButton.addEventListener('click', () => {
           saveButton.style.opacity = '0.7';
           saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
          
           setTimeout(() => {
               saveSettings();
               showSaveModal();
              
               saveButton.style.opacity = '';
               saveButton.innerHTML = '<i class="fas fa-save"></i> Save Changes';
           }, 1000);
       });
   }
}


function setupModalSystem() {
   const modal = document.getElementById('saveModal');
   const modalOk = document.getElementById('modalOk');
  
   if (modalOk) {
       modalOk.addEventListener('click', () => {
           if (modal) modal.classList.remove('active');
       });
   }
  
   if (modal) {
       modal.addEventListener('click', (e) => {
           if (e.target === modal) {
               modal.classList.remove('active');
           }
       });
   }
}


function setupResetFunctionality() {
   const resetButton = document.getElementById('resetBtn');
  
   if (resetButton) {
       resetButton.addEventListener('click', () => {
           if (confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
               resetToDefaults();
               updateAllUIElements();
               showNotification('Settings reset to defaults', 'success');
           }
       });
   }
}


// Settings helper functions
function updateSettingValue(settingId, value) {
   const settingMap = {
       'uiScale': () => settingsData.display.uiScale = value,
       'masterVolume': () => settingsData.audio.masterVolume = value,
       'gameVolume': () => settingsData.audio.gameVolume = value,
       'musicVolume': () => settingsData.audio.musicVolume = value,
       'sfxVolume': () => settingsData.audio.sfxVolume = value,
       'gamepadSensitivity': () => settingsData.controls.gamepadSensitivity = value,
       'deadzone': () => settingsData.controls.deadzone = value
   };
  
   if (settingMap[settingId]) {
       settingMap[settingId]();
   }
}


function getKeyDisplayName(keyCode) {
   const keyMap = {
       'KeyW': 'W', 'KeyA': 'A', 'KeyS': 'S', 'KeyD': 'D',
       'Space': 'Space', 'Escape': 'Escape', 'Enter': 'Enter',
       'ShiftLeft': 'L Shift', 'ShiftRight': 'R Shift',
       'ControlLeft': 'L Ctrl', 'ControlRight': 'R Ctrl',
       'AltLeft': 'L Alt', 'AltRight': 'R Alt',
       'ArrowUp': '↑', 'ArrowDown': '↓', 'ArrowLeft': '←', 'ArrowRight': '→'
   };
  
   return keyMap[keyCode] || keyCode.replace('Key', '').replace('Digit', '');
}


function applyTheme(theme) {
   document.body.className = document.body.className.replace(/theme-\w+/g, '');
   document.body.classList.add(`theme-${theme}`);
  
   const root = document.documentElement;
  
   switch (theme) {
       case 'light':
           root.style.setProperty('--bg-primary', '#f5f5f5');
           root.style.setProperty('--bg-secondary', '#ffffff');
           root.style.setProperty('--text-primary', '#333333');
           root.style.setProperty('--text-secondary', '#666666');
           break;
       case 'cyberpunk':
           root.style.setProperty('--bg-primary', '#0d0d0d');
           root.style.setProperty('--bg-secondary', '#1a1a1a');
           root.style.setProperty('--accent-color', '#00ffff');
           break;
       case 'neon':
           root.style.setProperty('--bg-primary', '#000012');
           root.style.setProperty('--bg-secondary', '#0a0a2e');
           root.style.setProperty('--accent-color', '#ff00ff');
           break;
       default: // dark
           root.style.setProperty('--bg-primary', '#0a0a23');
           root.style.setProperty('--bg-secondary', '#1e1e3f');
           root.style.setProperty('--text-primary', '#ffffff');
           root.style.setProperty('--text-secondary', '#b8b8d4');
   }
}


function applyAccentColor(color) {
   const root = document.documentElement;
   root.style.setProperty('--accent-color', color);
  
   const elements = document.querySelectorAll('.settings-tab.active, .btn-primary, .keybind-btn');
   elements.forEach(el => {
       el.style.background = `linear-gradient(45deg, ${color}, ${adjustBrightness(color, -20)})`;
   });
}


function adjustBrightness(hex, percent) {
   const num = parseInt(hex.replace("#", ""), 16);
   const amt = Math.round(2.55 * percent);
   const R = (num >> 16) + amt;
   const G = (num >> 8 & 0x00FF) + amt;
   const B = (num & 0x0000FF) + amt;
  
   return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
       (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
       (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}


function applyUIScale(scale) {
   const root = document.documentElement;
   root.style.setProperty('--ui-scale', scale / 100);
   document.body.style.fontSize = `${16 * (scale / 100)}px`;
}


function updatePresetSelection(selectedColor) {
   const presets = document.querySelectorAll('.color-preset');
   presets.forEach(preset => {
       if (preset.dataset.color === selectedColor) {
           preset.style.border = '3px solid #ffffff';
           preset.style.transform = 'scale(1.1)';
       } else {
           preset.style.border = '2px solid rgba(255, 255, 255, 0.2)';
           preset.style.transform = 'scale(1)';
       }
   });
}


function updateAllUIElements() {
   Object.keys(settingsData).forEach(category => {
       Object.keys(settingsData[category]).forEach(setting => {
           const element = document.getElementById(setting);
           if (element) {
               const value = settingsData[category][setting];
              
               if (element.type === 'range') {
                   element.value = value;
                   const valueDisplay = element.parentElement.querySelector('.slider-value');
                   if (valueDisplay) {
                       let displayValue;
                       if (setting === 'uiScale') {
                           displayValue = `${value}%`;
                       } else if (setting === 'gamepadSensitivity') {
                           displayValue = `${value.toFixed(1)}x`;
                       } else if (setting === 'deadzone') {
                           displayValue = `${value}%`;
                       } else {
                           displayValue = `${value}%`;
                       }
                       valueDisplay.textContent = displayValue;
                   }
               } else if (element.type === 'checkbox') {
                   element.checked = value;
               } else if (element.tagName === 'SELECT') {
                   element.value = value;
               } else if (element.type === 'text' || element.type === 'email') {
                   element.value = value;
               } else if (element.type === 'color') {
                   element.value = value;
               }
           }
       });
   });
  
   Object.keys(settingsData.controls.keybinds).forEach(action => {
       const button = document.querySelector(`[data-action="${action}"]`);
       if (button) {
           button.textContent = getKeyDisplayName(settingsData.controls.keybinds[action]);
       }
   });
  
   updatePresetSelection(settingsData.display.accentColor);
}


function saveSettings() {
   try {
       const settingsJSON = JSON.stringify(settingsData);
       window.savedSettings = settingsJSON;
      
       applyTheme(settingsData.display.theme);
       applyAccentColor(settingsData.display.accentColor);
       applyUIScale(settingsData.display.uiScale);
      
       return true;
   } catch (error) {
       console.error('Failed to save settings:', error);
       showNotification('Failed to save settings', 'error');
       return false;
   }
}


function loadSettings() {
   try {
       const savedData = window.savedSettings;
       if (savedData) {
           const parsed = JSON.parse(savedData);
           settingsData = { ...settingsData, ...parsed };
       }
      
       applyTheme(settingsData.display.theme);
       applyAccentColor(settingsData.display.accentColor);
       applyUIScale(settingsData.display.uiScale);
      
       return true;
   } catch (error) {
       console.error('Failed to load settings:', error);
       return false;
   }
}


function resetToDefaults() {
   settingsData = {
       display: {
           theme: 'dark',
           accentColor: '#8a2be2',
           dynamicBg: true,
           reducedMotion: false,
           uiScale: 100,
           fullscreenDefault: false,
           showFps: false
       },
       audio: {
           masterVolume: 80,
           gameVolume: 90,
           musicVolume: 60,
           sfxVolume: 85,
           spatialAudio: false,
           bassBoost: false,
           audioQuality: 'high'
       },
       controls: {
           keybinds: {
               moveUp: 'KeyW',
               moveLeft: 'KeyA',
               moveDown: 'KeyS',
               moveRight: 'KeyD',
               action: 'Space',
               pause: 'Escape'
           },
           gamepadEnabled: true,
           gamepadSensitivity: 1.0,
           gamepadVibration: true,
           deadzone: 15
       },
       gameplay: {
           targetFps: 60,
           graphicsQuality: 'medium',
           vsync: false,
           autoSave: true,
           skipIntros: false,
           streamerMode: false,
           difficulty: 'normal'
       },
       account: {
           username: 'GamerPro123',
           email: 'gamer@example.com',
           displayName: 'Pro Gamer',
           gameUpdates: true,
           friendRequests: true,
           achievements: true,
           promotions: false
       },
       privacy: {
           profileVisibility: 'friends',
           showOnlineStatus: true,
           showCurrentGame: true,
           allowMessages: true,
           analytics: true,
           crashReports: true
       },
       advanced: {
           devMode: false,
           showConsole: false,
           betaFeatures: false,
           serverRegion: 'auto',
           bandwidth: 'unlimited'
       }
   };
  
   applyTheme('dark');
   applyAccentColor('#8a2be2');
   applyUIScale(100);
}


function showSaveModal() {
   const modal = document.getElementById('saveModal');
   if (modal) {
       modal.classList.add('active');
      
       setTimeout(() => {
           modal.classList.remove('active');
       }, 3000);
   }
}


function showNotification(message, type = 'info') {
   const notification = document.createElement('div');
   notification.className = `notification notification-${type}`;
   notification.innerHTML = `
       <div class="notification-content">
           <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
           <span>${message}</span>
       </div>
   `;
  
   notification.style.cssText = `
       position: fixed;
       top: 20px;
       right: 20px;
       background: ${type === 'success' ? 'linear-gradient(45deg, #4CAF50, #45a049)' : 'linear-gradient(45deg, #ff6b6b, #ee5a24)'};
       color: white;
       padding: 15px 20px;
       border-radius: 8px;
       box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
       z-index: 10001;
       opacity: 0;
       transform: translateX(100%);
       transition: all 0.3s ease;
       font-weight: 500;
   `;
  
   document.body.appendChild(notification);
  
   setTimeout(() => {
       notification.style.opacity = '1';
       notification.style.transform = 'translateX(0)';
   }, 100);
  
   setTimeout(() => {
       notification.style.opacity = '0';
       notification.style.transform = 'translateX(100%)';
       setTimeout(() => {
           document.body.removeChild(notification);
       }, 300);
   }, 3000);
}


// Game Spotlight Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
   const trailerBtn = document.getElementById('trailerBtn');
   const videoModal = document.getElementById('videoModal');
   const closeModalBtn = document.getElementById('closeModal');
   const trailerVideo = document.getElementById('trailerVideo');


   // Only proceed if all elements exist
   if (!trailerBtn || !videoModal || !closeModalBtn || !trailerVideo) return;


   // Open modal when trailer button is clicked
   trailerBtn.addEventListener('click', function(e) {
       e.preventDefault();
       videoModal.classList.add('active');
       document.body.style.overflow = 'hidden';
       // Always reset and play the video
       trailerVideo.pause();
       trailerVideo.currentTime = 0;
       trailerVideo.load();
       // Try to play, fallback for autoplay restrictions
       const playPromise = trailerVideo.play();
       if (playPromise && typeof playPromise.then === 'function') {
           playPromise.catch(() => {
               trailerVideo.setAttribute('controls', 'controls');
           });
       }
       // Ensure video is visible
       trailerVideo.style.display = 'block';
   });


   // Close modal function
   function closeVideoModal() {
       videoModal.classList.remove('active');
       document.body.style.overflow = 'auto';
       trailerVideo.pause();
       trailerVideo.currentTime = 0;
       trailerVideo.load();
       trailerVideo.style.display = 'block';
   }


   window.closeVideoModal = closeVideoModal;


   closeModalBtn.addEventListener('click', closeVideoModal);
   videoModal.addEventListener('click', function(e) {
       if (e.target === videoModal) {
           closeVideoModal();
       }
   });


   // Handle Play Now button click (if you want to add analytics or confirmation)
   const playNowBtn = document.querySelector('.btn-primary');
   if (playNowBtn) {
       playNowBtn.addEventListener('click', function(e) {
           // Optional: Add analytics tracking here
           console.log('Play Now button clicked');
       });
   }
  
   // Add hover effects for particles (only if elements exist)
   const spotlightImage = document.querySelector('.spotlight-image');
   const particles = document.querySelectorAll('.particle');
  
   if (spotlightImage && particles.length > 0) {
       spotlightImage.addEventListener('mouseenter', function() {
           particles.forEach((particle, index) => {
               particle.style.animationDuration = '1.5s';
               particle.style.transform = `translateY(-${5 + index * 2}px)`;
           });
       });
      
       spotlightImage.addEventListener('mouseleave', function() {
           particles.forEach((particle) => {
               particle.style.animationDuration = '3s';
               particle.style.transform = 'translateY(0px)';
           });
       });
   } else {
       console.log('Spotlight image or particles not found - skipping hover effects');
   }
  
   // Additional video debugging
   if (trailerVideo) {
       trailerVideo.addEventListener('loadstart', () => console.log('Video load started'));
       trailerVideo.addEventListener('canplay', () => console.log('Video can play'));
       trailerVideo.addEventListener('error', (e) => console.error('Video error:', e));
   }
});


console.log('🎮 JavaScript loaded successfully!');

// DOM elements
let carouselSlides;
let randomButton;
let selectedGameSection;
let selectedGameImage;
let selectedGameTitle;
let selectedGameDescription;
let selectedGameImageWrapper;

// State
let currentSelectedGame = null;
let carouselAnimationId = null;
let carouselPosition = 0;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    createDynamicCarousel();
    attachEventListeners();
    startCarouselAnimation();
});

function initializeElements() {
    carouselSlides = document.getElementById('carouselSlides');
    randomButton = document.getElementById('randomButton');
    selectedGameSection = document.getElementById('selectedGameSection');
    selectedGameImage = document.getElementById('selectedGameImage');
    selectedGameTitle = document.getElementById('selectedGameTitle');
    selectedGameDescription = document.getElementById('selectedGameDescription');
    selectedGameImageWrapper = document.getElementById('selectedGameImageWrapper');
}

function createDynamicCarousel() {
    if (!carouselSlides || !gamesDatabase) return;
    
    carouselSlides.innerHTML = '';
    
    // Create enough slides to ensure smooth infinite scrolling
    // We need at least 3 sets of all games for seamless looping
    const tripleGames = [...gamesDatabase, ...gamesDatabase, ...gamesDatabase];
    
    tripleGames.forEach((game, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.style.backgroundImage = `url('${game.image}')`;
        slide.setAttribute('data-game-index', index % gamesDatabase.length);
        slide.setAttribute('title', game.name);
        
        // Add click handler for carousel slides
        slide.addEventListener('click', function() {
            const gameIndex = parseInt(this.getAttribute('data-game-index'));
            const selectedGame = gamesDatabase[gameIndex];
            displaySelectedGame(selectedGame);
        });
        
        carouselSlides.appendChild(slide);
    });
    
    // Set initial width for smooth animation
    updateCarouselWidth();
}

function updateCarouselWidth() {
    if (!carouselSlides) return;
    
    const slides = carouselSlides.children;
    const slideWidth = getSlideWidth();
    const gap = getGapSize();
    
    // Calculate total width needed for all slides
    const totalWidth = slides.length * (slideWidth + gap);
    carouselSlides.style.width = `${totalWidth}px`;
}

function getSlideWidth() {
    // Return slide width based on screen size
    if (window.innerWidth <= 320) return 80;
    if (window.innerWidth <= 480) return 100;
    if (window.innerWidth <= 768) return 120;
    return 160;
}

function getGapSize() {
    // Return gap size based on screen size
    if (window.innerWidth <= 480) return 6;
    if (window.innerWidth <= 768) return 8;
    return 10;
}

function startCarouselAnimation() {
    if (carouselAnimationId) {
        cancelAnimationFrame(carouselAnimationId);
    }
    
    animateCarousel();
}

function animateCarousel() {
    if (!carouselSlides) return;
    
    const slideWidth = getSlideWidth();
    const gap = getGapSize();
    const moveDistance = slideWidth + gap;
    
    // Move the carousel
    carouselPosition -= 0.5; // Adjust speed here (pixels per frame)
    
    // Reset position when we've moved one full set of games
    const resetPoint = -(gamesDatabase.length * moveDistance);
    if (carouselPosition <= resetPoint) {
        carouselPosition = 0;
    }
    
    carouselSlides.style.transform = `translateX(${carouselPosition}px)`;
    
    carouselAnimationId = requestAnimationFrame(animateCarousel);
}

function pauseCarousel() {
    if (carouselAnimationId) {
        cancelAnimationFrame(carouselAnimationId);
        carouselAnimationId = null;
    }
}

function resumeCarousel() {
    if (!carouselAnimationId) {
        startCarouselAnimation();
    }
}

function attachEventListeners() {
    // Random button click
    if (randomButton) {
        randomButton.addEventListener('click', selectRandomGame);
    }
    
    // Category bar clicks
    const categoryBars = document.querySelectorAll('.category-bar');
    categoryBars.forEach(bar => {
        bar.addEventListener('click', function() {
            const category = this.dataset.category;
            selectRandomGameFromCategoryEnhanced(category);
        });
    });
    
    // Selected game image click
    if (selectedGameImageWrapper) {
        selectedGameImageWrapper.addEventListener('click', function() {
            if (currentSelectedGame) {
                // Navigate to the game page with slug parameter
                window.location.href = `https://www.infinite-pixels.com/game.html?game=${currentSelectedGame.slug}`;
            }
        });
    }
    
    // Pause carousel on hover
    if (carouselSlides) {
        carouselSlides.addEventListener('mouseenter', pauseCarousel);
        carouselSlides.addEventListener('mouseleave', resumeCarousel);
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        updateCarouselWidth();
    });
}

function selectRandomGame() {
    // Add spinning animation to button
    randomButton.classList.add('spinning');
    
    // Select random game after animation
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * gamesDatabase.length);
        const selectedGame = gamesDatabase[randomIndex];
        displaySelectedGame(selectedGame);
        randomButton.classList.remove('spinning');
    }, 1000);
}

function selectRandomGameFromCategory(category) {
    // Filter games by category
    const categoryGames = gamesDatabase.filter(game => 
        game.tags.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
    );
    
    if (categoryGames.length === 0) {
        // Fallback to all games if no games in category
        selectRandomGame();
        return;
    }
    
    // Add spinning animation to button
    randomButton.classList.add('spinning');
    
    // Select random game from category after animation
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * categoryGames.length);
        const selectedGame = categoryGames[randomIndex];
        displaySelectedGame(selectedGame);
        randomButton.classList.remove('spinning');
    }, 1000);
}

function displaySelectedGame(game) {
    currentSelectedGame = game;
    
    // Update game details
    if (selectedGameImage) {
        selectedGameImage.src = game.image;
        selectedGameImage.alt = game.name;
    }
    
    if (selectedGameTitle) {
        selectedGameTitle.textContent = game.name;
    }
    
    if (selectedGameDescription) {
        selectedGameDescription.textContent = game.description;
    }
    
    // Show the selected game section with animation
    if (selectedGameSection) {
        selectedGameSection.style.display = 'block';
        setTimeout(() => {
            selectedGameSection.classList.add('show');
            // Scroll to the selected game section
            selectedGameSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
    }
}

// Utility function to get games by category
function getGamesByCategory(category) {
    return gamesDatabase.filter(game => 
        game.tags.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
    );
}

// Enhanced category mapping for better filtering
const categoryMappings = {
    'shooter': ['shooter', 'action'],
    'racing': ['racing', 'cars'],
    'puzzle': ['puzzle', '2048', 'clicker'],
    'io': ['io', 'multiplayer', 'online'],
    'sports': ['sports', 'basketball'],
    'arcade': ['arcade', 'endless', 'platformer']
};

function getEnhancedGamesByCategory(category) {
    const searchTags = categoryMappings[category] || [category];
    return gamesDatabase.filter(game => 
        game.tags.some(tag => 
            searchTags.some(searchTag => 
                tag.toLowerCase().includes(searchTag.toLowerCase())
            )
        )
    );
}

// Update the selectRandomGameFromCategory function to use enhanced filtering
function selectRandomGameFromCategoryEnhanced(category) {
    const categoryGames = getEnhancedGamesByCategory(category);
    
    if (categoryGames.length === 0) {
        selectRandomGame();
        return;
    }
    
    randomButton.classList.add('spinning');
    
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * categoryGames.length);
        const selectedGame = categoryGames[randomIndex];
        displaySelectedGame(selectedGame);
        randomButton.classList.remove('spinning');
    }, 1000);
}

// Dynamic carousel management
function addGameToCarousel(game) {
    if (!carouselSlides) return;
    
    // Add the game to the database first
    gamesDatabase.push(game);
    
    // Recreate carousel with new game included
    createDynamicCarousel();
}

function removeGameFromCarousel(gameSlug) {
    if (!carouselSlides) return;
    
    // Remove the game from the database
    const gameIndex = gamesDatabase.findIndex(game => game.slug === gameSlug);
    if (gameIndex !== -1) {
        gamesDatabase.splice(gameIndex, 1);
        
        // Recreate carousel without the removed game
        createDynamicCarousel();
    }
}

function updateCarouselGame(gameSlug, updatedGame) {
    if (!carouselSlides) return;
    
    // Update the game in the database
    const gameIndex = gamesDatabase.findIndex(game => game.slug === gameSlug);
    if (gameIndex !== -1) {
        gamesDatabase[gameIndex] = updatedGame;
        
        // Recreate carousel with updated game
        createDynamicCarousel();
    }
}

// Expose functions for external use
window.randomPageUtils = {
    addGameToCarousel,
    removeGameFromCarousel,
    updateCarouselGame,
    pauseCarousel,
    resumeCarousel,
    selectRandomGame,
    selectRandomGameFromCategoryEnhanced
};

// Enhanced games database with descriptions and game URLs
const gamesDatabase = [
 {
 id: 1,
 name: "1v1 Lol",
 image: "images/1v1lolimage.jpg",
 slug: "1v1lol",
 gameUrl: "https://1v1.lol/",
 tags: ["shooter", "action", "multiplayer"],
 description: "1v1.LOL is an online third-person shooter with cool building mechanics. Battle royale, build battle, box fight, zone wars and more game modes to enjoy!"
 },
 {
 id: 2,
 name: "3D Formula Racing",
 image: "images/3dformularacingimage.jpg",
 slug: "3dformularacing",
 gameUrl: "https://html5.gamemonetize.co/tia5pbecnefai0pnlkapzyzzfh0yobn4/",
 tags: ["racing", "cars", "3d"],
 description: "Feel the excitement of Formula 1 in this fast-paced 3D racing adventure. Take on tricky tracks filled with twists and turns while pushing your skills to the limit. Compete head-to-head with rival drivers in a battle for speed and precision. Cross the finish line first to claim victory and prove yourself as the ultimate racer."
 },
 {
 id: 3,
 name: "Basket Random",
 image: "images/basketrandomimage.jpg",
 slug: "basketrandom",
 gameUrl: "https://html5.gamemonetize.co/anaaahgt57d5t2tddrbc1m4qq97vz1jd/",
 tags: ["2 player", "basketball", "sports"],
 description: "Basket Random is a lighthearted basketball game that uses ragdoll-style physics for hilarious gameplay. You can challenge a friend or face off against the computer in unpredictable matches. Each game is full of surprises, making every round unique and entertaining. It’s a chaotic twist on basketball where skill and randomness collide."
 },
 {
 id: 4,
 name: "Cookie Clicker",
 image: "images/cookieclickerimage.jpg",
 slug: "cookieclicker",
 gameUrl: "https://html5.gamemonetize.co/z5n072q7gj0w969r5ul4ignnxe0fzsun/",
 tags: ["clicker", "idle", "cooking"],
 description: "This is the classic idle clicker game that started it all. Simply click on cookies to collect points and unlock upgrades that boost your production. As you progress, your cookies begin generating automatically, allowing you to expand even faster. The challenge is to see just how many cookies you can create!"
 },
 {
 id: 5,
 name: "Cube Arena 2048",
 image: "images/cubearenaimage.jpg",
 slug: "cubearena2048",
 gameUrl: "https://html5.gamemonetize.co/83up5y2u78nvd5ngywugy6j4g3im4lda/",
 tags: ["3d", "2048", "io"],
 description: "This game puts a 3D spin on the classic 2048 puzzle. Move and merge cubes with identical numbers to form higher-value blocks. The added dimension creates fresh challenges and strategic opportunities. Test your puzzle-solving skills as you work to reach the highest numbers in a 3D arena."
 },
 {
 id: 6,
 name: "Draw Climber",
 image: "images/drawclimberimage.jpg",
 slug: "drawclimber",
 gameUrl: "https://html5.gamemonetize.co/0lkapk5bhk46tk0s8d971iyarszc8ib8/",
 tags: ["puzzle", "drawing", "runner"],
 description: "Draw legs for your character to help them climb over obstacles! Each obstacle requires different leg shapes, so be creative with your drawings!"
 },
 {
 id: 7,
 name: "Fruit Merge",
 image: "images/fruitmergeimage.jpg",
 slug: "fruitmerge",
 gameUrl: "https://html5.gamemonetize.co/rgz7sjhynwsheffgv4ijzz1nj2oa1nur/",
 tags: ["satisfying", "puzzle", "fruit"],
 description: "In this calming puzzle game, you drop fruits and merge matching ones to form larger varieties. As the smaller fruits come together, they transform into bigger and more rewarding creations. The gameplay is simple yet addictive, offering a relaxing experience. Enjoy watching your fruit collection grow with every clever move you make."
 },
 {
 id: 8,
 name: "Helix Jump",
 image: "images/helixjumpimage.jpg",
 slug: "helixjump",
 gameUrl: "https://html5.gamemonetize.co/ghzimuehf6yw4vkdaywk1s9x3mrbgq0w/",
 tags: ["arcade", "endless", "platformer"],
 description: "Guide the ball as it bounces down through a twisting helix tower. Carefully avoid the colored platforms that can end your run. The goal is to keep descending as far as possible without slipping up. See how deep you can go in this fast-paced challenge!"
 },
 {
 id: 9,
 name: "Masked Special Forces",
 image: "images/maskedspecialforcesimage.jpg",
 slug: "maskedspecialforces",
 gameUrl: "https://html5.gamemonetize.co/1s10wsxntjub41qo2puh7jlx3qmbvh5t/",
 tags: ["shooter", "online", "multiplayer"],
 description: "Step into the role of an elite special forces soldier in this action-packed multiplayer shooter. Team up with other players to tackle strategic missions and intense firefights. Each match presents different combat situations that test your coordination and skill. Work together to outsmart opponents and secure victory on the battlefield."
 },
 {
 id: 10,
 name: "Paper Io",
 image: "images/paperioimage.jpg",
 slug: "paperio",
 gameUrl: "https://html5.gamemonetize.co/1skj7a1hu68a1p31ag4ywljq4gb18oma/",
 tags: ["io", "strategy", "multiplayer"],
 description: "Dominate the map in this engaging io game by claiming as much territory as you can. Draw lines to expand your area while staying cautious of other players who can cut you off. Strategy and quick reflexes are key to staying ahead. See how much land you can capture before someone takes you down!"
 },
 {
 id: 11,
 name: "Parkour Block 3D",
 image: "images/parkourblock3dimage.jpg",
 slug: "parkourblock3d",
 gameUrl: "https://html5.gamemonetize.co/hrsxh2clxg229ty294gdlbjzeejglgmp/",
 tags: ["parkour", "3d", "platformer"],
 description: "Hone your parkour skills in this immersive 3D block universe. Leap, slide, and climb your way through intricate obstacle courses. Each level challenges your timing and agility, pushing your reflexes to the limit. See how far you can go while mastering every jump and movement."
 },
 {
 id: 12,
 name: "Poly Track",
 image: "images/polytrackimage.jpg",
 slug: "polytrack",
 gameUrl: "https://www.kodub.com/apps/polytrack",
 tags: ["racing", "cars", "online"],
 description: "Speed through sleek low-poly tracks in this contemporary racing experience. Tackle challenging courses that test your precision and control. Realistic physics make every turn and drift feel authentic. Push your skills to the limit as you race toward victory."
 },
 {
 id: 13,
 name: "Rodeo Stampede",
 image: "images/rodeostampedeimage.jpg",
 slug: "rodeostampede",
 gameUrl: "https://html5.gamemonetize.co/p4y8uwto5cchbs371ua7hxqzidihi213/",
 tags: ["adventure", "animal", "racing"],
 description: "Embark on an endless adventure where you lasso and tame wild animals. Ride majestic creatures like buffalo and elephants while navigating the challenges of the savanna. Dodge obstacles and explore the vast, untamed landscape. See how far you can go as you master each ride and adventure."
 },
 {
 id: 14,
 name: "Spiral Roll",
 image: "images/spiralrollimage.jpg",
 slug: "spiralroll",
 gameUrl: "https://html5.gamemonetize.co/fq17wpd1ygq5kppyqq9souztit8jlkk0/",
 tags: ["platformer", "satisfying", "3d"],
 description: "Smash through the spiral tower using your bouncing ball. Guide it carefully down the vibrant, twisting path while dodging obstacles. The combination of movement and impact creates a surprisingly satisfying experience. Keep going to see how far you can break through!"
 },
 {
 id: 15,
 name: "Subway Surfers",
 image: "images/subwaysurfersimage.jpg",
 slug: "subwaysurfers",
 gameUrl: "https://html5.gamemonetize.co/du2cejdc5we8szc7vgfdatel08oxr0zg/",
 tags: ["endless", "platformer", "parkour"],
 description: "Sprint through the subway in this thrilling endless runner game. Dodge oncoming trains, grab coins, and glide along the tracks. Stay one step ahead of the grumpy inspector as you navigate each obstacle. How far can you push your speed and reflexes?"
 },
 {
 id: 16,
 name: "Tiny Fishing",
 image: "images/tinyfishingimage.jpg",
 slug: "tinyfishing",
 gameUrl: "https://html5.gamemonetize.co/hzvsxelbew3y0v09vyql2n40kgtziqyg/",
 tags: ["idle", "fishing", "clicker"],
 description: "Enjoy a calming fishing experience in this idle game where you simply cast your line and wait for a catch. Upgrade your gear to improve your chances and explore deeper waters. Discover a variety of fish species as you progress. Relax and see how many fish you can reel in over time."
 },
 {
 id: 17,
 name: "Bloxd io",
 image: "images/bloxdioimage.jpg",
 slug: "bloxdio",
 gameUrl: "https://bloxd.io/",
 tags: ["io", "parkour", "multiplayer"],
 description: "Block-style battle royale with parkour elements! Build, fight, and survive against other players in this unique multiplayer experience."
 },
 {
 id: 18,
 name: "Moto X3M",
 image: "images/motox3mimage.jpg",
 slug: "motox3m",
 gameUrl: "https://html5.gamemonetize.co/cwvgstrd6an0nqgcf0rdd7phev53fnm1/",
 tags: ["bike", "racing", "levels"],
 description: "Take on daring obstacle courses on your dirt bike in this action-packed racing game. Pull off impressive stunts while navigating tricky and hazardous terrain. Each course tests your control and timing to the limit. Push your skills to conquer every challenge and reach the finish line."
 },
 {
 id: 19,
 name: "Tall Man Run",
 image: "images/tallmanrunimage.jpg",
 slug: "tallmanrun",
 gameUrl: "https://html5.gamemonetize.co/skdbuby5hhfbfz0r7xl3jbcovwhugsfk/",
 tags: ["3d", "platformer", "runner"],
 description: "Sprint through exciting levels, growing taller by picking up the right items along the way. Dodge obstacles that can shrink you and slow your progress. The taller you get, the closer you are to victory. Race to the finish line and see how towering you can become!"
 },
 {
 id: 20,
 name: "Happy Wheels",
 image: "images/happywheelsimage.jpg",
 slug: "happywheels",
 gameUrl: "https://html5.gamemonetize.co/2aibzvt72bgq8i17drkp5y9a6v7a4rq8/",
 tags: ["adventure", "racing", "sports"],
 description: "Take on perilous obstacle courses in this physics-driven game. Pick your favorite character and vehicle before tackling the challenges ahead. Carefully maneuver through traps and hazards to avoid crashes. Test your skill and strategy to reach the finish line safely."
 },
 {
 id: 21,
 name: "Madalin Stunt Cars Pro",
 image: "images/madalinstuntcarsproimage.jpg",
 slug: "madalinstuntcarspro",
 gameUrl: "https://html5.gamemonetize.co/d452kzeh8w8ouiigleba5g52hgu805ls/",
 tags: ["multiplayer", "racing", "cars"],
 description: "Show off your driving skills in this adrenaline-filled supercar stunt game. Navigate enormous stunt arenas while performing jaw-dropping tricks. Realistic car physics make each maneuver feel authentic and thrilling. Push your limits to master every stunt and dominate the arena."
 },
 {
 id: 22,
 name: "Ice Fishing",
 image: "images/icefishingimage.jpg",
 slug: "icefishing",
 gameUrl: "https://html5.gamemonetize.co/ixcjahmstfww53i0yvwn30089nd6e2ay/",
 tags: ["fishing", "3d", "sports"],
 description: "Experience the calm of winter in this 3D ice fishing game. Drill through the ice and reel in a variety of fish while surrounded by a serene snowy landscape. The relaxing atmosphere makes each catch satisfying. Test your patience and skill to see how many fish you can catch."
 },
 {
 id: 23,
 name: "Stick Fighter",
 image: "images/stickfighter3dimage.jpg",
 slug: "stickfighter",
 gameUrl: "https://html5.gamemonetize.co/vlskz7dtsxmpg34pu546de1wjng6ffob/",
 tags: ["action", "stickman", "2 player"],
 description: "Jump into thrilling 3D stick figure battles in this action-packed fighting game. Face off against challenging AI opponents or compete with a friend for intense duels. Realistic physics make every punch, kick, and move feel dynamic and exciting. Test your strategy and reflexes to dominate the arena."
 },
 {
 id: 24,
 name: "Fruit Ninja",
 image: "images/fruitninjaimage.jpg",
 slug: "fruitninja",
 gameUrl: "https://html5.gamemonetize.co/4kci7og3klgj0ivy2wz3gdvd9dth5e7n/",
 tags: ["fruit", "satisfying", "arcade"],
 description: "Swipe across the screen to slice juicy fruits in this fun arcade game. Be careful to avoid hidden bombs while aiming for high scores. Each cut is fast-paced and satisfying, keeping you engaged. Challenge yourself to see how many fruits you can slice in a single round."
 },
 {
 id: 25,
 name: "Fall Cars: Hexagon",
 image: "images/fallcarshexagonimage.jpg",
 slug: "fallcarshexagon",
 gameUrl: "https://html5.gamemonetize.co/5ms4h5xfk8lssrl6iitqdpj8uk4tketp/",
 tags: ["cars", "2 player", "platformer"],
 description: "Speed across shifting hexagonal platforms in this intense multiplayer racing game. Avoid falling as the tiles disappear beneath you while competing against other players. The goal is to stay on the track and be the last car remaining. Test your reflexes and strategy to survive and claim victory."
 },
 {
 id: 26,
 name: "Ball 2048",
 image: "images/ball2048image.jpg",
 slug: "ball2048",
 gameUrl: "https://html5.gamemonetize.co/e3jt923v68e8vninc5fcg8jbzpy4p5tz/",
 tags: ["2048", "levels", "runner"],
 description: "Guide your ball through exciting levels in this 2048-inspired runner. Merge with other balls of the same number to grow larger and increase your score. Navigate obstacles while strategically combining balls to reach higher values. See how far you can go as your ball becomes unstoppable."
 },
 {
 id: 27,
 name: "Papas Burgeria",
 image: "images/papasburgeriaimage.jpg",
 slug: "papasburgeria",
 gameUrl: "https://html5.gamemonetize.co/uw4s71zy0s3jxo6hckel04mw9rbopba8/",
 tags: ["cooking", "clicker", "arcade"],
 description: "Manage Papa's burger joint in this fast-paced cooking game. Take customer orders, grill juicy patties, and assemble tasty burgers quickly. Keep up with the rush to satisfy hungry patrons and earn rewards. Test your multitasking skills to run the restaurant smoothly and efficiently."
 },
 {
 id: 28,
 name: "Bullet Army Run",
 image: "images/bulletarmyrunimage.jpg",
 slug: "bulletarmyrun",
 gameUrl: "https://html5.gamemonetize.co/05v9me4wnyc3flvn250njm13yjh1cacj/",
 tags: ["levels", "runner", "arcade"],
 description: "Dash through hostile territory in this action-packed shooter game. Shoot obstacles and enemies while making your way through tough military-themed levels. Gather ammunition and power-ups to boost your chances of survival. Stay alert and strategic to overcome every challenge in your path."
 },
 {
 id: 29,
 name: "Ninja Arashi",
 image: "images/ninjaarashiimage.jpg",
 slug: "ninjaarashi",
 gameUrl: "https://html5.gamemonetize.co/5dgqcoefxg0lpgt7o5mduxysprpft7cz/",
 tags: ["adventure", "action", "platformer"],
 description: "Join the ninja Arashi on a heroic quest to rescue his son from the villainous Orochi. Leap, dash, and battle through perilous levels filled with enemies and traps. Each stage tests your agility, combat skills, and strategy. Experience an action-packed adventure full of danger and heroism."
 },
 {
 id: 30,
 name: "Funny Shooter 2",
 image: "images/funnyshooter2image.jpg",
 slug: "funnyshooter2",
 gameUrl: "https://html5.gamemonetize.co/6qfki05meirgub3gv0l2qacr2g3wnsch/",
 tags: ["shooter", "action", "3d"],
 description: "Step into a 3D first-person shooter where quirky red enemies await your attack. Arm yourself with a variety of weapons and strategies to defeat them. Each level challenges your aim, reflexes, and tactical thinking. Fight your way through and clear every stage for victory."
 },
 {
 id: 31,
 name: "Survival Race",
 image: "images/survivalraceimage.jpg",
 slug: "survivalrace",
 gameUrl: "https://html5.gamemonetize.co/9km7avlf26r9se5gam8028uq4p6drmx1/",
 tags: ["racing", "multiplayer", "platformer"],
 description: "Compete against other players in a high-speed race filled with perilous obstacles. Dodge hazards and navigate tricky paths to stay ahead of the competition. Only those with quick reflexes and smart strategies will make it to the finish line. Push your skills to the limit and aim for victory."
 },
 {
 id: 32,
 name: "Offroad Cycle 3D",
 image: "images/offroadcycle3dimage.jpg",
 slug: "offroadcycle3d",
 gameUrl: "https://html5.gamemonetize.co/su4m68j4kkt3jsap0867audlbk8hkrpc/",
 tags: ["racing", "bike", "3d"],
 description: "Ride your mountain bike across rugged offroad trails in this immersive 3D cycling game. Tackle rough terrain and tricky obstacles while showcasing your stunt skills. Realistic physics make each jump and turn feel authentic. Test your balance and agility as you conquer every challenging trail."
 },
 {
 id: 33,
 name: "Rocket Bike Highway Race",
 image: "images/rocketbikeshighwayraceimage.jpg",
 slug: "rocketbikeshighwayrace",
 gameUrl: "https://html5.gamemonetize.co/ia1hvdgxut4k7h3kjhjecyx7iwhxi010/",
 tags: ["racing", "bike", "3d"],
 description: "Zoom through bustling highways on your rocket-powered bike in this futuristic racing game. Avoid cars and obstacles while maintaining top speed. Activate your rocket boost to surge ahead and leave competitors behind. Push your reflexes to the limit as you race toward victory."
 },
 {
 id: 34,
 name: "Block Stack 3D",
 image: "images/blockstack3dimage.jpg",
 slug: "blockstack3d",
 gameUrl: "https://html5.gamemonetize.co/trltidnug856kmwd6pglqxsti7v8r3g9/",
 tags: ["3d", "puzzle", "endless"],
 description: "Challenge yourself to build towering structures in this 3D puzzle game. Carefully time each block drop to stack them as high as possible. Keep your balance to prevent the tower from toppling over. Aim for maximum height and test your precision with every move."
 },
 {
 id: 35,
 name: "Draw the Car Path",
 image: "images/drawthecarpathimage.jpg",
 slug: "drawthecarpath",
 gameUrl: "https://html5.gamemonetize.co/9nx8j6pdpcndxl3sxi5xlq9x8d4tc14m/",
 tags: ["drawing", "puzzle", "levels"],
 description: "Guide cars to their parking spaces by drawing safe paths in this strategic puzzle game. Plan each route carefully to prevent crashes and ensure smooth traffic flow. Each level increases in complexity, challenging your planning skills. Successfully park all cars to advance and master the game."
 },
 {
 id: 36,
 name: "Shell Shockers",
 image: "images/shellshockersimage.jpg",
 slug: "shellshockers",
 gameUrl: "https://shellshock.io/",
 tags: ["shooter", "io", "multiplayer"],
 description: "Jump into a funny multiplayer FPS where you play as an egg. Hunt down opponents and try to crack them while staying unbroken yourself. Fast reflexes and clever tactics are key to survival. Compete with friends for the ultimate egg-cellent victory."
 },
 {
 id: 37,
 name: "Smash Karts",
 image: "images/smashkartsimage.jpg",
 slug: "smashkarts",
 gameUrl: "https://smashkarts.io/",
 tags: ["racing", "action", "multiplayer"],
 description: "Zoom around thrilling tracks while taking on other racers in this action-packed kart game. Use weapons and power-ups strategically to gain the upper hand. Dodge attacks from opponents while aiming to stay in the lead. Be the last kart standing to claim victory and dominate the race."
 },
 {
 id: 38,
 name: "Ships 3D",
 image: "images/ships3dimage.jpg",
 slug: "ships3d",
 gameUrl: "https://yp3d.com/ships3d/",
 tags: ["3d", "action", "multiplayer"],
 description: "Take control of a powerful warship in thrilling naval battles. Engage in 3D combat against both AI opponents and other players on the open sea. Strategically maneuver and fire to outsmart your enemies. Prove your mastery of the high seas and dominate every battle."
 },
 {
 id: 39,
 name: "Goober Dash",
 image: "images/gooberdashimage.jpg",
 slug: "gooberdash",
 gameUrl: "https://gooberdash.winterpixel.io",
 tags: ["io", "platformer", "multiplayer"],
 description: "Compete with other players in fast-paced obstacle course races. Jump across platforms, dodge traps, and tackle challenging terrain. Every level tests your speed, timing, and agility. Strive to be the first to reach the finish line and claim victory."
 },
 {
 id: 40,
 name: "Golf Clash",
 image: "images/golfclashimage.jpg",
 slug: "golfclash",
 gameUrl: "https://html5.gamemonetize.co/ywl5omork0jwarou5xrxinfjgxphqh6s/",
 tags: ["sports", "arcade", "multiplayer"],
 description: "Step onto the green in this exciting competitive golf game. Perfect your swing and strategy to tackle a variety of courses and challenges. Compete against players from around the world in tournaments. Aim for precision and skill to rise to the top of the leaderboard."
 },
 {
 id: 41,
 name: "Smiling Glass",
 image: "images/smilingglassimage.jpg",
 slug: "smilingglass",
 gameUrl: "https://html5.gamemonetize.co/58l05tjrdda0semxivccmttcg2laqsbv/",
 tags: ["satisfying", "puzzle", "clicker"],
 description: "Pour water into the glass and bring a smile to life in this clever puzzle game. Draw lines to direct the water’s path and solve tricky physics-based challenges. Each level grows more complex, testing your problem-solving skills. Think creatively to guide the water and complete every puzzle."
 },
 {
 id: 42,
 name: "Crowdy City IO",
 image: "images/crowdycityioimage.jpg",
 slug: "crowdycityio",
 gameUrl: "https://html5.gamemonetize.co/3yrlza468z3vsm3r4mv8v9bi7iv2p3tl/",
 tags: ["io", "strategy", "multiplayer"],
 description: "Build the largest following in the city in this competitive io game. Move quickly to gather more followers while steering clear of rival players’ crowds. Strategize your path to grow your numbers without losing momentum. See how big you can make your crowd and dominate the game."
 },
 {
 id: 43,
 name: "Archery King 3D",
 image: "images/archeryking3dimage.jpg",
 slug: "archeryking3d",
 gameUrl: "https://html5.gamemonetize.co/8zxe2n90tqn7nbpp6z3fqdq1xinsh5j4/",
 tags: ["3d", "strategy", "sports"],
 description: "Hone your archery skills in this realistic 3D sports game. Carefully aim your shots while considering wind and distance to hit the target. Each level challenges your precision and focus. Strive for perfect bullseyes to become the ultimate archery champion."
 },
 {
 id: 44,
 name: "Scooter Touchgrind",
 image: "images/scootertouchgrind3dimage.jpg",
 slug: "scootertouchgrind",
 gameUrl: "https://html5.gamemonetize.co/jkgxa35eeoodbqfj9hlfya96yq75weoi/",
 tags: ["sports", "3d", "racing"],
 description: "Scooter Touchgrind Tricks 3D is an exciting scooter driving game where you navigate challenging levels filled with obstacles. Your main objective is to reach the finish line without crashing while maintaining balance. Collect coins along the way to unlock new scooters and explore different styles. As the tracks become more difficult, your reflexes and control will be put to the test."
 },
 {
 id: 45,
 name: "Dunk Shot",
 image: "images/dunkshotimage.jpg",
 slug: "dunkshot",
 gameUrl: "https://html5.gamemonetize.co/nfungeu1lgtd3uholrztk9r8gwwgtsxl/",
 tags: ["basketball", "clicker", "arcade"],
 description: "Dunk Shot Basketball is a fun mobile game where you aim to score as many baskets as possible. The hoop moves up and down, adding a challenge to your shots. Collect stars during gameplay to purchase additional balls and keep playing. Test your timing and precision to achieve high scores within the time limit."
 },
 {
 id: 46,
 name: "Uno Online",
 image: "images/unoonlineimage.jpg",
 slug: "unoonline",
 gameUrl: "https://html5.gamemonetize.co/wkxitscgm7t9szdj938hq6bs10ms7rse/",
 tags: ["strategy", "multiplayer", "online"],
 description: "UNO Online is a strategic card game where the goal is to be the first player to empty your hand. Success requires predicting your opponents’ cards and planning your moves carefully. Choosing the right cards at the right time is key to gaining an advantage. Outsmart your rivals and play strategically to claim victory."
 },
 {
 id: 47,
 name: "Snowball IO",
 image: "images/snowballioimage.jpg",
 slug: "snowballio",
 gameUrl: "https://html5.gamemonetize.co/v4hz9wmqunchapevb1msrjdrc39f3csy/",
 tags: ["io", "arcade", "online"],
 description: "Snowball.io is an exciting multiplayer action game where you control a snow-clearing machine. Build and launch snowballs at your opponents to knock them out of the arena. The last player remaining wins the match. Stay quick and strategic to dominate the snowy battlefield."
 },
 {
 id: 47,
 name: "Realistic Lion Hunting",
 image: "images/realisticlionhuntingimage.jpg",
 slug: "realisticlionhunting",
 gameUrl: "https://html5.gamemonetize.co/4xgs7sshdp0wpeqsoztn42pdttjiy5jq/",
 tags: ["animal", "action", "simulator"],
 description: "Step into the life of a powerful lion in Realistic Lion Hunting, an immersive wildlife simulator. Roam a vast, detailed forest and hunt different animals to survive and progress. Track your prey carefully and navigate the dense wilderness for the ultimate challenge. Experience the excitement and thrill of life in the wild from a predator’s perspective."
 },
 {
 id: 47,
 name: "Iron Legion",
 image: "images/ironlegionimage.jpg",
 slug: "ironlegion",
 gameUrl: "https://html5.gamemonetize.co/gkeofcoqengjzxlw0b09f2qrng35egbi/",
 tags: ["online", "action", "3D"],
 description: "Iron Legion puts you in command of a powerful tank in thrilling modern-era battles. Engage in intense online action as you strategize and outmaneuver opponents. Upgrade your vehicle and master its firepower to dominate the battlefield. Experience the excitement of commanding a formidable war machine in fast-paced combat."
 },
 {
 id: 48,
 name: "Narrow One",
 image: "images/narrowoneimage.jpg",
 slug: "narrowone",
 gameUrl: "https://narrow.one/",
 tags: ["online", "shooter", "multiplayer"],
 description: "Narrow.One is an engaging multiplayer archery game where teamwork is key. Protect your castle while aiming to capture the enemy’s flag. Use your bow and arrows strategically to outplay opponents. Coordinate with your team to achieve victory and dominate the battlefield."
 },
 {
 id: 49,
 name: "Hole IO",
 image: "images/holeioimage.jpg",
 slug: "holeio",
 gameUrl: "https://holeio.com/",
 tags: ["io", "online", "multiplayer"],
 description: "Hole.io is an arcade physics game. Control a black hole and devour everything in sight to grow bigger. Compete against other players in real time to consume the most and dominate the cityscape."
 },
 {
 id: 50,
 name: "Only Up! Parkour",
 image: "images/onlyup!parkourimage.jpg",
 slug: "onlyup!parkour",
 gameUrl: "https://html5.gamemonetize.co/x0hb11h9lq2347nqv2kvk4bycdlxm9eb/",
 tags: ["platformer", "parkour", "3d"],
 description: "Only Up! is a thrilling arcade game that challenges you to scale towering obstacles. Guide your character through a vertical labyrinth filled with tricky hazards. React quickly, jump precisely, and climb skillfully to avoid falling or hitting obstacles. As you advance, levels grow harder with moving platforms and rotating challenges, testing your agility and timing."
 },
 {
 id: 51,
 name: "Stair Race 3D",
 image: "images/stairrace3dimage.jpg",
 slug: "stairrace3d",
 gameUrl: "https://html5.gamemonetize.co/4zz6wv4zin8z8pqbeb7l0jrpf3gxhl19/",
 tags: ["3d", "runner", "platformer"],
 description: "Step into a competitive arena where stair-building skills determine the winner. Collect stair planks and strategically use them to climb to higher platforms. Face off against a variety of challenging opponents as you race to reach the top. Quick thinking and smart placement are key to outbuilding your rivals and claiming victory."
 },
 {
 id: 52,
 name: "BitLife",
 image: "images/bitlifeimage.jpg",
 slug: "bitlife",
 gameUrl: "https://html5.gamemonetize.co/sunlne8825d1006jux3b1xrl9vda49f1/",
 tags: ["clicker", "puzzle", "simulator"],
 description: "BitLife lets you create and live your own life story through choices big and small. Aim to be a model citizen by pursuing love, education, and family, or take a wilder path full of crime and adventure. Experience everything from falling in love to starting prison riots or smuggling goods. Every decision shapes your unique journey, so choose how your story unfolds."
 },
 {
 id: 53,
 name: "Moto X3M Winter",
 image: "images/motox3mwinterimage.jpg",
 slug: "motox3mwinter",
 gameUrl: "https://html5.gamemonetize.co/1gjwgvl2j0ipdd9ybezeavu04y1nqjen/",
 tags: ["levels", "bike", "racing"],
 description: "Moto X3M Winter is an adrenaline-filled stunt bike racing game. Navigate slippery, icy tracks packed with ramps, traps, and tricky obstacles. Perform flips and daring stunts while racing against the clock. Challenge yourself to complete each level as quickly as possible and master every course."
 },
 {
 id: 54,
 name: "Rocket Bot Royale",
 image: "images/rocketbotroyaleimage.jpg",
 slug: "rocketbotroyale",
 gameUrl: "https://rocketbotroyale2.winterpixel.io/",
 tags: ["action", "multiplayer", "adventure"],
 description: "Rocket Bot Royale is an action-packed tank battle game set on a destructible island. Control rocket-powered tanks to shoot, dodge, and outmaneuver opponents. Compete in fast-paced multiplayer matches where strategy and reflexes are key. Be the last bot standing to claim victory and dominate the battlefield."
 },
 {
 id: 55,
 name: "Slope 3",
 image: "images/slope3image.jpg",
 slug: "slope3",
 gameUrl: "https://slope3.com/",
 tags: ["io", "racing", "platformer"],
 description: "Slope 3 is a fast-paced endless runner. Guide a rolling ball down a neon slope while dodging obstacles and staying on track. The farther you go, the faster it gets—test your reflexes and survive as long as you can."
 },
 {
 id: 56,
 name: "Gulper IO",
 image: "images/gulperioimage.jpg",
 slug: "gulperio",
 gameUrl: "https://slither.io/",
 tags: ["io", "multiplayer", "action"],
 description: "Gulper.io is a snake-themed multiplayer game. Eat glowing orbs to grow your snake while avoiding others. Outsmart and trap opponents to climb the leaderboard and become the biggest snake on the map."
 },
 {
 id: 57,
 name: "Rocket League",
 image: "images/rocketleagueimage.jpg",
 slug: "rocketleague",
 gameUrl: "https://html5.gamemonetize.co/0c57ybsvhtn9xv77swrbiwgtreda0pal/",
 tags: ["racing", "sports", "online"],
 description: "Rocket League is an exhilarating sports game where players drive rocket-powered cars to hit a massive ball and score goals. Fast-paced matches demand speed, skill, and precise teamwork. Compete in futuristic arenas and pull off impressive maneuvers. Master both driving and strategy to dominate the game."
 },
 {
 id: 58,
 name: "Rise Up",
 image: "images/riseupimage.jpg",
 slug: "riseup",
 gameUrl: "https://html5.gamemonetize.co/5jwn8b2ufm7rdafdtnslr9cvioaoh76m/",
 tags: ["arcade", "strategy", "levels"],
 description: "Guide your shield with a single finger to keep your balloon safe. Navigate obstacles and clear a path as you ascend higher and higher. React quickly to avoid hazards and maintain your balloon’s safety. Challenge yourself to see how far you can climb.",
 }, 
 {
 id: 59,
 name: "Mr Racer",
 image: "images/mrracerimage.jpg",
 slug: "mrracer",
 gameUrl: "https://html5.gamemonetize.co/y34098moqvr8ueuddbb4vnwxmtorlq4i/",
 tags: ["racing", "cars", "levels"],
 description: "MR RACER - Car Racing is an exciting racing game that puts you behind the wheel of high-speed supercars. Dodge traffic and outpace rivals across thrilling tracks. Enjoy easy-to-control car mechanics and immerse yourself in fast-paced racing action. With multiple modes, including Challenge, Chase, and Career, plus 15 upgradable supercars, you can test your skills and become the ultimate racing legend.",
 },
 {
 id: 60,
 name: "Stick Duel Battle",
 image: "images/stickduelbattleimage.jpg",
 slug: "stickduelbattle",
 gameUrl: "https://html5.gamemonetize.co/dm15vv1aak9c1asfg49ji8s7iosbl6tu/",
 tags: ["2 player", "action", "stickman"],
 description: "Stick Duel Battle is a hilarious and action-packed stickman fighting game. Battle using realistic weapons and physics across a variety of maps, each demanding unique strategies. Play solo or challenge a friend in two-player mode. The first player to reach a score of five claims victory.",
 },
 {
 id: 61,
 name: "Gansta Duel",
 image: "images/ganstaduelimage.jpg",
 slug: "ganstaduel",
 gameUrl: "https://html5.gamemonetize.co/jxa2s8trml82jl1c2p52en3neqrob1b1/",
 tags: ["arcade", "action", "levels"], 
 description: "This action-packed game pits you against hordes of bots in thrilling battles. Advance through levels while upgrading your abilities to increase health and damage. Use creative moves like spinning enemies around to hit multiple opponents or delivering powerful uppercuts for heavy damage. Master your skills to dominate every fight and progress through challenging stages.",
 },
 {
 id: 62,
 name: "Power Slap",
 image: "images/powerslapimage.jpg",
 slug: "powerslap",
 gameUrl: "https://html5.gamemonetize.co/zmlw34hzwakgnkd2nrr1798aqp7xzu7y/",
 tags: ["arcade", "satisfying", "sports"], 
 description: "Power Slap is a thrilling slap battle game that tests your timing, reflexes, and precision. Compete in fast-paced duels and out-slap your opponents to climb the leaderboards. With easy one-tap controls, smooth animations, and addictive arcade gameplay, every match is intense. Unlock power-ups, upgrades, and special abilities to gain an advantage and dominate the competition.",
 },
 {
 id: 63,
 name: "Shadow Fights",
 image: "images/shadowfightsimage.jpg",
 slug: "shadowfights",
 gameUrl: "https://html5.gamemonetize.co/juebfqc8k4i9lp3yoki4uftvqt0ks6gb/",
 tags: ["2 player", "action", "adventure"],
 description: "The Shadow Fighters are ready for battle, but only one can emerge victorious! Move quickly, throw punches, and dodge incoming attacks. Play solo or challenge a friend in two-player mode. Step into the arena and fight through three intense rounds to claim victory.",
 },
 {
 id: 64,
 name: "Archer Hero",
 image: "images/archerheroimage.jpg",
 slug: "archerhero",
 gameUrl: "https://html5.gamemonetize.co/29wtfvf9jszoc8gibo9dms1f37htul8z/",
 tags: ["adventure", "levels", "action"],
 description: "Archer Hero Pro is an engaging game that challenges your archery skills to the fullest. Take on the role of a legendary hero defending your castle from relentless enemy waves. Use your bow and arrow with precision and agility to defeat foes. Face both hordes of foot soldiers and powerful siege engines in this action-packed adventure.",
 },
 {
 id: 65,
 name: "Jelly Run 2048",
 image: "images/jellyrun2048image.jpg",
 slug: "jellyrun2048",
 gameUrl: "https://html5.gamemonetize.co/y51x5nb673umhgqzva6jz2596cd57cqc/",
 tags: ["arcade", "2048", "runner"],
 description: "Jelly Run 2048 is a fun and challenging puzzle game that blends the classic 2048 number-merging concept with fast-paced parkour action. Swipe your jelly block left or right to navigate obstacles and link cubes together. Combine matching cubes to double their value and aim to reach 2048 or higher. Each collision with a same-number tile creates a bigger cube, keeping the gameplay exciting and strategic.",
 },
 {
 id: 66,
 name: "Winter Clash 3D",
 image: "images/winterclash3dimage.jpg",
 slug: "winterclash3d",
 gameUrl: "https://html5.gamemonetize.co/ya6quof6a1n40xzz3thz9xekh349abp8/",
 tags: ["shooter", "action", "multiplayer"],
 description: "This Christmas, mischievous elves are plotting to seize Santa’s secret base and summon the fearsome Baba Yaga, also known as the Pagan Idol. It’s up to you to stop them and defend the holiday spirit. Grab your weapons and face off in the action-packed team shooter Winter Clash 3D. Step into the role of a powerful Santa Claus and capture the Pagan Idol on a remote lighthouse island!",
 },
 {
 id: 67,
 name: "Stickman Sniper",
 image: "images/stickmansniperimage.jpg",
 slug: "stickmansniper",
 gameUrl: "https://html5.gamemonetize.co/pnu56ck5blbnesweiw2z1ule6o530x9e/",
 tags: ["shooter", "action", "stickman"],
 description: "These sniper games put your precision and stealth to the ultimate test. Step into the shoes of an elite marksman, using your skills to remain unseen while taking out targets from afar. Carefully plan each shot, observe enemy movements, and strike before you’re detected. Only the sharpest shooters can complete the mission and dominate the battlefield.",
 },   
 {
 id: 68,
 name: "American 18 Wheeler Truck Sim",
 image: "images/american18wheelertrucksimimage.jpg",
 slug: "american18wheelertrucksim",
 gameUrl: "https://html5.gamemonetize.co/iktjgjwxwy2kwttz3yml4av97010fgwy/",
 tags: ["cars", "levels", "simulator"],
 description: "If you’re a fan of truck driving games, American 18 Wheeler Truck Sim Games 2021 is made for you. Experience the thrill of navigating heavy loads through challenging terrains and unpredictable weather. Test your skills on steep mountains, winding roads, and rugged landscapes as you deliver cargo safely. Master the 18-wheeler simulator, complete your deliveries, and become the ultimate truck driving pro!",
 },  
 {
 id: 69,
 name: "Billard 8 Ball Pool",
 image: "images/billard8ballpoolimage.jpg",
 slug: "billard8ballpool",
 gameUrl: "https://html5.gamemonetize.co/jf2a06o1z5ezy7stb7c4lmm13syg12yk/",
 tags: ["sports", "arcade", "strategy"],
 description: "This popular version of billiards challenges players to pocket all the balls from their assigned group—either “solid” or “striped.” After clearing your set, the ultimate goal is to sink the 8-ball to claim victory. Strategy and precision are key to outsmarting your opponent. The first player to complete these steps wins the game and takes the title!",
 }, 
 {
 id: 70,
 name: "Flip Master",
 image: "images/flipmasterimage.jpg",
 slug: "flipmaster",
 gameUrl: "https://html5.gamemonetize.co/t5h6lmvu96x7kk5bj6v5n6999o7mf9f1/",
 tags: ["3d", "levels", "parkour"],
 description: "Flip Master puts you in the center of thrilling acrobatics and high-flying parkour action. Pull off jaw-dropping flips, daring tricks, and navigate tricky obstacles with precision. Master your jumps, control your character mid-air, and stick every landing perfectly. Level up your skills, unlock new arenas, and prove you have what it takes to be the ultimate flip champion!",
 },
 {
 id: 71,
 name: "Curvy Punch 2",
 image: "images/curvypunch2image.jpg",
 slug: "curvypunch2",
 gameUrl: "https://html5.gamemonetize.co/us0l69i6kfvo5wa3a2skvifjmcmhj8t6/",
 tags: ["sports", "action", "levels"],
 description: "Get ready for the wackiest punch battle around in Curvy Punch, a 3D action-fighting game full of laughs and chaos. Swing your fists in wild, curving punches to take down your opponents in the most unpredictable ways. Dodge obstacles, land perfect hits, and even pull off backflips to stay one step ahead. Every punch is a mix of strategy and silliness—can you master the madness?",
 },
 {
 id: 72,
 name: "2048 Legend",
 image: "images/2048legendimage.jpg",
 slug: "2048legend",
 gameUrl: "https://html5.gamemonetize.co/iqv0wswiozpaxs6s7rdtqdj24ibdrgsa/",
 tags: ["2048", "arcade", "strategy"],
 description: "2048 is a fun and addictive puzzle game where you combine matching numbers to reach higher values. While the rules are straightforward, mastering it can be surprisingly tricky. Each move requires strategy and careful planning to maximize your score. If you haven’t tried this modern classic yet, now’s the perfect time to put your skills to the test!",
 },
 {
 id: 73,
 name: "Rider Online Pro",
 image: "images/rideronlineproimage.jpg",
 slug: "rideronlinepro",
 gameUrl: "https://html5.gamemonetize.co/xqxcsqazsozjzy71jb1hn0a54dorg91d/",
 tags: ["bike", "arcade", "endless"],
 description: "Get ready for thrilling stunts and nonstop action in Rider! Hop on your motorcycle and spin, flip, and perform daring tricks through an endless, dynamic world. Collect diamonds to unlock new bikes, master combos, and aim for the highest scores. Play Rider Online for free and enjoy endless fun and excitement!",
 }, 
 {
 id: 74,
 name: "Sniper Simulator",
 image: "images/snipersimulatorimage.jpg",
 slug: "snipersimulator",
 gameUrl: "https://html5.gamemonetize.co/ote0vnkghfmoz4n40ifk5isr27q9f5qj/",
 tags: ["shooter", "simulator", "levels"],
 description: "Sniper Simulator is a first-person shooting game that puts you in the role of a skilled sniper, handling a variety of classic rifles for realistic training. The game includes an engaging assembly feature, letting players experience the thrill of putting together their weapons while taking precise shots. Easy-to-use controls, stunning visuals, and lifelike sound effects enhance the immersive experience. With realistic gun textures and environments, every shot feels authentic, offering a true-to-life sniper simulation.",
 },
 {
 id: 75,
 name: "Boat Rescue",
 image: "images/boatrescueimage.jpg",
 slug: "boatrescue",
 gameUrl: "https://html5.gamemonetize.co/dlnizm1qjw53qkx4t9kdv0prsp27jdxx/",
 tags: ["racing", "action", "levels"],
 description: "American Boat Rescue Simulator puts you in charge of saving people from dangerous waters across a variety of island locations. Complete 100 challenging missions, each requiring skill and quick thinking to reach those in need. Earn points to upgrade your boat, making it faster, stronger, and more stylish as you progress. Track your achievements in the menu and strive to complete them all while enjoying the thrilling rescue experience.",
 },
 {
 id: 76,
 name: "Momo Horror Story",
 image: "images/momohorrorstoryimage.jpg",
 slug: "momohorrorstory",
 gameUrl: "https://html5.gamemonetize.co/5fv1qjs4y57ltbk9q74zpteyeq3p6mob/",
 tags: ["horror", "action", "shooter"],
 description: "Momo is a chilling horror game inspired by the legend of the mysterious messaging figure, Momo. Players take on the role of someone who has contacted Momo and must now survive being hunted by the terrifying creature. Complete tasks like turning on generators, finding keys, and securing windows to stay alive until the timer hits zero, when the police arrive to rescue you. The game offers two modes—Classic and Gun—adding different challenges to your fight for survival.",
 }, 
 {
 id: 77,
 name: "Bus Simulator",
 image: "images/bussimulatorimage.jpg",
 slug: "bussimulator",
 gameUrl: "https://html5.gamemonetize.co/dubea73z3y8yy37n10vzmubrovaolu7b/",
 tags: ["racing", "action", "simulator"],
 description: "Bus Simulator puts you in the driver’s seat of a city bus, where your job is to follow scheduled routes and transport passengers safely. Navigate busy streets, obey traffic rules, and adapt to realistic urban traffic patterns. Face changing weather conditions and challenging road layouts that test your driving skills. Experience the daily life of a bus driver while keeping passengers happy and on time.",
 },
  {
 id: 78,
 name: "Stickman Ghost Online",
 image: "images/stickmanghostonlineimage.jpg",
 slug: "stickmanghostonline",
 gameUrl: "https://html5.gamemonetize.co/qsd2h427rg6z6gza2xekqsdwgk1dwksa/",
 tags: ["stickman", "online", "action"],
 description: "Step into Stickman City and fight to become the last surviving ghost among your rivals. Explore diverse locations and unleash a variety of powerful weapons, chaining combos to defeat enemies and face the ultimate bosses. Collect coins to upgrade your character with new weapons, skills, movements, and skins, enhancing your chances of survival. Your mission is to guide the brave stickman through each level, taking down relentless ninja opponents and saving the city from the evil Stickmans.",
 },
 {
 id: 79,
 name: "Bird Simulator",
 image: "images/birdsimulatorimage.jpg",
 slug: "stickmanghostonline",
 gameUrl: "https://html5.gamemonetize.co/v0ap03gz77p5idffw3d94p8vql3pg23b/",
 tags: ["simulator", "3d", "animal"],
 description: "Bird Simulator lets you take flight as a bird in a vibrant forest, exploring treetops, rivers, and open skies. Hunt for food, build nests, and care for your young while interacting with other wildlife. Avoid natural hazards and predators as you navigate the challenges of the wild. Experience the freedom of flight and the thrill of surviving in a realistic woodland ecosystem.",
 },
 {
 id: 80,
 name: "Nightwalkers IO",
 image: "images/nightwalkersioimage.jpg",
 slug: "nightwalkersio",
 gameUrl: "https://html5.gamemonetize.co/99mi8patiemjg6ns0m4apjv6p92csyt2/",
 tags: ["io", "online", "action"],
 description: "Nightwalkers.io, or simply Nightwalkers, is a free co-op browser game from JeFawk Games that puts you in the middle of a zombie apocalypse. Survive unique challenges like Apocalypses and the Noise system that draws zombies toward you. Team up with friends to build an impenetrable base, gather resources, craft weapons, and battle endless waves of the undead—or just relax and chat with the 1,000+ daily players. However you play, the goal remains the same: survive, thrive, and take down as many zombies as possible!",
 },
 {
 id: 81,
 name: "Night Racing",
 image: "images/nightracingimage.jpg",
 slug: "nightracing",
 gameUrl: "https://html5.gamemonetize.co/vpyg4xx30zcxx3sv2p8ke2ws7bvwg08v/",
 tags: ["racing", "cars", "action"],
 description: "Experience the thrill of high-speed nighttime racing through a vibrant, neon-lit city. Step into the driver’s seat of a powerful sports car and take on daring challenges that test your skills. Complete missions, perform stunts, and outsmart the police as you blaze through the streets. Earn rewards to unlock faster, more powerful cars and prove yourself as the ultimate street racer.",
 },
 {
 id: 82,
 name: "Deep Space Horror Outpost",
 image: "images/deepspacehorroroutpostimage.jpg",
 slug: "deepspacehorroroutpost",
 gameUrl: "https://html5.gamemonetize.co/zyq2hd8j0nld46fklqgj0cyacbpo09mn/",
 tags: ["horror", "action", "shooter"],
 description: "Your space cruiser has run out of energy, and the only hope is a remote Deep Space Outpost. To continue your journey, you must find and collect 8 crucial Energy Cells. But the abandoned station isn’t as safe as it seems—humans are gone, and something else lurks in the shadows. Dangerous and relentless, this bloodthirsty presence will test your courage at every turn.",
 },
 {
 id: 83,
 name: "Zombie Escape",
 image: "images/zombieescapeimage.jpg",
 slug: "zombieescape",
 gameUrl: "https://html5.gamemonetize.co/ifcdrnwla32frs6rgrw3ulbbgnip63qq/",
 tags: ["horror", "action", "puzzle"],
 description: "Enter Zombie Escape Horror Factory, where a world overrun by zombies tests your survival skills. Join forces with teammates to repair critical generators that hold the key to escaping alive. Every shadow hides a threat, and every step could be your last, keeping fear at the forefront. Will you survive the onslaught long enough to complete the mission and break free from the nightmare?",
 },
 {
 id: 84,
 name: "Escape Your Birthday",
 image: "images/escapeyourbirthdayimage.jpg",
 slug: "escapeyourbirthday",
 gameUrl: "https://html5.gamemonetize.co/karmfagd29qbrrs3vznumevkjw1vjzlz/",
 tags: ["horror", "action", "puzzle"],
 description: "It’s your birthday, but something is terribly wrong. You awaken in a locked room with only a cake, a candle, and an unsettling silence surrounding you. What seems like a celebration quickly turns into a sinister puzzle where every object may hold a clue. Search the room, solve the mystery, and escape—before the party takes a darker turn.",
 }, 
 {
 id: 85,
 name: "Mirage Online Classic",
 image: "images/mirageonlineclassicimage.jpg",
 slug: "mirageonlineclassic",
 gameUrl: "https://play.mirageonlineclassic.com/?_gl=1*1lkikim*_ga*MjEzNjk4OTUyNy4xNzU0Nzg5Mjcx*_ga_9Z6N2DZBSW*czE3NTQ3ODkyNzAkbzEkZzAkdDE3NTQ3ODkyNzAkajYwJGwwJGgw",
 tags: ["multiplayer", "adventure", "online"],
 description: "Mirage Online Classic is a retro-style MMORPG where you explore a vast fantasy world, battle monsters, complete quests, gather loot, and interact with other players while steadily leveling up your skills, equipment, and abilities.",
 }, 
 {
 id: 86,
 name: "Gang Fall Party",
 image: "images/gangfallpartyimage.jpg",
 slug: "gangfallparty",
 gameUrl: "https://html5.gamemonetize.co/i7uarc0zpakotfo600u3t1j18vdzan26/",
 tags: ["io", "action", "2 player"],
 description: "Gang Fall Party throws you into chaotic online brawls where the goal is simple—knock your rivals off the stage with powerful punches. Battles take place on high platforms, and every hit brings you closer to victory or a dramatic fall. Play solo, challenge a friend in 1v1, or team up in 2 Player mode to take on dozens of opponents in the fast-paced Vs All mode. Each match pits you against up to 16–17 fighters, making every round unpredictable and full of action.",
 }, 
 {
 id: 87,
 name: "Trial Bike Racing Clash",
 image: "images/trialbikeracingclashimage.jpg",
 slug: "trialbikeracingclash",
 gameUrl: "https://html5.gamemonetize.co/vqfqbnwpjpv5t77qupxckrz953obu9wd/",
 tags: ["bike", "multiplayer", "2 player"],
 description: "Trial Bike Racing Clash kicks off an adrenaline-packed stunt racing adventure where daring riders take on extreme tracks. Face dangerous courses across multiple zones, pushing your skills to the limit with high-speed tricks and precision control. Play solo or challenge a friend in 1 Player or 2 Player modes, testing yourself in both missions and skill-based races. With customizable bikes, unique riders, and a variety of thrilling levels, the competition never stops.",
 },
 {
 id: 88,
 name: "Slenderman Lost at School",
 image: "images/slendermanlostatschoolimage.jpg",
 slug: "slendermanlostatschool",
 gameUrl: "https://html5.gamemonetize.co/24gnovw92p6d8dz6lr9jg0sp3ug9xrmd/",
 tags: ["horror", "3d", "puzzle"],
 description: "Slenderman Lost at School drops you into a creepy, abandoned campus haunted by the legendary Slenderman. To survive, you’ll need to search the halls for clues, gather items, and solve puzzles that open the path to freedom. Blending stealth, suspense, and strategy, the game keeps tension high as you creep through shadowy corridors and avoid Slenderman’s deadly stare. Every corner hides a secret—and only sharp instincts will help you escape before it’s too late.",
 },
 {
 id: 89,
 name: "Stickman Sports Badminton",
 image: "images/stickmansportsbadmintonimage.jpg",
 slug: "stickmansportsbadminton",
 gameUrl: "https://html5.gamemonetize.co/c6zx75jasrpsm0b6a4utgps07dxhs3h5/",
 tags: ["sports", "stickman", "2 player"],
 description: "Stickman Sports Badminton brings quirky characters together for a fast and fun badminton showdown. With realistic shuttle physics, exciting power-ups like giant rackets, fire smashes, and speed boosts—alongside tricky debuffs that slow you down—the action stays fresh and unpredictable. Play solo or challenge a friend in 1v1 matches, with options for Normal or Hard difficulty when facing the CPU. Customize your match length with 5, 7, or 9 sets and prove who truly rules the court!",
 },
{
 id: 90,
 name: "Command Strike FPS",
 image: "images/commandstrikefpsimage.jpg",
 slug: "commandstrikefps",
 gameUrl: "https://html5.gamemonetize.co/fiogowuzog6jowbgvabdxrcqaub4cubc/",
 tags: ["shooter", "action", "multiplayer"],
 description: "Command Strike FPS delivers high-speed first-person shooting with both offline and online action across diverse, well-designed maps. Choose from modes like Deathmatch, Team Deathmatch, Free-for-All, Flag Capture, or Mission Mode, each offering unique tactical challenges and nonstop firefights. With an arsenal of weapons, explosives, and gear at your disposal, you’ll step into the boots of an elite soldier and fight to dominate every battle.",
 },
{
 id: 91,
 name: "Zombie Survival 2",
 image: "images/zombiesurvival2image.jpg",
 slug: "zombiesurvival2",
 gameUrl: "https://html5.gamemonetize.co/83siph0wqz04p8mp137w5uch7vk5t0nu/",
 tags: ["adventure", "action", "strategy"],
 description: "Step into Zombie Survival 2, a relentless fight for life where danger waits in every shadow. Explore ruined cities, haunted woods, and empty backstreets to gather precious supplies—from crude weapons and crossbows to vital medkits—while carefully managing what lasts and what breaks. Use over 20 craftable upgrades, from gear and weapons to traps, to push back endless hordes and towering bosses that test both strategy and courage. Strengthen your base, balance your inventory, and see how long you can endure against the rising tide of the undead.",
 },
{
 id: 92,
 name: "Silent Fear",
 image: "images/silentfearimage.jpg",
 slug: "silentfear",
 gameUrl: "https://html5.gamemonetize.co/kl1jn8oiq2ah7pzb9n3oxnco25smwc2b/",
 tags: ["horror", "action", "runner"],
 description: "Silent Fear plunges you into a terrifying world where danger lurks in the dark and even the faintest noise can betray you. With nothing but makeshift tools—a saw, a phone, and a shattered gun barrel—you must survive against twisted creatures that stalk everything living. The infected hunt with unrelenting persistence, forcing you to think fast and act smarter. As humanity’s last hope, survival comes down to every heartbeat, every step, and every desperate choice.",
 },
{
 id: 93,
 name: "Save the Dummy",
 image: "images/savethedummyimage.jpg",
 slug: "savethedummy",
 gameUrl: "https://html5.gamemonetize.co/rrcjjjeau91stfs3fcoopnr101g1awgh/",
 tags: ["drawing", "puzzle", "strategy"],
 description: "Save the Dummy is a lighthearted physics puzzle game where you must rescue a floppy ragdoll from odd traps and tricky setups. Every stage asks you to interact with ropes, platforms, and obstacles to set off reactions that guide the dummy to safety. The mix of creative problem-solving and unpredictable physics keeps the gameplay fun and engaging. Each completed puzzle rewards you with a mix of humor and satisfaction.",
 },
{
 id: 94,
 name: "Slowroads IO",
 image: "images/slowroadsioimage.jpg",
 slug: "slowroadsio",
 gameUrl: "https://slowroads.io/",
 tags: ["cars", "io", "racing"],
 description: "Slow Roads is a relaxing driving simulation where you cruise endlessly along procedurally generated roads that stretch through calm, scenic landscapes. With no goals or finish lines, the game focuses on the meditative joy of the journey itself, letting you enjoy the freedom of the open road. Customizable settings like weather, time of day, and even an autodrive option make every drive a unique and soothing escape.",
 },
{
 id: 95,
 name: "Slope",
 image: "images/slopeimage.jpg",
 slug: "slope",
 gameUrl: "https://ubggo.github.io/ub-games/slope/",
 tags: ["io", "platformer", "runner"],
 description: "Race a neon ball down an endless, gravity-defying slope where reflexes are your only ally. Dodge sharp turns, treacherous platforms, and glowing obstacles as your speed climbs into adrenaline territory. Every run is a fresh test of focus—how far can you push the limits before the track claims you?",
 },
{
 id: 96,
 name: "Snow Rider 3D",
 image: "images/snowrider3dimage.jpg",
 slug: "snowrider3d",
 gameUrl: "https://ubggo.github.io/ub-games/snowrider3d/",
 tags: ["runner", "sports", "endless"],
 description: "Strap in and shred icy slopes at breathtaking speed, weaving through trees, rocks, and frosty obstacles in a high-octane downhill thrill ride. Collect gifts along the way to boost your score and unlock sleek new sleds that keep the runs feeling fresh. With smooth 3D visuals and responsive controls, every descent becomes a wintry rush you won’t want to end.",
 },
{
 id: 97,
 name: "Retro Bowl",
 image: "images/retrobowlimage.jpg",
 slug: "retrobowl",
 gameUrl: "https://ubggo.github.io/ub-games/retrobowl/",
 tags: ["runner", "sports", "endless"],
 description: "Strap in and shred icy slopes at breathtaking speed, weaving through trees, rocks, and frosty obstacles in a high-octane downhill thrill ride. Collect gifts along the way to boost your score and unlock sleek new sleds that keep the runs feeling fresh. With smooth 3D visuals and responsive controls, every descent becomes a wintry rush you won’t want to end.",
 },
{
 id: 98,
 name: "Basketball Line",
 image: "images/basketballlineimage.jpg",
 slug: "basketballline",
 gameUrl: "https://html5.gamemonetize.co/q3kmzjunadtxkw3c55y3465ru3m9vknq/",
 tags: ["basketball", "sports", "drawing"],
 description: "Basketball Line is a creative puzzle game where you draw lines to guide the falling ball into the hoop. Time your drawings carefully to ensure a perfect shot. Watch out for bombs that can ruin your play. Keep drawing and dunking to score big!",
 },
{
 id: 98,
 name: "Classic Car Parking",
 image: "images/classiccarparkingimage.jpg",
 slug: "classiccarparking",
 gameUrl: "https://html5.gamemonetize.co/h2756112zb490g5tjjpoq6av147lo7i7/",
 tags: ["cars", "levels", "puzzle"],
 description: "Classic Car Parking is a realistic driving game that puts your precision and control to the test. Take the wheel of vintage cars and carefully maneuver through tight spaces, narrow paths, and challenging obstacles. Each mission requires perfect parking without collisions. It’s more than just gameplay—it’s a true challenge of skill and patience.",
 },
{ 
 id: 99, 
 name: "Pop the Bubbles",
 image: "images/popthebubblesimage.jpg",
 slug: "popthebubbles",
 gameUrl: "https://html5.gamemonetize.co/s7e6xmuq8kwidnku964f8072hflua90i/",
 tags: ["satisfying", "levels", "puzzle"],  
 description: "This relaxing bubble-popping game is the perfect way to unwind after a busy day. Enjoy vibrant colors, soothing music, and endless levels designed to melt away stress. With simple gameplay and a calming atmosphere, it offers the ideal mix of fun and relaxation. Jump in now and experience a peaceful escape filled with lighthearted enjoyment!",
}
];  

// Make games database globally accessible
window.gamesDatabase = gamesDatabase;
window.allGamesDatabase = gamesDatabase; // Fallback for old format

// Game loader functionality for individual game pages
class GameLoader {
 constructor() {
 this.currentGame = null;
 this.init();
 }

 init() {
 // Get game slug from URL parameter
 const urlParams = new URLSearchParams(window.location.search);
 const gameSlug = urlParams.get('game');
 
 if (gameSlug) {
 this.loadGame(gameSlug);
 } else {
 this.showError('No game specified');
 }

 this.setupEventListeners();
 }

 loadGame(slug) {
 // Find game by slug
 const game = gamesDatabase.find(g => g.slug === slug);
 
 if (!game) {
 this.showError('Game not found');
 return;
 }

 this.currentGame = game;
 this.displayGame(game);
 this.loadRelatedGames(game);
 this.setupVotingSystem(game);
 }

 displayGame(game) {
 // Update page title
 document.title = `${game.name} - InfinitePixels`;
 const pageTitle = document.getElementById('pageTitle');
 if (pageTitle) pageTitle.textContent = `${game.name} - InfinitePixels`;

 // Update game iframe
 const gameFrame = document.getElementById('gameFrame');
 if (gameFrame) {
 gameFrame.src = game.gameUrl;
 gameFrame.title = game.name;
 }

 // Update game title
 const gameTitle = document.getElementById('gameTitle');
 if (gameTitle) gameTitle.textContent = game.name;

 // Update description
 const gameDescription = document.getElementById('gameDescription');
 if (gameDescription) gameDescription.textContent = game.description;

 // Update tags
 const genresContainer = document.getElementById('gameGenres');
 if (genresContainer) {
 genresContainer.innerHTML = '';
 game.tags.forEach(tag => {
 const tagElement = document.createElement('span');
 tagElement.className = 'genre-tag';
 tagElement.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
 genresContainer.appendChild(tagElement);
 });
 }

 // Update share link
 const shareLink = document.getElementById('shareLink');
 if (shareLink) {
 shareLink.value = `${window.location.origin}/game.html?game=${game.slug}`;
 }
 }

 loadRelatedGames(currentGame) {
 const container = document.getElementById('relatedGamesContainer');
 if (!container) return;
 
 // Find games with similar tags
 const relatedGames = gamesDatabase
 .filter(game => 
 game.id !== currentGame.id && 
 game.tags.some(tag => currentGame.tags.includes(tag))
 )
 .slice(0, 6);

 // If not enough related games, add random games
 if (relatedGames.length < 6) {
 const additionalGames = gamesDatabase
 .filter(game => 
 game.id !== currentGame.id && 
 !relatedGames.includes(game)
 )
 .sort(() => 0.5 - Math.random())
 .slice(0, 6 - relatedGames.length);
 
 relatedGames.push(...additionalGames);
 }

 // Display related games
 container.innerHTML = '<h3>Related Games</h3>';
 
 relatedGames.forEach(game => {
 const gameElement = document.createElement('div');
 gameElement.className = 'related-game-item';
 gameElement.innerHTML = `
 <img src="../${game.image}" alt="${game.name}" loading="lazy">
 <div class="game-info">
 <h4>${game.name}</h4>
 <div class="game-tags">
 ${game.tags.slice(0, 2).map(tag => 
 `<span class="tag">${tag}</span>`
 ).join('')}
 </div>
 </div>
 `;
 gameElement.addEventListener('click', () => {
 window.location.href = `game.html?game=${game.slug}`;
 });
 container.appendChild(gameElement);
 });
 }

 setupVotingSystem(game) {
 const thumbsUpBtn = document.getElementById('thumbsUpBtn');
 const thumbsDownBtn = document.getElementById('thumbsDownBtn');
 const floatingThumbs = document.getElementById('floatingThumbs');
 const voteLock = document.getElementById('voteLock');

 if (!thumbsUpBtn || !thumbsDownBtn) return;

 // Use game-specific storage key
 const voteKey = `${game.slug}Voted`;
 let voted = sessionStorage.getItem(voteKey) === '1';

 const createFloatingThumbs = (type, originBtn) => {
 if (!floatingThumbs) return;
 floatingThumbs.innerHTML = '';
 const count = 7;
 
 for (let i = 0; i < count; i++) {
 const el = document.createElement('span');
 el.className = 'floating-thumb';
 el.innerHTML = type === 'up'
 ? '<i class="fas fa-thumbs-up"></i>'
 : '<i class="fas fa-thumbs-down"></i>';
 
 el.style.fontSize = '1em';
 el.style.opacity = '0.85';
 el.style.color = type === 'up' ? '#4CAF50' : '#e74c3c';
 el.style.position = 'absolute';
 el.style.pointerEvents = 'none';
 
 const angle = Math.random() * 2 * Math.PI;
 const distance = 40 + Math.random() * 30;
 const x = Math.cos(angle) * distance;
 const y = Math.sin(angle) * distance * (type === 'up' ? -1 : 1);
 const delay = Math.random() * 0.15;
 
 let startX = 0, startY = 0;
 if (type === 'down' && originBtn && floatingThumbs) {
 const parentRect = originBtn.parentElement.getBoundingClientRect();
 const btnRect = originBtn.getBoundingClientRect();
 startX = btnRect.left - parentRect.left + btnRect.width / 2 - 14;
 startY = btnRect.top - parentRect.top + btnRect.height / 2 - 14;
 } else if (floatingThumbs) {
 startX = floatingThumbs.offsetWidth / 2;
 startY = floatingThumbs.offsetHeight / 2;
 }
 
 el.style.left = type === 'down' ? `${startX}px` : '50%';
 el.style.top = type === 'down' ? `${startY}px` : '50%';
 el.style.transform = 'translate(-50%, -50%)';
 el.style.animation = type === 'up'
 ? `thumbsUpFloatSmall 1.1s ${delay}s cubic-bezier(.4,1.4,.7,1) forwards`
 : `thumbsDownFloatSmall 1.1s ${delay}s cubic-bezier(.4,1.4,.7,1) forwards`;
 el.style.setProperty('--x', `${x}px`);
 el.style.setProperty('--y', `${y}px`);
 
 floatingThumbs.appendChild(el);
 }
 
 setTimeout(() => {
 if (floatingThumbs) floatingThumbs.innerHTML = '';
 }, 1300);
 };

 const lockVoting = () => {
 thumbsUpBtn.disabled = true;
 thumbsDownBtn.disabled = true;
 if (voteLock) {
 voteLock.style.display = 'flex';
 voteLock.style.animation = 'voteLockPop 0.5s cubic-bezier(.4,1.4,.7,1)';
 }
 };

 // On load, show lock if already voted
 if (voted) {
 lockVoting();
 }

 [thumbsUpBtn, thumbsDownBtn].forEach(btn => {
 btn.addEventListener('mousedown', () => btn.style.transform = 'scale(0.92)');
 btn.addEventListener('mouseup', () => btn.style.transform = '');
 btn.addEventListener('mouseleave', () => btn.style.transform = '');
 });

 thumbsUpBtn.addEventListener('click', function() {
 if (voted) return;
 lockVoting();
 createFloatingThumbs('up', thumbsUpBtn);
 sessionStorage.setItem(voteKey, '1');
 voted = true;
 });

 thumbsDownBtn.addEventListener('click', function() {
 if (voted) return;
 lockVoting();
 createFloatingThumbs('down', thumbsDownBtn);
 sessionStorage.setItem(voteKey, '1');
 voted = true;
 });
 }

 setupEventListeners() {
 // Share functionality
 const shareBtn = document.getElementById('shareBtn');
 const shareModal = document.getElementById('shareModal');
 const closeModal = document.getElementById('closeModal');
 const copyBtn = document.getElementById('copyBtn');
 const shareMessage = document.getElementById('shareMessage');

 if (shareBtn && shareModal) {
 shareBtn.addEventListener('click', () => {
 shareModal.style.display = 'flex';
 });
 }

 if (closeModal && shareModal) {
 closeModal.addEventListener('click', () => {
 shareModal.style.display = 'none';
 });
 }

 if (copyBtn) {
 copyBtn.addEventListener('click', () => {
 const shareLink = document.getElementById('shareLink');
 if (shareLink) {
 shareLink.select();
 document.execCommand('copy');
 if (shareMessage) {
 shareMessage.style.display = 'block';
 setTimeout(() => {
 shareMessage.style.display = 'none';
 }, 2000);
 }
 }
 });
 }

 // Fullscreen functionality
 const fullscreenBtn = document.getElementById('fullscreenBtn');
 const gameContainer = document.getElementById('gameContainer');

 if (fullscreenBtn && gameContainer) {
 fullscreenBtn.addEventListener('click', () => {
 if (gameContainer.requestFullscreen) {
 gameContainer.requestFullscreen();
 } else if (gameContainer.webkitRequestFullscreen) {
 gameContainer.webkitRequestFullscreen();
 } else if (gameContainer.msRequestFullscreen) {
 gameContainer.msRequestFullscreen();
 }
 });
 }

 // Close modal when clicking outside
 window.addEventListener('click', (e) => {
 const shareModal = document.getElementById('shareModal');
 if (shareModal && e.target === shareModal) {
 shareModal.style.display = 'none';
 }
 });
 }

 showError(message) {
 const gameTitle = document.getElementById('gameTitle');
 const gameDescription = document.getElementById('gameDescription');
 const gameFrame = document.getElementById('gameFrame');
 
 if (gameTitle) gameTitle.textContent = 'Error';
 if (gameDescription) gameDescription.textContent = message;
 if (gameFrame) gameFrame.style.display = 'none';
 }
}

// All Games Management System - Updated to match new CSS classes with A-Z sorting (No Descriptions)
class AllGamesManager {
    constructor() {
        // Use enhanced games database with fallback to old format
        this.gamesList = window.gamesDatabase || window.allGamesDatabase || [];
        // Sort games alphabetically by name on initialization
        this.gamesList.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        this.filteredGamesList = [...this.gamesList];
        this.currentPageNumber = 1;
        this.itemsPerPage = 24;
        this.selectedFilterTags = new Set();
        this.currentSearchTerm = '';
        
        console.log('AllGamesManager initialized with', this.gamesList.length, 'games (sorted A-Z)');
        this.initializeAllGamesPage();
    }
    
    initializeAllGamesPage() {
        this.setupAllEventHandlers();
        this.createFilterTagsDisplay();
        this.renderGameCards();
        this.renderPaginationControls();
        this.updateGameCountDisplay();
    }

    setupAllEventHandlers() {
        // Search functionality - updated to match new CSS classes
        const searchInputField = document.querySelector('.main-search-input');
        const clearSearchButton = document.querySelector('.input-clear-button');
        
        if (searchInputField) {
            searchInputField.addEventListener('input', (e) => {
                this.currentSearchTerm = e.target.value.toLowerCase();
                this.applyFiltersAndSearch();
                this.toggleSearchClearVisibility();
            });
        }
        
        if (clearSearchButton) {
            clearSearchButton.addEventListener('click', () => {
                if (searchInputField) {
                    searchInputField.value = '';
                    this.currentSearchTerm = '';
                    this.applyFiltersAndSearch();
                    this.toggleSearchClearVisibility();
                    searchInputField.focus();
                }
            });
        }
        
        // Filter functionality - updated to match new CSS classes
        const tagFilterButton = document.querySelector('.primary-filter-toggle');
        const filterOptionsPanel = document.querySelector('.dropdown-filters-menu');
        const resetFiltersButton = document.querySelector('.clear-all-filters-btn');
        
        if (tagFilterButton && filterOptionsPanel) {
            tagFilterButton.addEventListener('click', (e) => {
                e.stopPropagation();
                filterOptionsPanel.classList.toggle('active');
                tagFilterButton.classList.toggle('active');
            });
        }
        
        document.addEventListener('click', (e) => {
            if (filterOptionsPanel && tagFilterButton) {
                if (!filterOptionsPanel.contains(e.target) && !tagFilterButton.contains(e.target)) {
                    filterOptionsPanel.classList.remove('active');
                    tagFilterButton.classList.remove('active');
                }
            }
        });
        
        if (resetFiltersButton) {
            resetFiltersButton.addEventListener('click', () => {
                this.selectedFilterTags.clear();
                this.refreshFilterTagsDisplay();
                this.applyFiltersAndSearch();
            });
        }
    }

    toggleSearchClearVisibility() {
        const clearSearchButton = document.querySelector('.input-clear-button');
        const searchInputField = document.querySelector('.main-search-input');
        
        if (clearSearchButton && searchInputField) {
            if (searchInputField.value.length > 0) {
                clearSearchButton.classList.add('visible');
            } else {
                clearSearchButton.classList.remove('visible');
            }
        }
    }
    
    createFilterTagsDisplay() {
        const uniqueTagsSet = new Set();
        this.gamesList.forEach(gameItem => {
            if (gameItem.tags) {
                gameItem.tags.forEach(tagName => uniqueTagsSet.add(tagName));
            }
        });
        
        const filterTagsContainer = document.querySelector('.filter-tags-collection');
        if (!filterTagsContainer) return;
        
        filterTagsContainer.innerHTML = '';
        
        Array.from(uniqueTagsSet).sort().forEach(tagName => {
            const tagElement = document.createElement('div');
            tagElement.className = 'clickable-filter-tag';
            tagElement.innerHTML = `
                <span class="tag-name">${tagName.charAt(0).toUpperCase() + tagName.slice(1)}</span>
                <span class="tag-count">(${this.getTagCount(tagName)})</span>
            `;
            tagElement.addEventListener('click', () => this.handleFilterTagToggle(tagName, tagElement));
            filterTagsContainer.appendChild(tagElement);
        });
    }
    
    getTagCount(tag) {
        return this.gamesList.filter(game => 
            game.tags && game.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        ).length;
    }
    
    handleFilterTagToggle(tagName, tagElement) {
        if (this.selectedFilterTags.has(tagName)) {
            this.selectedFilterTags.delete(tagName);
            tagElement.classList.remove('active');
        } else {
            this.selectedFilterTags.add(tagName);
            tagElement.classList.add('active');
        }
        
        this.applyFiltersAndSearch();
    }
    
    refreshFilterTagsDisplay() {
        const filterTagOptions = document.querySelectorAll('.clickable-filter-tag');
        filterTagOptions.forEach(tagElement => {
            const tagText = tagElement.querySelector('.tag-name').textContent.toLowerCase();
            if (this.selectedFilterTags.has(tagText)) {
                tagElement.classList.add('active');
            } else {
                tagElement.classList.remove('active');
            }
        });
    }
    
    applyFiltersAndSearch() {
        this.filteredGamesList = this.gamesList.filter(gameItem => {
            // Search filter logic - removed description searching
            const matchesSearchQuery = this.currentSearchTerm === '' || 
                gameItem.name.toLowerCase().includes(this.currentSearchTerm) ||
                (gameItem.tags && gameItem.tags.some(tagName => tagName.toLowerCase().includes(this.currentSearchTerm)));
            
            // Tag filter logic
            const matchesTagFilters = this.selectedFilterTags.size === 0 ||
                (gameItem.tags && Array.from(this.selectedFilterTags).some(selectedTag => 
                    gameItem.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
                ));
            
            return matchesSearchQuery && matchesTagFilters;
        });
        
        // Sort filtered results alphabetically by name
        this.filteredGamesList.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        
        this.currentPageNumber = 1;
        this.renderGameCards();
        this.renderPaginationControls();
        this.updateGameCountDisplay();
    }

    renderGameCards() {
        const gameCardsContainer = document.querySelector('.primary-games-grid');
        if (!gameCardsContainer) {
            console.error('Game cards container not found');
            return;
        }
        
        const startIndex = (this.currentPageNumber - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentPageGames = this.filteredGamesList.slice(startIndex, endIndex);
        
        console.log('Rendering games:', currentPageGames.length, '(sorted A-Z)');
        
        if (currentPageGames.length === 0) {
            gameCardsContainer.innerHTML = `
                <div class="empty-games-state">
                    <i class="fas fa-gamepad"></i>
                    <h3>No games found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }
        
        gameCardsContainer.innerHTML = currentPageGames.map(gameItem => {
            // Create the game link - use new dynamic format if slug exists, fallback to old format
            const gameLink = gameItem.slug 
                ? `game.html?game=${gameItem.slug}`
                : gameItem.url || `${gameItem.name.toLowerCase().replace(/\s+/g, '')}.html`;
            
            return `
                <div class="single-game-tile" data-game="${gameItem.slug || gameItem.name.toLowerCase().replace(/\s+/g, '-')}">
                    <div class="game-thumbnail-container">
                        <img src="${gameItem.image}" alt="${gameItem.name}" loading="lazy" onerror="this.src='images/placeholder-game.jpg'" />
                        <div class="tile-hover-effect">
                            <button class="tile-play-action">
                                <i class="fas fa-play"></i>
                                <span>Play Now</span>
                            </button>
                        </div>
                    </div>
                    <div class="game-info-panel">
                        <h3>${gameItem.name}</h3>
                        <div class="game-tags-list">
                            ${gameItem.tags ? gameItem.tags.slice(0, 3).map(tagName => 
                                `<span class="individual-game-tag">${tagName.charAt(0).toUpperCase() + tagName.slice(1)}</span>`
                            ).join('') : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add click handlers for individual game cards - updated class name
        document.querySelectorAll('.single-game-tile').forEach(cardElement => {
            cardElement.addEventListener('click', (e) => {
                const gameData = currentPageGames.find(game => 
                    (game.slug || game.name.toLowerCase().replace(/\s+/g, '-')) === cardElement.dataset.game
                );
                if (gameData) {
                    const gameLink = gameData.slug 
                        ? `game.html?game=${gameData.slug}`
                        : gameData.url || `${gameData.name.toLowerCase().replace(/\s+/g, '')}.html`;
                    window.location.href = gameLink;
                }
            });
        });
    }

    renderPaginationControls() {
        const totalPagesCount = Math.ceil(this.filteredGamesList.length / this.itemsPerPage);
        const paginationContainer = document.querySelector('.pagination-buttons-group');
        
        if (!paginationContainer || totalPagesCount <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous navigation button - updated class name
        paginationHTML += `
            <button class="pagination-nav-button ${this.currentPageNumber === 1 ? 'disabled' : ''}" 
                data-page="${this.currentPageNumber - 1}" ${this.currentPageNumber === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
                Previous
            </button>
        `;
        
        // Page number buttons logic
        const maxVisiblePageNumbers = 5;
        let startPageNumber = Math.max(1, this.currentPageNumber - Math.floor(maxVisiblePageNumbers / 2));
        let endPageNumber = Math.min(totalPagesCount, startPageNumber + maxVisiblePageNumbers - 1);
        
        if (endPageNumber - startPageNumber + 1 < maxVisiblePageNumbers) {
            startPageNumber = Math.max(1, endPageNumber - maxVisiblePageNumbers + 1);
        }
        
        if (startPageNumber > 1) {
            paginationHTML += `<button class="pagination-nav-button" data-page="1">1</button>`;
            if (startPageNumber > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }
        
        for (let pageNum = startPageNumber; pageNum <= endPageNumber; pageNum++) {
            paginationHTML += `
                <button class="pagination-nav-button ${pageNum === this.currentPageNumber ? 'current-page' : ''}" 
                    data-page="${pageNum}">${pageNum}</button>
            `;
        }
        
        if (endPageNumber < totalPagesCount) {
            if (endPageNumber < totalPagesCount - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="pagination-nav-button" data-page="${totalPagesCount}">${totalPagesCount}</button>`;
        }
        
        // Next navigation button - updated class name
        paginationHTML += `
            <button class="pagination-nav-button ${this.currentPageNumber === totalPagesCount ? 'disabled' : ''}" 
                data-page="${this.currentPageNumber + 1}" ${this.currentPageNumber === totalPagesCount ? 'disabled' : ''}>
                Next
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        paginationContainer.innerHTML = paginationHTML;
        
        // Add event listeners to pagination buttons
        paginationContainer.addEventListener('click', (e) => {
            if (e.target.matches('[data-page]') || e.target.closest('[data-page]')) {
                const button = e.target.matches('[data-page]') ? e.target : e.target.closest('[data-page]');
                if (!button.disabled && !button.classList.contains('disabled')) {
                    const page = parseInt(button.dataset.page);
                    this.navigateToPage(page);
                }
            }
        });
    }
    
    navigateToPage(pageNumber) {
        const totalPagesCount = Math.ceil(this.filteredGamesList.length / this.itemsPerPage);
        if (pageNumber >= 1 && pageNumber <= totalPagesCount) {
            this.currentPageNumber = pageNumber;
            this.renderGameCards();
            this.renderPaginationControls();
            this.updateGameCountDisplay();
            
            // Smooth scroll to top of games grid - updated class name
            const gamesGrid = document.querySelector('.primary-games-grid');
            if (gamesGrid) {
                gamesGrid.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        }
    }
    
    updateGameCountDisplay() {
        const gameCountElement = document.querySelector('.games-counter-text');
        if (gameCountElement) {
            gameCountElement.textContent = `Showing ${this.filteredGamesList.length} games (A-Z)`;
        }
    }
}

// Global variable for external access
let allGamesController;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the games page (check for specific elements) - updated class name
    if (document.querySelector('.primary-games-grid')) {
        allGamesController = new AllGamesManager();
        console.log('Games page initialized with A-Z sorting');
    }
    
    // Initialize GameLoader if we're on an individual game page
    if (document.getElementById('gameFrame')) {
        new GameLoader();
        console.log('Game page initialized');
    }
});

// Utility functions to add games from external scripts
function addNewGameToCollection(name, image, url, tags) {
    if (allGamesController) {
        allGamesController.gamesList.push({ name, image, url, tags });
        // Re-sort the games list to maintain A-Z order
        allGamesController.gamesList.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        allGamesController.applyFiltersAndSearch();
    }
}

function addMultipleGamesToCollection(gamesArray) {
    if (allGamesController) {
        allGamesController.gamesList.push(...gamesArray);
        // Re-sort the games list to maintain A-Z order
        allGamesController.gamesList.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        allGamesController.applyFiltersAndSearch();
    }
}




// Settings.js - Handle all settings functionality
class SettingsManager {
    constructor() {
        this.defaultSettings = {
            theme: 'dark',
            audioMuted: false
        };
        
        this.settings = this.loadSettings();
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.applySettings();
        this.updateUI();
    }
    
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Audio toggle
        const audioToggle = document.getElementById('audioToggle');
        if (audioToggle) {
            audioToggle.addEventListener('click', () => this.toggleAudio());
        }
        
        // Reset button
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSettings());
        }
        
        // Fullscreen controls
        document.addEventListener('keydown', (e) => {
            if (e.key === 'f' || e.key === 'F') {
                this.toggleFullscreen();
            }
            if (e.key === 'Escape') {
                this.exitFullscreen();
            }
        });
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('infinitePixelsSettings');
            return saved ? JSON.parse(saved) : { ...this.defaultSettings };
        } catch (error) {
            console.warn('Error loading settings:', error);
            return { ...this.defaultSettings };
        }
    }
    
    saveSettings() {
        try {
            localStorage.setItem('infinitePixelsSettings', JSON.stringify(this.settings));
            this.showStatusMessage('Settings Saved', 'success');
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showStatusMessage('Save Failed', 'error');
        }
    }
    
    toggleTheme() {
        this.settings.theme = this.settings.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        this.updateThemeUI();
        this.saveSettings();
    }
    
    applyTheme() {
        if (this.settings.theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
    }
    
    updateThemeUI() {
        const themeToggle = document.getElementById('themeToggle');
        const themeLabel = document.getElementById('themeLabel');
        
        if (themeToggle && themeLabel) {
            if (this.settings.theme === 'light') {
                themeToggle.classList.add('light');
                themeLabel.textContent = 'Light Mode';
            } else {
                themeToggle.classList.remove('light');
                themeLabel.textContent = 'Dark Mode';
            }
        }
    }
    
    toggleAudio() {
        this.settings.audioMuted = !this.settings.audioMuted;
        this.applyAudio();
        this.updateAudioUI();
        this.saveSettings();
    }
    
    applyAudio() {
        // Get all audio elements on the page
        const audioElements = document.querySelectorAll('audio, video');
        audioElements.forEach(element => {
            element.muted = this.settings.audioMuted;
        });
        
        // Apply to Web Audio API contexts if they exist
        if (window.audioContext) {
            if (this.settings.audioMuted) {
                window.audioContext.suspend();
            } else {
                window.audioContext.resume();
            }
        }
    }
    
    updateAudioUI() {
        const audioToggle = document.getElementById('audioToggle');
        const audioIcon = document.getElementById('audioIcon');
        const audioLabel = document.getElementById('audioLabel');
        
        if (audioToggle && audioIcon && audioLabel) {
            if (this.settings.audioMuted) {
                audioToggle.classList.add('muted');
                audioIcon.className = 'fas fa-volume-mute';
                audioLabel.textContent = 'Muted';
            } else {
                audioToggle.classList.remove('muted');
                audioIcon.className = 'fas fa-volume-up';
                audioLabel.textContent = 'Unmuted';
            }
        }
    }
    
    resetSettings() {
        // Show confirmation dialog
        if (confirm('Are you sure you want to reset all settings to default?')) {
            this.settings = { ...this.defaultSettings };
            this.applySettings();
            this.updateUI();
            this.saveSettings();
            this.showStatusMessage('Settings Reset', 'success');
        }
    }
    
    applySettings() {
        this.applyTheme();
        this.applyAudio();
    }
    
    updateUI() {
        this.updateThemeUI();
        this.updateAudioUI();
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    exitFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
    
    showStatusMessage(message, type = 'success') {
        const statusText = document.getElementById('statusText');
        const statusDot = document.querySelector('.status-dot');
        
        if (statusText && statusDot) {
            statusText.textContent = message;
            
            // Update status dot color based on type
            statusDot.style.background = type === 'success' ? '#2ed573' : '#ff4757';
            
            // Reset after 3 seconds
            setTimeout(() => {
                statusText.textContent = 'Settings Saved';
                statusDot.style.background = '#2ed573';
            }, 3000);
        }
    }
    
    // Method to get current settings (useful for other parts of the site)
    getSettings() {
        return { ...this.settings };
    }
    
    // Method to update settings programmatically
    updateSetting(key, value) {
        if (this.settings.hasOwnProperty(key)) {
            this.settings[key] = value;
            this.applySettings();
            this.updateUI();
            this.saveSettings();
        }
    }
}

// Initialize settings when the page loads
let settingsManager;

document.addEventListener('DOMContentLoaded', () => {
    settingsManager = new SettingsManager();
});

// Make settings manager globally available
window.getSettingsManager = () => settingsManager;

// Enhanced keyboard controls
document.addEventListener('keydown', (e) => {
    // WASD movement (example implementation - you can modify this for your specific needs)
    const key = e.key.toLowerCase();
    
    if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
        // Highlight the corresponding key in the UI
        highlightKey(key.toUpperCase());
    }
    
    if (key === ' ') {
        // Spacebar action
        e.preventDefault();
        highlightKey('SPACE');
    }
});

function highlightKey(keyName) {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        if (key.textContent === keyName) {
            key.style.transform = 'translateY(-4px)';
            key.style.boxShadow = '0 8px 16px rgba(138, 43, 226, 0.5)';
            key.style.borderColor = '#8a2be2';
            
            setTimeout(() => {
                key.style.transform = '';
                key.style.boxShadow = '';
                key.style.borderColor = '';
            }, 200);
        }
    });
}

// Audio context setup for Web Audio API compatibility
function setupAudioContext() {
    if (!window.audioContext && (window.AudioContext || window.webkitAudioContext)) {
        window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Initialize audio context on user interaction
document.addEventListener('click', setupAudioContext, { once: true });
document.addEventListener('keydown', setupAudioContext, { once: true });

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SettingsManager;
} 
// News Page JavaScript - Updated for InfinitePixels
class NewsManager {
    constructor() {
        this.articles = [];
        this.filteredArticles = [];
        this.currentFilter = 'all';
        this.currentTag = 'all';
        this.currentSort = 'newest';
        this.currentView = 'grid';
        this.articlesPerPage = 9;
        this.currentPage = 1;
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.generateSampleData();
        this.setupEventListeners();
        this.renderArticles();
        this.renderSidebarContent();
        this.setupSearch();
    }

    generateSampleData() {
        const categories = ['updates', 'news', 'huge updates', 'games', 'news'];
        const tags = ['update', 'news', 'huge updates', 'games', 'news', 'beta'];
        
        const sampleArticles = [
            {
                id: 1,
                title: "Website Now live!",
                summary: "InfinitePixels is now live for anyone to play at any time.",
                image: "images/livenews.png",
                content: " We are so excited to finally be able to share this with the world and we hope you enjoy playing all of the games we have to offer. If you have any suggestions or feedback please reach out to us through our contact page. We are always looking to improve the site and make it the best it can be for our users. - InfinitePixels Dev Team",
                category: "updates",
                tags: ["update", "news"],
                date: new Date('2025-08-03'),
                author: "Dev Team",
                featured: true,
                importance: 10,
            },
            {
                id: 2,
                title: "Completed Random Games Page",
                summary: "We are pleased to announce that we have completed the random games page.",
                image: "images/randomnews.png",
                content: "That is right, there is now a random games page to keep you on your toes. If you are ever bored and in need of a new game that you might not have ever played before look no further than the random games page. All you have to do is click onto the page and then voila, you will be taken to a random game. We have an expansive game catalog and you never know what hidden gems you might be missing out on. This new feature makes it so that there is never a dull moment on InfinitePixels. - InfinitePixels Dev Team",
                category: "updates",
                tags: ["update", "huge updates"],
                date: new Date('2025-07-30'),
                author: "Dev Team",
                featured: false,
                importance: 7,
            },
            {
                id: 3,
                title: "New Games",
                summary: "We have just added a huge collection of new games to play.",
                image: "images/newnews.png",
                content: "You might notice that the game catalog is looking extra full and you would be right. We have just added a huge amount of games including some popular ones you have definitely played before such as Basket Random or 1v1.LOL and some underground games that we think you’ll enjoy playing. If you have any more game suggestions reach out to contact.infintepixels.com and let us know. InfinitePixels Dev Team",
                category: "games",
                tags: ["games", "new"],
                date: new Date('2025-07-28'),
                author: "Community Team",
                featured: false,
                importance: 4,
            },
            {
                id: 4,
                title: "Bug Fixes",
                summary: "We have fixed some bugs plaguing our website.",
                image: "images/bugnews.png",
                content: "It has come to our attention that there were some bugs on different games like paper.io. We believe to have fixed all of the bugs on the website as of now but were not perfect so if you notice any more persistent bug or any that appear no need to fear as you can always email us at contact.infinitepixels@gmail.com. - InfinitePixels Dev Team",
                category: "updates",
                tags: ["news", "maintenance"],
                date: new Date('2025-07-25'),
                author: "Dev Team",
                featured: false,
                importance: 5,
            },
            {
                id: 5,
                title: "Favorite Games Feature",
                summary: "We added a feature to favorite games.",
                image: "images/favoritenews.png",
                content: "We have recently added a feature that allows you to favorite games. This means that you can now save your favorite games to a list and easily access them later. To favorite a game, simply click the heart button on the game you are playing. You can view your favorite games on the Favorites page or on the Favorites section of the homepage. We hope this makes it easier for you to find and play your favorite games on InfinitePixels. - InfinitePixels Dev Team",
                category: "updates",
                tags: ["news", "updates"],
                date: new Date('2025-08-13'),
                author: "Dev Team",
                featured: false,
                importance: 5,
            },  
            { 
                id: 6, 
                title: "We need your help", 
                summary: "We are calling uppon you to help us add more games",
                image: "images/helpnews.png", 
                content: "We here at InfinitePixels dev team are always looking for new games to add to our website. If you have any diffrent sugustions dont hesitate to email us. This can be any type of game (safe for school) that you wish we had on out webite. It would help us out tremdously if you could attach a link to the game but if you cant find one dont let that stop you. Even if you just have a memory of the game we might be able to find it, we cant garantee that we will be able to add your game into the website but its awalys worth a shot and we will atleast reply to your email. The email to contact us at is contact.infinitepixels@gmail.com. - InfinitePixels Dev Team",
                category: "community",
                tags: ["community", "news"],
                date: new Date('2025-08-13'),
                author: "Dev Team",
                featured: false, 
                importance: 5,
            },
        ];


            

        this.articles = sampleArticles;
        this.filteredArticles = [...this.articles];
    }

    setupEventListeners() {
        // View toggles
        document.querySelectorAll('.news-view-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.news-view-toggle').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.dataset.view;
                this.updateViewMode();
            });
        });

        // Filter dropdown
        const filterBtn = document.querySelector('.news-filter-btn');
        const filterMenu = document.querySelector('.news-filter-menu');
        
        if (filterBtn && filterMenu) {
            filterBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                filterMenu.classList.toggle('active');
            });

            document.querySelectorAll('.news-filter-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    document.querySelectorAll('.news-filter-option').forEach(o => o.classList.remove('active'));
                    e.target.classList.add('active');
                    this.currentFilter = e.target.dataset.filter;
                    filterBtn.querySelector('span').textContent = e.target.textContent;
                    filterMenu.classList.remove('active');
                    this.applyFilters();
                });
            });
        }

        // Sort dropdown
        const sortBtn = document.querySelector('.news-sort-btn');
        const sortMenu = document.querySelector('.news-sort-menu');
        
        if (sortBtn && sortMenu) {
            sortBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                sortMenu.classList.toggle('active');
            });

            document.querySelectorAll('.news-sort-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    document.querySelectorAll('.news-sort-option').forEach(o => o.classList.remove('active'));
                    e.target.classList.add('active');
                    this.currentSort = e.target.dataset.sort;
                    sortBtn.querySelector('span').textContent = e.target.textContent;
                    sortMenu.classList.remove('active');
                    this.applyFilters();
                });
            });
        }

        // Tags
        document.querySelectorAll('.news-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                document.querySelectorAll('.news-tag').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.currentTag = e.target.dataset.tag;
                this.applyFilters();
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreArticles();
            });
        }

        // Featured banner click
        const featuredBanner = document.getElementById('featuredBanner');
        if (featuredBanner) {
            featuredBanner.addEventListener('click', () => {
                const featuredArticle = this.articles.find(article => article.featured);
                if (featuredArticle) {
                    this.openArticleModal(featuredArticle);
                }
            });
        }

        // Modal close
        const modalClose = document.getElementById('modalClose');
        const modalOverlay = document.querySelector('.news-modal-overlay');
        
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeArticleModal());
        }
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => this.closeArticleModal());
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            if (filterMenu) filterMenu.classList.remove('active');
            if (sortMenu) sortMenu.classList.remove('active');
        });

        // Newsletter form
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = e.target.querySelector('input[type="email"]').value;
                if (email) {
                    this.showNotification('Thanks for subscribing! You\'ll receive updates soon.', 'success');
                    e.target.reset();
                }
            });
        }
    }

    setupSearch() {
        const searchInput = document.getElementById('globalSearch');
        const searchResults = document.getElementById('searchResults');
        
        if (!searchInput || !searchResults) return;
        
        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length === 0) {
                searchResults.classList.remove('active');
                return;
            }

            searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });

        searchInput.addEventListener('focus', (e) => {
            if (e.target.value.trim().length > 0) {
                searchResults.classList.add('active');
            }
        });

        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                searchResults.classList.remove('active');
            }, 200);
        });
    }

    performSearch(query) {
        const searchResults = document.getElementById('searchResults');
        const results = this.articles.filter(article => 
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.summary.toLowerCase().includes(query.toLowerCase()) ||
            article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );

        if (results.length === 0) {
            searchResults.innerHTML = '<p class="no-results">No articles found</p>';
        } else {
            searchResults.innerHTML = results.slice(0, 5).map(article => 
                `<p onclick="newsManager.openArticleModal(newsManager.articles.find(a => a.id === ${article.id}))">${article.title}</p>`
            ).join('');
        }
        
        searchResults.classList.add('active');
    }

    applyFilters() {
        let filtered = [...this.articles];

        // Apply category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(article => article.category === this.currentFilter);
        }

        // Apply tag filter
        if (this.currentTag !== 'all') {
            filtered = filtered.filter(article => article.tags.includes(this.currentTag));
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'oldest':
                    return a.date - b.date;
                case 'popular':
                    return a.importance - b.importance;
                case 'importance':
                    return b.likes - a.likes;
                case 'newest':
                default:
                    return b.date - a.date;
            }
        });

        this.filteredArticles = filtered;
        this.currentPage = 1;
        this.renderArticles();
    }

    updateViewMode() {
        const newsGrid = document.getElementById('newsGrid');
        if (this.currentView === 'list') {
            newsGrid.classList.add('list-view');
        } else {
            newsGrid.classList.remove('list-view');
        }
    }

    renderArticles() {
        const newsGrid = document.getElementById('newsGrid');
        const loadingSpinner = document.getElementById('loadingSpinner');
        
        if (!newsGrid) return;
        
        // Show loading
        if (loadingSpinner) {
            loadingSpinner.style.display = 'flex';
        }
        
        setTimeout(() => {
            const articlesToShow = this.filteredArticles.slice(0, this.currentPage * this.articlesPerPage);
            
            if (articlesToShow.length === 0) {
                newsGrid.innerHTML = `
                    <div class="news-no-results">
                        <i class="fas fa-search"></i>
                        <h3>No articles found</h3>
                        <p>Try adjusting your filters or search terms</p>
                    </div>
                `;
            } else {
                newsGrid.innerHTML = articlesToShow.map(article => this.createArticleCard(article)).join('');
            }
            
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
            }
            this.updateLoadMoreButton();
        }, 500);
    }

    createArticleCard(article) {
        const timeAgo = this.getTimeAgo(article.date);
        const categoryDisplay = article.category.replace('-', ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');

        return `
            <div class="news-card" onclick="newsManager.openArticleModal(newsManager.articles.find(a => a.id === ${article.id}))">
                <div class="news-card-image" style="background-image: url('${article.image || 'images/default-news.png'}');"></div>
                <div class="news-card-content">
                    <div class="news-card-meta">
                        <div class="news-card-date">
                            <i class="fas fa-calendar"></i>
                            ${timeAgo}
                        </div>
                        <div class="news-card-category">${categoryDisplay}</div>
                    </div>
                    <h3 class="news-card-title">${article.title}</h3>
                    <p class="news-card-summary">${article.summary}</p>
                    <div class="news-card-tags">
                        ${article.tags.map(tag => `<span class="news-card-tag" onclick="event.stopPropagation(); newsManager.filterByTag('${tag}')">#${tag}</span>`).join('')}
                    </div>
                    <div class="news-card-footer">
                        <button class="news-read-more-btn" onclick="event.stopPropagation(); newsManager.openArticleModal(newsManager.articles.find(a => a.id === ${article.id}))">
                            <span>Read More</span>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    filterByTag(tag) {
        document.querySelectorAll('.news-tag').forEach(t => t.classList.remove('active'));
        const tagElement = document.querySelector(`[data-tag="${tag}"]`);
        if (tagElement) {
            tagElement.classList.add('active');
        }
        this.currentTag = tag;
        this.applyFilters();
    }

    loadMoreArticles() {
        const totalArticles = this.filteredArticles.length;
        const currentlyShown = this.currentPage * this.articlesPerPage;
        
        if (currentlyShown < totalArticles) {
            this.currentPage++;
            this.renderArticles();
        }
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (!loadMoreBtn) return;
        
        const totalArticles = this.filteredArticles.length;
        const currentlyShown = this.currentPage * this.articlesPerPage;
        
        if (currentlyShown >= totalArticles) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'flex';
            const remaining = totalArticles - currentlyShown;
            const btnText = loadMoreBtn.querySelector('span');
            if (btnText) {
                btnText.textContent = `LOAD MORE (${remaining} remaining)`;
            }
        }
    }

    renderSidebarContent() {
        this.renderTrendingList();
        this.renderRecentList();
    }

    renderTrendingList() {
        const trendingList = document.getElementById('trendingList');
        if (!trendingList) return;
        
        const trending = [...this.articles]
            .sort((a, b) => b.views - a.views)
            .slice(0, 5);

        trendingList.innerHTML = trending.map(article => `
            <div class="news-trending-item" onclick="newsManager.openArticleModal(newsManager.articles.find(a => a.id === ${article.id}))">
                <div class="news-trending-item-image"></div>
                <div class="news-trending-item-content">
                    <div class="news-trending-item-title">${article.title}</div>
                    <div class="news-trending-item-date">${this.getTimeAgo(article.date)}</div>
                </div>
            </div>
        `).join('');
    }

    renderRecentList() {
        const recentList = document.getElementById('recentList');
        if (!recentList) return;
        
        const recent = [...this.articles]
            .sort((a, b) => b.date - a.date)
            .slice(0, 5);

        recentList.innerHTML = recent.map(article => `
            <div class="news-recent-item" onclick="newsManager.openArticleModal(newsManager.articles.find(a => a.id === ${article.id}))">
                <div class="news-recent-item-image"></div>
                <div class="news-recent-item-content">
                    <div class="news-recent-item-title">${article.title}</div>
                    <div class="news-recent-item-date">${this.getTimeAgo(article.date)}</div>
                </div>
            </div>
        `).join('');
    }

    openArticleModal(article) {
        const modal = document.getElementById('articleModal');
        const modalArticle = document.getElementById('modalArticle');
        
        if (!modal || !modalArticle) return;
        
        modalArticle.innerHTML = `
            <div class="modal-article-header">
                <div class="modal-article-meta">
                    <span class="modal-article-category">${article.category.replace('-', ' ').toUpperCase()}</span>
                    <span class="modal-article-date">${article.date.toLocaleDateString()}</span>
                </div>
                <h1 class="modal-article-title">${article.title}</h1>
                <div class="modal-article-author">By ${article.author}</div>
                <div class="modal-article-tags">
                    ${article.tags.map(tag => `<span class="modal-article-tag">#${tag}</span>`).join('')}
                </div>
            </div>
            <div class="modal-article-content">
                <p>${article.summary}</p>
                <br>
                <p>${article.content}</p>
                <br>
                <br>
                <p>Infinite Pixels - Ultimate Gaming Hub</p>
            </div>
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeArticleModal() {
        const modal = document.getElementById('articleModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(30, 30, 63, 0.95);
            border: 1px solid rgba(138, 43, 226, 0.3);
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            backdrop-filter: blur(10px);
            z-index: 1500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 8px 24px rgba(138, 43, 226, 0.3);
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}" style="color: ${type === 'success' ? '#4ade80' : type === 'error' ? '#ef4444' : '#7faafe'};"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInWeeks = Math.floor(diffInDays / 7);
        const diffInMonths = Math.floor(diffInDays / 30);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInDays < 7) return `${diffInDays}d ago`;
        if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
        if (diffInMonths < 12) return `${diffInMonths}mo ago`;
        return `${Math.floor(diffInMonths / 12)}y ago`;
    }

    formatNumber(num) {
        if (num === undefined || num === null || isNaN(num)) {
            return '0';
        }
        const numValue = typeof num === 'string' ? parseFloat(num) : num;
        if (numValue >= 1000000) return (numValue / 1000000).toFixed(1) + 'M';
        if (numValue >= 1000) return (numValue / 1000).toFixed(1) + 'K';
        return Math.floor(numValue).toString();
    }
}

// Initialize the news manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a page with news content
    if (document.querySelector('.news-page-container')) {
        window.newsManager = new NewsManager();
        console.log('News page initialized successfully!');
    }
});

// Categories Cosmic Engine - Uniquely Named for No Conflicts

// Category definitions with cosmic themes and images
const cosmicCategoriesConstellations = {
    'shooter': {
        name: 'Shooter',
        image: 'images/msfimage.jpg',
        description: 'Intense shooting and combat games'
    },
    'action': {
        name: 'Action',
        image: 'images/1v1lolimage.jpg',
        description: 'Fast-paced action adventures'
    },
    'racing': {
        name: 'Racing',
        image: 'images/3dformularacingimage.jpg',
        description: 'High-speed racing thrills'
    },
    'puzzle': {
        name: 'Puzzle',
        image: 'images/drawclimberimage.jpg',
        description: 'Brain-bending puzzle challenges'
    },
    'platformer': {
        name: 'Platformer',
        image: 'images/subwaysurfersimage.jpg',
        description: 'Jumping and platform adventures'
    },
    'multiplayer': {
        name: 'Multiplayer',
        image: 'images/bloxdioimage.jpg',
        description: 'Play with friends online'
    },
    'io': {
        name: 'Io',
        image: 'images/paperioimage.jpg',
        description: 'Competitive IO games'
    },
    'idle': {
        name: 'Idle',
        image: 'images/tinyfishingimage.jpg',
        description: 'Relaxing idle experiences'
    },
    'sports': {
        name: 'Sports',
        image: 'images/happywheelsimage.jpg',
        description: 'Sports and athletic games'
    },
    '3d': {
        name: '3D',
        image: 'images/blockstack3dimage.jpg',
        description: 'Immersive 3D experiences'
    },
    'arcade': {
        name: 'Arcade',
        image: 'images/helixjumpimage.jpg',
        description: 'Classic arcade fun'
    },
    'adventure': {
        name: 'Adventure',
        image: 'images/ninjaarashiimage.jpg',
        description: 'Epic adventure journeys'
    },
    'clicker': {
        name: 'Clicker',
        image: 'images/cookieclickerimage.jpg',
        description: 'Addictive clicking games'
    },
    'cars': {
        name: 'Cars',
        image: 'images/madalinstuntcarsproimage.jpg',
        description: 'Car-based adventures'
    },
    '2 player': {
        name: '2 Player',
        image: 'images/shadowfightsimage.jpg',
        description: 'Two-player competitions'
    },
    'basketball': {
        name: 'Basketball',
        image: 'images/basketrandomimage.jpg',
        description: 'Basketball games and challenges'
    },
    '2048': {
        name: '2048',
        image: 'images/ball2048image.jpg',
        description: '2048-style puzzle games'
    },
    'drawing': {
        name: 'Drawing',
        image: 'images/savethedummyimage.jpg',
        description: 'Creative drawing games'
    },
    'runner': {
        name: 'Runner',
        image: 'images/tallmanrunimage.jpg',
        description: 'Endless running adventures'
    },
    'fruit': {
        name: 'Fruit',
        image: 'images/fruitmergeimage.jpg',
        description: 'Fresh fruit games'
    },
    'online': {
        name: 'Online',
        image: 'images/maskedspecialforcesimage.jpg',
        description: 'Connected online experiences'
    },
    'strategy': {
        name: 'Strategy',
        image: 'images/paperioimage.jpg',
        description: 'Strategic thinking games'
    },
    'parkour': {
        name: 'Parkour',
        image: 'images/parkourblock3dimage.jpg',
        description: 'Parkour and free-running'
    },
    'animal': {
        name: 'Animal',
        image: 'images/rodeostampedeimage.jpg',
        description: 'Animal-themed adventures'
    },
    'satisfying': {
        name: 'Satisfying',
        image: 'images/spiralrollimage.jpg',
        description: 'Satisfying gameplay experiences'
    },
    'endless': {
        name: 'Endless',
        image: 'images/subwaysurfersimage.jpg',
        description: 'Never-ending gameplay'
    },
    'fishing': {
        name: 'Fishing',
        image: 'images/icefishingimage.jpg',
        description: 'Fishing and aquatic games'
    },
    'bike': {
        name: 'Bike',
        image: 'images/rocketbikeshighwayraceimage.jpg',
        description: 'Motorcycle and bike games'
    },
    'levels': {
        name: 'Levels',
        image: 'images/bulletarmyrunimage.jpg',
        description: 'Level-based progression games'
    },
    'cooking': {
        name: 'Cooking',
        image: 'images/papasburgeriaimage.jpg',
        description: 'Cooking and food games'
    },
    'horror': {
        name: 'Horror',
        image: 'images/momohorrorstoryimage.jpg',
        description: 'Horror and scary games'
    },
    'simulator': {
        name: 'Simulator',
        image: 'images/bussimulatorimage.jpg',
        description: 'Simulator games'
    },
    'stickman': {
        name: 'Stickman',
        image: 'images/stickfighter3dimage.jpg',
        description: 'Stickman games'
    },
};

// Fallback images for categories without specific images
const cosmicCategoriesFallbackImages = {
    'shooter': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJzaG9vdGVyLWdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM4YTJiZTIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM0YjAwODIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNzaG9vdGVyLWdyYWQpIi8+PHBhdGggZD0iTTEwMCA1MEw3MCA4MEwxMzAgODBMMTAwIDUwWiIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC44Ii8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTUwIiByPSIyMCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC42Ii8+PC9zdmc+',
    'action': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhY3Rpb24tZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzhhMmJlMiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzRiMDA4MiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2FjdGlvbi1ncmFkKSIvPjxwb2x5Z29uIHBvaW50cz0iMTAwLDUwIDEzMCw4MCA3MCw4MCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC44Ii8+PHJlY3QgeD0iODAiIHk9IjEyMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjYiLz48L3N2Zz4=',
    'racing': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJyYWNpbmctZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzhhMmJlMiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzRiMDA4MiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI3JhY2luZy1ncmFkKSIvPjxlbGxpcHNlIGN4PSIxMDAiIGN5PSIxMDAiIHJ4PSI2MCIgcnk9IjMwIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjgiLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjEyMCIgcj0iMTAiIGZpbGw9IiNmZmYiLz48Y2lyY2xlIGN4PSIxMzAiIGN5PSIxMjAiIHI9IjEwIiBmaWxsPSIjZmZmIi8+PC9zdmc+',
    'puzzle': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJwdXp6bGUtZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzhhMmJlMiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzRiMDA4MiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI3B1enpsZS1ncmFkKSIvPjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjgiLz48cmVjdCB4PSIxMTAiIHk9IjUwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuNiIvPjxyZWN0IHg9IjUwIiB5PSIxMTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC42Ii8+PHJlY3QgeD0iMTEwIiB5PSIxMTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC44Ii8+PC9zdmc+',
    'platformer': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJwbGF0Zm9ybWVyLWdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM4YTJiZTIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM0YjAwODIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNwbGF0Zm9ybWVyLWdyYWQpIi8+PHJlY3QgeD0iMjAiIHk9IjE2MCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjgiLz48cmVjdCB4PSIxMjAiIHk9IjEyMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjgiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjE0MCIgcj0iMTUiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuOSIvPjwvc3ZnPg==',
    'default': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJkZWZhdWx0LWdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM4YTJiZTIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM0YjAwODIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNkZWZhdWx0LWdyYWQpIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI0MCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC44Ii8+PC9zdmc+'
};

// Get unique categories from games database
function cosmicCategoriesExtractConstellations() {
    const uniqueTags = new Set();
    
    if (typeof allGamesDatabase !== 'undefined') {
        allGamesDatabase.forEach(game => {
            if (game.tags && Array.isArray(game.tags)) {
                game.tags.forEach(tag => uniqueTags.add(tag.toLowerCase()));
            }
        });
    }
    
    return Array.from(uniqueTags).sort();
}

// Filter games by category
function cosmicCategoriesFilterGamesByConstellation(category) {
    if (typeof allGamesDatabase === 'undefined') {
        return [];
    }
    
    return allGamesDatabase.filter(game => 
        game.tags && game.tags.some(tag => 
            tag.toLowerCase() === category.toLowerCase()
        )
    );
}

// Enhanced function to convert game name to URL parameter format
function cosmicCategoriesGameNameToUrlParam(gameName) {
    return gameName
        .toLowerCase()
        .replace(/[^\w]/g, '');   // Remove all non-word characters (spaces, punctuation, etc.)
}

// Navigate to game - UPDATED for new URL format
function cosmicCategoriesNavigateToGame(gameUrl) {
    // If it's already a proper URL, use it
    if (gameUrl.startsWith('http') || gameUrl.startsWith('/game.html?game=')) {
        window.location.href = gameUrl;
        return;
    }
    
    // Otherwise, assume it's a game name and convert to new format
    let gameName = gameUrl;
    
    // If it looks like old format, extract game name
    if (gameUrl.startsWith('games/') && gameUrl.endsWith('.html')) {
        gameName = gameUrl.replace('games/', '').replace('.html', '');
    }
    
    // Convert to URL-friendly format
    const urlFriendlyName = cosmicCategoriesGameNameToUrlParam(gameName);
    
    // Create new format URL
    const finalUrl = `/game.html?game=${encodeURIComponent(urlFriendlyName)}`;
    window.location.href = finalUrl;
}

// Create game card HTML - UPDATED to use game name instead of URL
function cosmicCategoriesCreateGameNebulaCard(game) {
    return `
        <div class="cosmic-categories-game-nebula-card" onclick="cosmicCategoriesNavigateToGame('${game.name}')">
            <img src="${game.image}" 
                 alt="${game.name}" 
                 class="cosmic-categories-game-star-image"
                 onerror="this.src='${cosmicCategoriesFallbackImages.default}'">
            <h4 class="cosmic-categories-game-title-aurora">${game.name}</h4>
        </div>
    `;
}

// Create category card HTML
function cosmicCategoriesCreateConstellationCard(category, categoryData, gameCount) {
    const categoryImage = categoryData.image || cosmicCategoriesFallbackImages.default;
    
    return `
        <div class="cosmic-categories-constellation-card" 
             onclick="cosmicCategoriesToggleDimension('${category}')"
             style="--category-bg-image: url('${categoryImage}')">
            <div class="cosmic-categories-star-header">
                <img src="${categoryImage}" 
                     alt="${categoryData.name}" 
                     class="cosmic-categories-stellar-image"
                     onerror="this.src='${cosmicCategoriesFallbackImages.default}'">
                <h3 class="cosmic-categories-cosmic-name">${categoryData.name}</h3>
                <span class="cosmic-categories-game-count-badge">${gameCount} ${gameCount === 1 ? 'Game' : 'Games'}</span>
            </div>
            <div class="cosmic-categories-expansion-portal" id="cosmic-portal-${category}">
                <div class="cosmic-categories-games-cosmos" id="cosmic-games-${category}">
                    <!-- Games will be loaded here -->
                </div>
            </div>
        </div>
    `;
}

// Configuration
const COSMIC_CATEGORIES_GAMES_PER_PAGE = 12;

// Modal state
let cosmicCategoriesCurrentModal = null;
let cosmicCategoriesCurrentPage = 1;
let cosmicCategoriesCurrentGames = [];

// URL parameter functions
function cosmicCategoriesGetUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function cosmicCategoriesUpdateUrl(category) {
    const url = new URL(window.location);
    if (category) {
        url.searchParams.set('category', category);
    } else {
        url.searchParams.delete('category');
    }
    
    // Update URL without page reload
    window.history.pushState({ category }, '', url);
}

// Handle browser back/forward buttons
function cosmicCategoriesHandlePopState(event) {
    const category = cosmicCategoriesGetUrlParameter('category');
    
    if (category && cosmicCategoriesCurrentModal !== category) {
        // Open the category from URL
        cosmicCategoriesOpenModalFromUrl(category);
    } else if (!category && cosmicCategoriesCurrentModal) {
        // Close modal if no category in URL
        cosmicCategoriesCloseModalWithoutUrlUpdate();
    }
}

// Create modal HTML
function cosmicCategoriesCreateModal() {
    return `
        <div class="cosmic-categories-modal-overlay" id="cosmicCategoriesModalOverlay">
            <div class="cosmic-categories-modal-container">
                <div class="cosmic-categories-modal-header">
                    <h2 class="cosmic-categories-modal-title">
                        <img src="" alt="" class="cosmic-categories-modal-category-icon" id="cosmicModalCategoryIcon">
                        <span id="cosmicModalCategoryName">Category</span>
                    </h2>
                    <button class="cosmic-categories-modal-close" onclick="cosmicCategoriesCloseModal()">
                        ✕
                    </button>
                </div>
                <div class="cosmic-categories-modal-body">
                    <div class="cosmic-categories-modal-games-container">
                        <div class="cosmic-categories-modal-games-grid" id="cosmicModalGamesGrid">
                            <!-- Games will be loaded here -->
                        </div>
                    </div>
                    <div class="cosmic-categories-modal-pagination" id="cosmicModalPagination">
                        <!-- Pagination will be loaded here -->
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Open modal from URL parameter (without updating URL again)
function cosmicCategoriesOpenModalFromUrl(category) {
    // Ensure modal exists
    let modalOverlay = document.getElementById('cosmicCategoriesModalOverlay');
    if (!modalOverlay) {
        document.body.insertAdjacentHTML('beforeend', cosmicCategoriesCreateModal());
        modalOverlay = document.getElementById('cosmicCategoriesModalOverlay');
        
        // Close modal when clicking overlay
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                cosmicCategoriesCloseModal();
            }
        });
        
        // Close modal with escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalOverlay.classList.contains('cosmic-categories-modal-active')) {
                cosmicCategoriesCloseModal();
            }
        });
    }
    
    // Get games for this category
    const games = cosmicCategoriesFilterGamesByConstellation(category);
    const categoryData = cosmicCategoriesConstellations[category] || {
        name: category.charAt(0).toUpperCase() + category.slice(1)
    };
    
    // Set modal content
    document.getElementById('cosmicModalCategoryName').textContent = categoryData.name;
    const iconImg = document.getElementById('cosmicModalCategoryIcon');
    iconImg.src = categoryData.image || cosmicCategoriesFallbackImages.default;
    iconImg.alt = categoryData.name;
    
    // Store current state
    cosmicCategoriesCurrentModal = category;
    cosmicCategoriesCurrentGames = games;
    cosmicCategoriesCurrentPage = 1;
    
    // Render games and pagination
    cosmicCategoriesRenderModalPage();
    
    // Show modal
    modalOverlay.classList.add('cosmic-categories-modal-active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Open modal with category games (with URL update)
function cosmicCategoriesOpenModal(category) {
    // Update URL
    cosmicCategoriesUpdateUrl(category);
    
    // Open modal
    cosmicCategoriesOpenModalFromUrl(category);
}

// Close modal without updating URL (for browser navigation)
function cosmicCategoriesCloseModalWithoutUrlUpdate() {
    const modalOverlay = document.getElementById('cosmicCategoriesModalOverlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('cosmic-categories-modal-active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Reset state
        cosmicCategoriesCurrentModal = null;
        cosmicCategoriesCurrentPage = 1;
        cosmicCategoriesCurrentGames = [];
    }
}

// Close modal (with URL update)
function cosmicCategoriesCloseModal() {
    // Update URL (remove category parameter)
    cosmicCategoriesUpdateUrl(null);
    
    // Close modal
    cosmicCategoriesCloseModalWithoutUrlUpdate();
}

// Render current page of games
function cosmicCategoriesRenderModalPage() {
    const gamesGrid = document.getElementById('cosmicModalGamesGrid');
    const pagination = document.getElementById('cosmicModalPagination');
    
    if (!gamesGrid || !pagination) return;
    
    const totalGames = cosmicCategoriesCurrentGames.length;
    const totalPages = Math.ceil(totalGames / COSMIC_CATEGORIES_GAMES_PER_PAGE);
    const startIndex = (cosmicCategoriesCurrentPage - 1) * COSMIC_CATEGORIES_GAMES_PER_PAGE;
    const endIndex = startIndex + COSMIC_CATEGORIES_GAMES_PER_PAGE;
    const currentPageGames = cosmicCategoriesCurrentGames.slice(startIndex, endIndex);
    
    // Render games
    if (currentPageGames.length > 0) {
        gamesGrid.innerHTML = currentPageGames.map(cosmicCategoriesCreateModalGameCard).join('');
    } else {
        gamesGrid.innerHTML = '<div class="cosmic-categories-modal-no-games">No games found in this dimension...</div>';
    }
    
    // Render pagination
    if (totalPages > 1) {
        pagination.innerHTML = cosmicCategoriesCreatePaginationHTML(totalPages);
        pagination.style.display = 'flex';
    } else {
        pagination.style.display = 'none';
    }
}

// Create modal game card - UPDATED to use game name instead of URL
function cosmicCategoriesCreateModalGameCard(game) {
    return `
        <div class="cosmic-categories-game-nebula-card" onclick="cosmicCategoriesNavigateToGame('${game.name}')">
            <img src="${game.image}" 
                 alt="${game.name}" 
                 class="cosmic-categories-game-star-image"
                 onerror="this.src='${cosmicCategoriesFallbackImages.default}'">
            <h4 class="cosmic-categories-game-title-aurora">${game.name}</h4>
        </div>
    `;
}

// Create pagination HTML
function cosmicCategoriesCreatePaginationHTML(totalPages) {
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="cosmic-categories-pagination-button" 
                onclick="cosmicCategoriesChangePage(${cosmicCategoriesCurrentPage - 1})"
                ${cosmicCategoriesCurrentPage === 1 ? 'disabled' : ''}>
            ‹ Previous
        </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const isActive = i === cosmicCategoriesCurrentPage;
        paginationHTML += `
            <button class="cosmic-categories-pagination-button ${isActive ? 'cosmic-categories-active-page' : ''}" 
                    onclick="cosmicCategoriesChangePage(${i})">
                ${i}
            </button>
        `;
    }
    
    // Next button
    paginationHTML += `
        <button class="cosmic-categories-pagination-button" 
                onclick="cosmicCategoriesChangePage(${cosmicCategoriesCurrentPage + 1})"
                ${cosmicCategoriesCurrentPage === totalPages ? 'disabled' : ''}>
            Next ›
        </button>
    `;
    
    // Page info
    const startItem = (cosmicCategoriesCurrentPage - 1) * COSMIC_CATEGORIES_GAMES_PER_PAGE + 1;
    const endItem = Math.min(cosmicCategoriesCurrentPage * COSMIC_CATEGORIES_GAMES_PER_PAGE, cosmicCategoriesCurrentGames.length);
    
    paginationHTML += `
        <div class="cosmic-categories-page-info">
            ${startItem}-${endItem} of ${cosmicCategoriesCurrentGames.length} games
        </div>
    `;
    
    return paginationHTML;
}

// Change page
function cosmicCategoriesChangePage(newPage) {
    const totalPages = Math.ceil(cosmicCategoriesCurrentGames.length / COSMIC_CATEGORIES_GAMES_PER_PAGE);
    
    if (newPage < 1 || newPage > totalPages) return;
    
    cosmicCategoriesCurrentPage = newPage;
    cosmicCategoriesRenderModalPage();
    
    // Scroll to top of games grid
    const gamesContainer = document.querySelector('.cosmic-categories-modal-games-container');
    if (gamesContainer) {
        gamesContainer.scrollTop = 0;
    }
}

// Update the toggle function to open modal instead
function cosmicCategoriesToggleDimension(category) {
    cosmicCategoriesOpenModal(category);
}

// Check for URL parameter on page load
function cosmicCategoriesCheckUrlOnLoad() {
    const category = cosmicCategoriesGetUrlParameter('category');
    if (category) {
        // Small delay to ensure everything is loaded
        setTimeout(() => {
            cosmicCategoriesOpenModalFromUrl(category);
        }, 200);
    }
}

// Initialize categories page
function cosmicCategoriesInitializeUniverse() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;
    
    const categories = cosmicCategoriesExtractConstellations();
    
    if (categories.length === 0) {
        categoriesGrid.innerHTML = '<div class="cosmic-categories-void-message">No categories available. The universe is still expanding...</div>';
        return;
    }
    
    let categoriesHTML = '';
    
    categories.forEach(category => {
        const games = cosmicCategoriesFilterGamesByConstellation(category);
        const gameCount = games.length;
        
        if (gameCount > 0) {
            const categoryData = cosmicCategoriesConstellations[category] || {
                name: category.charAt(0).toUpperCase() + category.slice(1),
                description: `${category} games`
            };
            
            categoriesHTML += cosmicCategoriesCreateConstellationCard(category, categoryData, gameCount);
        }
    });
    
    if (categoriesHTML) {
        categoriesGrid.innerHTML = categoriesHTML;
    } else {
        categoriesGrid.innerHTML = '<div class="cosmic-categories-void-message">No games available in any category yet...</div>';
    }
    
    // Check URL parameter after initialization
    cosmicCategoriesCheckUrlOnLoad();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure allGamesDatabase is loaded
    setTimeout(cosmicCategoriesInitializeUniverse, 100);
    
    // Add popstate listener for browser navigation
    window.addEventListener('popstate', cosmicCategoriesHandlePopState);
});

// Also initialize if script loads after DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        cosmicCategoriesInitializeUniverse();
        window.addEventListener('popstate', cosmicCategoriesHandlePopState);
    });
} else {
    setTimeout(() => {
        cosmicCategoriesInitializeUniverse();
        window.addEventListener('popstate', cosmicCategoriesHandlePopState);
    }, 100);
}

// About Page Interactions JavaScript - OPTIMIZED VERSION

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize about page functionality if we're on the about page
    if (document.querySelector('.about-hero-banner') || document.querySelector('.about-page-container')) {
        console.log('About page detected - initializing...');
        
        // Ensure animations are added first
        ensureAboutAnimations();
        
        // Initialize all functions
        initAboutScrollAnimations();
        initAboutFloatingElements();
        initAboutInfinityAnimation();
        initAboutStaggeredAnimations();
        initAboutHoverEffects();
        initAboutThemeObserver();
        
        // Update theme colors after a brief delay
        setTimeout(() => {
            updateAboutFloatingElementsForTheme();
        }, 50);
    }
});

// Add CSS animations first - moved to top priority
function ensureAboutAnimations() {
    // Check if animations already exist
    if (document.querySelector('#aboutPageAnimations')) return;
    
    const aboutAnimationStyles = document.createElement('style');
    aboutAnimationStyles.id = 'aboutPageAnimations';
    aboutAnimationStyles.textContent = `
        @keyframes aboutPixelFloat {
            0%, 100% { 
                transform: translateY(0px) rotate(0deg);
                opacity: 0.6;
            }
            33% { 
                transform: translateY(-20px) rotate(120deg);
                opacity: 1;
            }
            66% { 
                transform: translateY(10px) rotate(240deg);
                opacity: 0.8;
            }
        }
        
        .about-animate {
            animation: aboutSlideInUp 0.8s ease-out forwards;
        }
        
        @keyframes aboutSlideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .about-content-card {
            transition: all 0.3s ease-out;
        }
        
        .about-metric-box {
            transition: all 0.3s ease-out;
        }
        
        .about-floating-pixel {
            will-change: transform;
        }
        
        /* Ensure hero banner is visible */
        .about-hero-banner {
            position: relative;
            min-height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 1;
        }
        
        .about-hero-content {
            position: relative;
            z-index: 10;
            text-align: center;
        }
    `;
    
    document.head.appendChild(aboutAnimationStyles);
}

// Scroll-triggered animations for about page
function initAboutScrollAnimations() {
    const aboutContentCards = document.querySelectorAll('.about-content-card');
    const aboutMetricBoxes = document.querySelectorAll('.about-metric-box');
    
    // Only proceed if elements exist
    if (aboutContentCards.length === 0 && aboutMetricBoxes.length === 0) {
        console.log('No about page elements found for scroll animations');
        return;
    }
    
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('about-animate');
                
                // Trigger counter animation for metric boxes
                if (entry.target.classList.contains('about-metric-box')) {
                    const metricValue = entry.target.querySelector('.about-metric-value');
                    if (metricValue && !metricValue.classList.contains('about-counted')) {
                        animateAboutCounter(metricValue);
                        metricValue.classList.add('about-counted');
                    }
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all content cards and metric boxes
    [...aboutContentCards, ...aboutMetricBoxes].forEach(item => {
        aboutObserver.observe(item);
    });
}

// Counter animation for about page statistics
function animateAboutCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    if (isNaN(target)) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const aboutTimer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(aboutTimer);
        }
        
        const displayValue = Math.floor(current);
        element.textContent = formatAboutNumber(displayValue);
    }, duration / steps);
}

// Format numbers with commas for readability
function formatAboutNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Create floating elements animation for about page - FIXED
function initAboutFloatingElements() {
    // Try both the container and the specific floating elements div
    let container = document.querySelector('.about-floating-elements') || document.querySelector('.about-hero-banner');
    
    if (!container) {
        console.log('About hero banner not found - skipping floating elements');
        return;
    }
    
    const aboutPixelColors = ['#ba68c8', '#42a5f5', '#8e24aa', '#1976d2', '#6a1b9a'];
    
    // Create floating elements
    for (let i = 0; i < 12; i++) {
        createAboutFloatingElement(container, aboutPixelColors[i % aboutPixelColors.length], i);
    }
}

function createAboutFloatingElement(container, color, index) {
    if (!container) return;
    
    const aboutPixel = document.createElement('div');
    aboutPixel.className = 'about-floating-pixel';
    aboutPixel.style.cssText = `
        position: absolute;
        width: ${Math.random() * 10 + 6}px;
        height: ${Math.random() * 10 + 6}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 2;
        animation: aboutPixelFloat ${6 + Math.random() * 4}s infinite ease-in-out;
        animation-delay: ${index * 0.6}s;
        top: ${Math.random() * 80 + 10}%;
        left: ${Math.random() * 80 + 10}%;
        opacity: ${0.6 + Math.random() * 0.4};
        box-shadow: 0 0 15px ${color};
    `;
    
    container.appendChild(aboutPixel);
}

// Initialize infinity symbol animation
function initAboutInfinityAnimation() {
    const infinitySymbol = document.querySelector('.about-infinity-symbol');
    if (!infinitySymbol) {
        console.log('Infinity symbol not found');
        return;
    }
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.1;
                infinitySymbol.style.transform = `rotate(${rate}deg)`;
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Add staggered animation entrance for content cards
function initAboutStaggeredAnimations() {
    const aboutCards = document.querySelectorAll('.about-content-card');
    
    if (aboutCards.length === 0) {
        console.log('No about content cards found for staggered animations');
        return;
    }
    
    aboutCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
}

// Add interactive hover effects to content cards
function initAboutHoverEffects() {
    // Content cards hover effects
    document.querySelectorAll('.about-content-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.03)';
            this.style.transition = 'all 0.3s ease-out';
            this.style.boxShadow = '0 25px 60px rgba(138, 43, 226, 0.4)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });

    // Metric boxes hover effects
    document.querySelectorAll('.about-metric-box').forEach(metricBox => {
        metricBox.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 20px 60px rgba(138, 43, 226, 0.5)';
            this.style.transform = 'scale(1.08)';
            this.style.transition = 'all 0.3s ease-out';
            this.style.borderColor = '#8a2be2';
        });
        
        metricBox.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
            this.style.transform = 'scale(1)';
            this.style.borderColor = 'rgba(138, 43, 226, 0.3)';
        });
    });
}

// Parallax scrolling effect for about hero section
let aboutScrollTicking = false;
window.addEventListener('scroll', function() {
    if (!aboutScrollTicking) {
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const aboutHeroContent = document.querySelector('.about-hero-content');
            const aboutFloatingElements = document.querySelectorAll('.about-floating-pixel');
            const aboutInfinityBackdrop = document.querySelector('.about-infinity-backdrop');
            
            // Parallax effect for hero content
            if (aboutHeroContent) {
                aboutHeroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            
            // Parallax effect for infinity backdrop
            if (aboutInfinityBackdrop) {
                aboutInfinityBackdrop.style.transform = `translate(-50%, -50%) translateY(${scrolled * 0.2}px)`;
            }
            
            // Parallax effect for floating elements
            aboutFloatingElements.forEach((element, index) => {
                const speed = 0.1 + (index * 0.03);
                const currentTransform = element.style.transform || '';
                const cleanTransform = currentTransform.replace(/translateY\([^)]*\)/g, '');
                element.style.transform = `${cleanTransform} translateY(${scrolled * speed}px)`;
            });
            
            revealAboutOnScroll();
            aboutScrollTicking = false;
        });
        aboutScrollTicking = true;
    }
});

// Smooth reveal animation for content cards on scroll
function revealAboutOnScroll() {
    const aboutContentCards = document.querySelectorAll('.about-content-card:not(.about-animate)');
    
    aboutContentCards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const cardVisible = 150;
        
        if (cardTop < window.innerHeight - cardVisible) {
            card.classList.add('about-animate');
        }
    });
}

// Enhanced mouse movement for floating elements
let mouseMoveThrottled = false;
document.addEventListener('mousemove', function(e) {
    if (!mouseMoveThrottled) {
        requestAnimationFrame(() => {
            const aboutFloatingElements = document.querySelectorAll('.about-floating-pixel');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            aboutFloatingElements.forEach((element, index) => {
                const speed = (index + 1) * 0.02;
                const x = (mouseX - 0.5) * speed * 50;
                const y = (mouseY - 0.5) * speed * 50;
                
                const existingTransform = element.style.transform || '';
                const baseTransform = existingTransform.replace(/translate\([^)]*\)/g, '');
                element.style.transform = `${baseTransform} translate(${x}px, ${y}px)`;
            });
            mouseMoveThrottled = false;
        });
        mouseMoveThrottled = true;
    }
});

// Theme-aware color updates for floating elements
function updateAboutFloatingElementsForTheme() {
    const isLightTheme = document.body.classList.contains('light-theme');
    const aboutFloatingElements = document.querySelectorAll('.about-floating-pixel');
    
    if (aboutFloatingElements.length === 0) {
        console.log('No floating elements found for theme update');
        return;
    }
    
    const lightColors = ['#6a1b9a', '#1565c0', '#8e24aa', '#1976d2', '#4a148c'];
    const darkColors = ['#ba68c8', '#42a5f5', '#8e24aa', '#1976d2', '#6a1b9a'];
    
    const colors = isLightTheme ? lightColors : darkColors;
    
    aboutFloatingElements.forEach((element, index) => {
        const color = colors[index % colors.length];
        element.style.background = color;
        element.style.boxShadow = `0 0 15px ${color}`;
    });
}

// Theme observer with better error handling
function initAboutThemeObserver() {
    try {
        const themeObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    updateAboutFloatingElementsForTheme();
                }
            });
        });

        themeObserver.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });
    } catch (error) {
        console.warn('Could not initialize theme observer:', error);
    }
}

// Debug function
function debugAboutPageElements() {
    console.log('=== About Page Debug Info ===');
    console.log('Hero banner:', document.querySelector('.about-hero-banner') ? 'Found' : 'Not found');
    console.log('Hero content:', document.querySelector('.about-hero-content') ? 'Found' : 'Not found');
    console.log('Floating elements container:', document.querySelector('.about-floating-elements') ? 'Found' : 'Not found');
    console.log('Content cards:', document.querySelectorAll('.about-content-card').length);
    console.log('Metric boxes:', document.querySelectorAll('.about-metric-box').length);
    console.log('Infinity symbol:', document.querySelector('.about-infinity-symbol') ? 'Found' : 'Not found');
    console.log('Page container:', document.querySelector('.about-page-container') ? 'Found' : 'Not found');
    console.log('Body classes:', document.body.className);
    console.log('===============================');
}

// Run debug after a short delay
setTimeout(debugAboutPageElements, 100);

// Cleanup function
function cleanupAboutPage() {
    console.log('About page cleanup performed');
}

// Export utilities
if (typeof window !== 'undefined') {
    window.aboutPageUtils = {
        debug: debugAboutPageElements,
        cleanup: cleanupAboutPage,
        updateTheme: updateAboutFloatingElementsForTheme
    };
}

/**
 * Related Games System
 * Dynamically displays games with similar tags to the current game
 * Updated to work with /game.html?game=gamename URL format
 */

/**
 * Finds games with similar tags to the current game
 * @param {string} currentGameName - Name of the current game
 * @param {number} maxResults - Maximum number of related games to return
 * @returns {Array} Array of related games
 */
function findRelatedGames(currentGameName, maxResults = 5) {
    // Find the current game
    const currentGame = allGamesDatabase.find(game => 
        game.name.toLowerCase() === currentGameName.toLowerCase()
    );
    
    if (!currentGame) {
        console.warn(`Game "${currentGameName}" not found in database`);
        return [];
    }
    
    const currentTags = currentGame.tags;
    
    // Calculate similarity scores for all other games
    const gamesWithScores = allGamesDatabase
        .filter(game => game.id !== currentGame.id) // Exclude current game
        .map(game => {
            const commonTags = game.tags.filter(tag => currentTags.includes(tag));
            const score = commonTags.length;
            return {
                ...game,
                similarityScore: score,
                commonTags: commonTags
            };
        })
        .filter(game => game.similarityScore > 0) // Only games with at least one matching tag
        .sort((a, b) => {
            // Sort by similarity score first, then by name for consistency
            if (b.similarityScore !== a.similarityScore) {
                return b.similarityScore - a.similarityScore;
            }
            return a.name.localeCompare(b.name);
        })
        .slice(0, maxResults);
    
    return gamesWithScores;
}

/**
 * Converts relative image paths to absolute URLs
 * @param {string} imagePath - Relative image path from the database
 * @returns {string} Absolute image URL
 */
function getAbsoluteImageUrl(imagePath) {
    // If already absolute, return as is
    if (imagePath.startsWith('http') || imagePath.startsWith('//')) {
        return imagePath;
    }
    
    // If starts with /, it's absolute from root
    if (imagePath.startsWith('/')) {
        return imagePath;
    }
    
    // Convert relative path to absolute URL
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port ? ':' + window.location.port : '';
    return `${protocol}//${hostname}${port}/${imagePath}`;
}

/**
 * Enhanced function to convert game name to URL parameter format
 * @param {string} gameName - The game name
 * @returns {string} URL-friendly game parameter
 */
function gameNameToUrlParam(gameName) {
    return gameName
        .toLowerCase()
        .replace(/[^\w]/g, '');   // Remove all non-word characters (spaces, punctuation, etc.)
}

/**
 * Renders the related games section
 * Updated to use new URL format
 * @param {string} currentGameName - Name of the current game
 */
function showRelatedGames(currentGameName) {
    const container = document.getElementById('relatedGamesContainer');
    if (!container) {
        console.error('Related games container not found');
        return;
    }
    
    const relatedGames = findRelatedGames(currentGameName, 6);
    
    if (relatedGames.length === 0) {
        container.innerHTML = `
            <h3>Related Games</h3>
            <div class="no-games">No similar games found</div>
        `;
        return;
    }
    
    const gamesHTML = relatedGames.map(game => {
        const absoluteImageUrl = getAbsoluteImageUrl(game.image);
        const gameUrlParam = gameNameToUrlParam(game.name);
        const gameUrl = `/game.html?game=${gameUrlParam}`;
        
        return `
            <div class="game-item" data-game="${gameUrlParam}" onclick="navigateToGame('${gameUrl}')">
                <div class="game-thumbnail" style="background-image: url('${absoluteImageUrl}')"></div>
                <div class="game-details">
                    <h4>${game.name}</h4>
                    <p>Match: ${game.similarityScore} tag${game.similarityScore > 1 ? 's' : ''}</p>
                    <div class="game-tags">
                        ${game.commonTags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `
        <h3>Related Games</h3>
        <div class="related-games-grid">
            ${gamesHTML}
        </div>
    `;
}

/**
 * Navigates to a game page
 * Updated to work with /game.html?game=gamename format
 * @param {string} gameUrl - URL of the game OR game name
 */
function navigateToGame(gameUrl) {
    let finalUrl = gameUrl;
    
    // Check if URL is already absolute
    if (gameUrl.startsWith('http') || gameUrl.startsWith('//')) {
        finalUrl = gameUrl;
    } else if (gameUrl.startsWith('/game.html?game=')) {
        // Already in correct format
        finalUrl = gameUrl;
    } else if (gameUrl.startsWith('/')) {
        // Already absolute from root, keep as is
        finalUrl = gameUrl;
    } else {
        // Convert game name to new URL format
        // Assume gameUrl is either a game name or needs to be converted
        let gameName = gameUrl;
        
        // If it looks like old format, extract game name
        if (gameUrl.startsWith('games/') && gameUrl.endsWith('.html')) {
            gameName = gameUrl.replace('games/', '').replace('.html', '');
        }
        
        // Convert to URL-friendly format (lowercase, hyphens instead of spaces)
        const urlFriendlyName = gameName.toLowerCase().replace(/\s+/g, '-');
        
        // Create new format URL
        finalUrl = `/game.html?game=${encodeURIComponent(urlFriendlyName)}`;
    }
    
    // Navigate to the game page
    window.location.href = finalUrl;
}

/**
 * Gets the current game name from various sources
 * Updated to work with /game.html?game=gamename format
 * @returns {string|null} Current game name or null if not found
 */
function getCurrentGameName() {
    // Method 1: From URL parameters (NEW - for /game.html?game=gamename format)
    const urlParams = new URLSearchParams(window.location.search);
    const gameParam = urlParams.get('game');
    if (gameParam) {
        // Check if this matches any game in our database
        const foundGame = allGamesDatabase.find(game => 
            game.name.toLowerCase() === gameParam.toLowerCase() ||
            game.name.toLowerCase().replace(/\s+/g, '-') === gameParam.toLowerCase() ||
            game.name.toLowerCase().replace(/\s+/g, '') === gameParam.toLowerCase() ||
            game.name.toLowerCase() === gameParam.toLowerCase().replace(/-/g, ' ')
        );
        if (foundGame) return foundGame.name;
        
        // If not found by direct match, try converting parameter back to readable name
        const readableName = gameParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const foundByReadable = allGamesDatabase.find(game => 
            game.name.toLowerCase() === readableName.toLowerCase()
        );
        if (foundByReadable) return foundByReadable.name;
    }
    
    // Method 2: From data attribute on body
    const bodyGameName = document.body.dataset.currentGame;
    if (bodyGameName) return bodyGameName;
    
    // Method 3: From page title (assuming format like "Game Name - Your Site")
    const titleMatch = document.title.match(/^([^-]+)/);
    if (titleMatch) {
        const titleGameName = titleMatch[1].trim();
        // Check if this matches any game in our database
        const foundGame = allGamesDatabase.find(game => 
            game.name.toLowerCase() === titleGameName.toLowerCase()
        );
        if (foundGame) return foundGame.name;
    }
    
    // Method 4: From URL path (UPDATED - for new format)
    const urlPath = window.location.pathname;
    if (urlPath === '/game.html' || urlPath.endsWith('/game.html')) {
        // Already handled by Method 1 above
        return null;
    }
    
    // Method 5: Legacy support for old format /games/gamename.html
    const urlMatch = urlPath.match(/\/games\/([^\/]+)\.html$/);
    if (urlMatch) {
        const urlGameName = urlMatch[1];
        // Try to find matching game by URL
        const foundGame = allGamesDatabase.find(game => 
            game.url && game.url.includes(urlGameName)
        );
        if (foundGame) return foundGame.name;
    }
    
    // Method 6: From meta tag
    const metaGame = document.querySelector('meta[name="game-name"]');
    if (metaGame) return metaGame.content;
    
    return null;
}

/**
 * Initialize related games for the current page
 * Call this function when the page loads
 */
function initializeRelatedGames() {
    // Wait for database to be loaded
    if (typeof allGamesDatabase === 'undefined' || !allGamesDatabase.length) {
        console.warn('Games database not loaded yet');
        setTimeout(initializeRelatedGames, 100); // Retry after 100ms
        return;
    }
    
    const currentGameName = getCurrentGameName();
    
    if (currentGameName) {
        showRelatedGames(currentGameName);
    } else {
        // Fallback: show a random selection of games
        showRandomGames();
    }
}

/**
 * Shows a random selection of games when current game can't be determined
 * Updated to use new URL format
 * @param {number} count - Number of random games to show
 */
function showRandomGames(count = 6) {
    const container = document.getElementById('relatedGamesContainer');
    if (!container) return;
    
    // Get random games
    const shuffled = [...allGamesDatabase].sort(() => Math.random() - 0.5);
    const randomGames = shuffled.slice(0, count);
    
    const gamesHTML = randomGames.map(game => {
        const absoluteImageUrl = getAbsoluteImageUrl(game.image);
        const gameUrlParam = gameNameToUrlParam(game.name);
        const gameUrl = `/game.html?game=${gameUrlParam}`;
        
        return `
            <div class="game-item" data-game="${gameUrlParam}" onclick="navigateToGame('${gameUrl}')">
                <div class="game-thumbnail" style="background-image: url('${absoluteImageUrl}')"></div>
                <div class="game-details">
                    <h4>${game.name}</h4>
                    <p>Try this game!</p>
                    <div class="game-tags">
                        ${game.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `
        <h3>More Games</h3>
        <div class="related-games-grid">
            ${gamesHTML}
        </div>
    `;
}

/**
 * Advanced function to find related games by multiple criteria
 * @param {string} currentGameName - Name of the current game
 * @param {Object} options - Configuration options
 * @returns {Array} Array of related games
 */
function findAdvancedRelatedGames(currentGameName, options = {}) {
    const {
        maxResults = 6,
        minSimilarityScore = 1,
        prioritizeExactMatches = true,
        includePartialMatches = true
    } = options;
    
    const currentGame = allGamesDatabase.find(game => 
        game.name.toLowerCase() === currentGameName.toLowerCase()
    );
    
    if (!currentGame) return [];
    
    const currentTags = currentGame.tags;
    
    let candidates = allGamesDatabase
        .filter(game => game.id !== currentGame.id)
        .map(game => {
            const exactMatches = game.tags.filter(tag => currentTags.includes(tag));
            const score = exactMatches.length;
            
            return {
                ...game,
                similarityScore: score,
                commonTags: exactMatches,
                isExactMatch: score === currentTags.length && score === game.tags.length
            };
        })
        .filter(game => game.similarityScore >= minSimilarityScore);
    
    // Sort by priority: exact matches first, then by similarity score
    candidates.sort((a, b) => {
        if (prioritizeExactMatches && a.isExactMatch !== b.isExactMatch) {
            return b.isExactMatch - a.isExactMatch;
        }
        if (a.similarityScore !== b.similarityScore) {
            return b.similarityScore - a.similarityScore;
        }
        return a.name.localeCompare(b.name);
    });
    
    return candidates.slice(0, maxResults);
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeRelatedGames);

// Also provide a manual initialization function for dynamic content
window.RelatedGames = {
    show: showRelatedGames,
    find: findRelatedGames,
    findAdvanced: findAdvancedRelatedGames,
    init: initializeRelatedGames,
    showRandom: showRandomGames,
    getCurrentGame: getCurrentGameName
};

// New Releases JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const newGamesGrid = document.getElementById('newGamesGrid');
    
    // ADD THIS CHECK - Exit early if not on the new releases page
    if (!newGamesGrid) {
        console.log('Not on new releases page - skipping new games functionality');
        return;
    }
    
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreSection = document.getElementById('loadMoreSection');
    const emptyState = document.getElementById('emptyState');
    const gamesCountDisplay = document.querySelector('.games-count-display');
    const totalGamesCount = document.getElementById('totalGamesCount');

    let displayedGamesCount = 0;
    const gamesPerLoad = 12; // Load 12 games at a time
    
    // Check if gamesDatabase exists and has data
    if (typeof gamesDatabase === 'undefined' || !gamesDatabase || gamesDatabase.length === 0) {
        console.error('gamesDatabase is not loaded or empty');
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        if (newGamesGrid) {
            newGamesGrid.style.display = 'none';
        }
        if (loadMoreSection) {
            loadMoreSection.style.display = 'none';
        }
        return;
    }
    
    // Get the newest 30 games (assuming the games are ordered by ID, newest first)
    const newestGames = gamesDatabase.slice(-30).reverse();
    
    // Update count displays
    function updateCountDisplays() {
        const totalCount = newestGames.length;
        if (gamesCountDisplay) {
            gamesCountDisplay.textContent = `${totalCount} new games available`;
        }
        if (totalGamesCount) {
            totalGamesCount.textContent = totalCount;
        }
    }

    // Function to escape HTML and quotes
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Function to truncate description to approximately 2 lines
    function truncateDescription(description, maxLength = 120) {
        if (!description || description.length <= maxLength) {
            return { truncated: description || '', needsReadMore: false };
        }
        
        // Find a good place to cut (at a word boundary)
        let truncated = description.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > maxLength * 0.8) { // If last space is reasonably close to limit
            truncated = truncated.substring(0, lastSpace);
        }
        
        return { truncated: truncated + '...', needsReadMore: true };
    }

    // Create game card HTML with proper escaping
    function createGameCard(game, index) {
        if (!game || !game.name || !game.slug) {
            console.error('Invalid game data:', game);
            return '<div class="error-card">Invalid game data</div>';
        }

        const { truncated, needsReadMore } = truncateDescription(game.description);
        const cardId = `game-card-${index}`;
        
        // Escape all text content
        const gameName = escapeHtml(game.name);
        const gameImage = game.image || 'images/default-game.jpg';
        const gameSlug = game.slug;
        const truncatedDesc = escapeHtml(truncated);
        const fullDesc = escapeHtml(game.description || '');
        const gameTags = game.tags || [];
        
        return `
            <div class="new-game-card" onclick="playGame('${gameSlug}')">
                <div class="new-game-image">
                    <img src="${gameImage}" alt="${gameName}" loading="lazy" onerror="this.src='images/default-game.jpg'">
                    <div class="new-badge">New</div>
                    <div class="game-overlay">
                        <button class="play-button">
                            <i class="fas fa-play"></i>
                            Play Now
                        </button>
                    </div>
                </div>
                <div class="new-game-info">
                    <h3>${gameName}</h3>
                    <div class="new-game-description" id="desc-${cardId}">
                        <span class="description-text">${truncatedDesc}</span>
                        ${needsReadMore ? `
                            <span class="read-more-btn" onclick="event.stopPropagation(); toggleDescription('${cardId}')">
                                Read more
                            </span>
                        ` : ''}
                    </div>
                    <div class="new-game-tags">
                        ${gameTags.map(tag => `<span class="new-tag">${escapeHtml(tag)}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Store full descriptions for toggle function
    const gameDescriptions = {};

    // Load games function
    function loadGames() {
        const gamesToLoad = newestGames.slice(displayedGamesCount, displayedGamesCount + gamesPerLoad);
        
        if (gamesToLoad.length === 0) {
            if (loadMoreSection) {
                loadMoreSection.style.display = 'none';
            }
            return;
        }

        // Create and append game cards
        gamesToLoad.forEach((game, index) => {
            const cardIndex = displayedGamesCount + index;
            const cardId = `game-card-${cardIndex}`;
            
            // Store descriptions for toggle function
            gameDescriptions[cardId] = {
                full: game.description || '',
                truncated: truncateDescription(game.description || '').truncated
            };

            const gameCardHTML = createGameCard(game, cardIndex);
            
            // Create temporary container and check if HTML is valid
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = gameCardHTML;
            
            if (tempDiv.firstElementChild) {
                newGamesGrid.appendChild(tempDiv.firstElementChild);
            } else {
                console.error('Failed to create game card for:', game);
            }
        });

        displayedGamesCount += gamesToLoad.length;

        // Hide load more button if all games are loaded
        if (displayedGamesCount >= newestGames.length) {
            if (loadMoreSection) {
                loadMoreSection.style.display = 'none';
            }
        }

        // Update load more button text
        const remainingGames = newestGames.length - displayedGamesCount;
        if (remainingGames > 0 && loadMoreBtn) {
            loadMoreBtn.innerHTML = `
                <i class="fas fa-plus"></i>
                <span>Show ${Math.min(remainingGames, gamesPerLoad)} More Games</span>
            `;
        }
    }

    // Toggle description function - simplified
    window.toggleDescription = function(cardId) {
        const descElement = document.getElementById(`desc-${cardId}`);
        if (!descElement) return;
        
        const textElement = descElement.querySelector('.description-text');
        const readMoreBtn = descElement.querySelector('.read-more-btn');
        
        if (!textElement || !readMoreBtn) return;
        
        const descriptions = gameDescriptions[cardId];
        if (!descriptions) return;
        
        if (readMoreBtn.textContent.trim() === 'Read more') {
            textElement.textContent = descriptions.full;
            readMoreBtn.textContent = 'Show less';
            readMoreBtn.classList.add('expanded');
        } else {
            textElement.textContent = descriptions.truncated;
            readMoreBtn.textContent = 'Read more';
            readMoreBtn.classList.remove('expanded');
        }
    };

    // Play game function
    window.playGame = function(gameSlug) {
        if (gameSlug) {
            window.location.href = `game.html?game=${gameSlug}`;
        }
    };

    // Initialize the page
    function initializePage() {
        if (newestGames.length === 0) {
            // Show empty state if no games
            if (newGamesGrid) newGamesGrid.style.display = 'none';
            if (loadMoreSection) loadMoreSection.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
        } else {
            // Load initial games
            loadGames();
            updateCountDisplays();
            
            // Add event listener to load more button
            if (loadMoreBtn) {
                loadMoreBtn.addEventListener('click', loadGames);
            }
        }
    }

    // Start the initialization
    initializePage();

    // Add smooth scroll animation for new game cards
    function addScrollAnimation() {
        const gameCards = document.querySelectorAll('.new-game-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        gameCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    // Add animation after initial load
    setTimeout(addScrollAnimation, 100);

    // Re-run animation after loading more games
    const originalLoadGames = loadGames;
    loadGames = function() {
        originalLoadGames();
        setTimeout(addScrollAnimation, 100);
    };
});

// Homepage New Releases JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const homepageNewGamesGrid = document.getElementById('homepageNewGamesGrid');
    const homepageGamesCount = document.getElementById('homepageGamesCount');
    
    // Check if this is the homepage
    if (!homepageNewGamesGrid) return;
    
    // Check if gamesDatabase exists
    if (typeof gamesDatabase === 'undefined' || !gamesDatabase || gamesDatabase.length === 0) {
        console.error('gamesDatabase is not loaded for homepage');
        homepageNewGamesGrid.innerHTML = `
            <div class="loading-placeholder">
                <i class="fas fa-exclamation-circle"></i>
                <span>No new games available</span>
            </div>
        `;
        return;
    }
    
    // Number of games to show on homepage (always 8 to fill the grid)
    function getGamesToShow() {
        return 8; // Always show 8 games to fill the responsive grid properly
    }

    // Get the newest games for homepage
    const newestGames = gamesDatabase.slice(-30).reverse();
    const gamesToShow = getGamesToShow();
    const homepageGames = newestGames.slice(0, gamesToShow);

    // Update games count
    function updateHomepageCount() {
        if (homepageGamesCount) {
            homepageGamesCount.textContent = newestGames.length;
        }
    }

    // Function to escape HTML
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Create compact game card for homepage
    function createHomepageGameCard(game) {
        if (!game || !game.name || !game.slug) {
            return '<div class="error-card">Invalid game data</div>';
        }

        const gameName = escapeHtml(game.name);
        const gameImage = game.image || 'images/default-game.jpg';
        const gameSlug = game.slug;
        const gameTags = game.tags || [];

        return `
            <div class="homepage-game-card" onclick="playGame('${gameSlug}')">
                <div class="homepage-game-image">
                    <img src="${gameImage}" alt="${gameName}" loading="lazy" onerror="this.src='images/default-game.jpg'">
                    <div class="homepage-new-badge">New</div>
                    <div class="homepage-game-overlay">
                        <button class="homepage-play-button">
                            <i class="fas fa-play"></i>
                            Play Now
                        </button>
                    </div>
                </div>
                <div class="homepage-game-info">
                    <h3>${gameName}</h3>
                    <div class="homepage-game-tags">
                        ${gameTags.slice(0, 3).map(tag => `<span class="homepage-tag">${escapeHtml(tag)}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Load homepage games
    function loadHomepageGames() {
        // Clear loading placeholder
        homepageNewGamesGrid.innerHTML = '';

        if (homepageGames.length === 0) {
            homepageNewGamesGrid.innerHTML = `
                <div class="loading-placeholder">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>No new games available</span>
                </div>
            `;
            return;
        }

        // Create and append game cards
        homepageGames.forEach(game => {
            const gameCardHTML = createHomepageGameCard(game);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = gameCardHTML;
            
            if (tempDiv.firstElementChild) {
                homepageNewGamesGrid.appendChild(tempDiv.firstElementChild);
            } else {
                console.error('Failed to create homepage game card for:', game);
            }
        });

        // Update count
        updateHomepageCount();

        // Add entrance animation
        addHomepageAnimation();
    }

    // Play game function (reuse from main new releases if not already defined)
    if (typeof window.playGame === 'undefined') {
        window.playGame = function(gameSlug) {
            if (gameSlug) {
                window.location.href = `game.html?game=${gameSlug}`;
            }
        };
    }

    // Add entrance animation for homepage cards
    function addHomepageAnimation() {
        const gameCards = document.querySelectorAll('.homepage-game-card');
        gameCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100); // Stagger the animation
        });
    }

    // Handle window resize to adjust number of games shown
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newGamesToShow = getGamesToShow();
            if (newGamesToShow !== homepageGames.length) {
                // Reload with new number of games if screen size changed significantly
                location.reload();
            }
        }, 250);
    });

    // Initialize homepage new releases
    loadHomepageGames();
});

// Favorites Management
class FavoritesManager {
    constructor() {
        this.favorites = this.loadFavorites();
        this.init();
    }

    init() {
        // Initialize favorites page if we're on it
        if (window.location.pathname.includes('favorites.html')) {
            this.initFavoritesPage();
        }
        
        // Initialize game control bar if present
        this.initGameControlBar();
        
        // Initialize homepage favorites if on homepage
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            this.initHomepageFavorites();
        }
    }

    loadFavorites() {
        try {
            const stored = localStorage.getItem('infinitepixels_favorites');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading favorites:', error);
            return [];
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem('infinitepixels_favorites', JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }

    addToFavorites(gameSlug) {
        const game = gamesDatabase.find(g => g.slug === gameSlug);
        if (!game) return false;

        // Check if already favorited
        if (this.isFavorited(gameSlug)) return false;

        const favoriteData = {
            slug: gameSlug,
            dateAdded: new Date().toISOString(),
            timestamp: Date.now()
        };

        this.favorites.push(favoriteData);
        this.saveFavorites();
        return true;
    }

    removeFromFavorites(gameSlug) {
        const index = this.favorites.findIndex(fav => fav.slug === gameSlug);
        if (index === -1) return false;

        this.favorites.splice(index, 1);
        this.saveFavorites();
        return true;
    }

    isFavorited(gameSlug) {
        return this.favorites.some(fav => fav.slug === gameSlug);
    }

    toggleFavorite(gameSlug) {
        if (this.isFavorited(gameSlug)) {
            return this.removeFromFavorites(gameSlug);
        } else {
            return this.addToFavorites(gameSlug);
        }
    }

    getFavoriteGames(sortOrder = 'newest') {
        const favoriteGames = this.favorites.map(fav => {
            const game = gamesDatabase.find(g => g.slug === fav.slug);
            return game ? { ...game, dateAdded: fav.dateAdded, timestamp: fav.timestamp } : null;
        }).filter(Boolean);

        // Sort by date added
        if (sortOrder === 'oldest') {
            return favoriteGames.sort((a, b) => a.timestamp - b.timestamp);
        } else {
            return favoriteGames.sort((a, b) => b.timestamp - a.timestamp);
        }
    }

    initGameControlBar() {
        // Get current game from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const currentGame = urlParams.get('game');
        
        if (!currentGame) return;

        const gameControlBar = document.getElementById('gameControlBar');
        if (!gameControlBar) return;

        const gameControls = gameControlBar.querySelector('.game-controls');
        if (!gameControls) return;

        // Create favorite button
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'control-btn favorite-btn';
        favoriteBtn.id = 'favoriteBtn';
        
        const updateFavoriteBtn = () => {
            const isFav = this.isFavorited(currentGame);
            favoriteBtn.classList.toggle('favorited', isFav);
            favoriteBtn.innerHTML = `
                <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                <span>${isFav ? 'Favorited' : 'Favorite'}</span>
            `;
        };

        favoriteBtn.addEventListener('click', () => {
            this.toggleFavorite(currentGame);
            updateFavoriteBtn();
            
            // Show a brief feedback
            const originalText = favoriteBtn.querySelector('span').textContent;
            favoriteBtn.querySelector('span').textContent = this.isFavorited(currentGame) ? 'Added!' : 'Removed!';
            setTimeout(() => {
                updateFavoriteBtn();
            }, 1000);
        });

        // Insert favorite button before share button
        const shareBtn = document.getElementById('shareBtn');
        gameControls.insertBefore(favoriteBtn, shareBtn);
        
        // Initialize button state
        updateFavoriteBtn();
    }

    initFavoritesPage() {
        const favoritesGrid = document.getElementById('favoritesGrid');
        const noFavorites = document.getElementById('noFavorites');
        const favoritesFilter = document.getElementById('favoritesFilter');

        if (!favoritesGrid || !noFavorites) return;

        const renderFavorites = () => {
            const sortOrder = favoritesFilter?.value || 'newest';
            const favoriteGames = this.getFavoriteGames(sortOrder);

            if (favoriteGames.length === 0) {
                favoritesGrid.style.display = 'none';
                noFavorites.style.display = 'block';
                return;
            }

            favoritesGrid.style.display = 'grid';
            noFavorites.style.display = 'none';

            favoritesGrid.innerHTML = favoriteGames.map(game => {
                const gameUrl = `https://www.infinite-pixels.com/game.html?game=${game.slug}`;
                const dateAdded = new Date(game.dateAdded).toLocaleDateString();

                return `
                    <div class="favorite-game-card" onclick="window.location.href='${gameUrl}'">
                        <button class="remove-favorite-btn" onclick="event.stopPropagation(); this.removeFavorite('${game.slug}')" title="Remove from favorites">
                            <span class="minus-icon">−</span>
                        </button>
                        <div class="favorite-date">${dateAdded}</div>
                        <img src="${game.image}" alt="${game.name}" class="favorite-game-image">
                        <div class="favorite-game-info">
                            <h3>${game.name}</h3>
                            <p>${game.description}</p>
                        </div>
                    </div>
                `;
            }).join('');

            // Add event listeners to remove buttons
            favoritesGrid.querySelectorAll('.remove-favorite-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const gameSlug = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
                    this.removeFavoriteAndRefresh(gameSlug);
                });
            });
        };

        // Method to remove favorite and refresh the display
        this.removeFavoriteAndRefresh = (gameSlug) => {
            // Assuming you have a method to remove from favorites
            // Replace this with your actual favorite removal logic
            this.toggleFavorite(gameSlug); // or this.removeFavorite(gameSlug);
            renderFavorites(); // Re-render the favorites
        };

        // Initial render
        renderFavorites();

        // Filter change handler
        if (favoritesFilter) {
            favoritesFilter.addEventListener('change', renderFavorites);
        }
    }

    initHomepageFavorites() {
        // Create favorites section for homepage
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;

        // Check if favorites section already exists
        if (document.querySelector('.favorites-section')) return;

        const favoriteGames = this.getFavoriteGames('newest').slice(0, 6); // Show max 6 games

        if (favoriteGames.length === 0) return; // Don't show section if no favorites

        const favoritesSection = document.createElement('section');
        favoritesSection.className = 'favorites-section';

        const gamesList = favoriteGames.map(game => {
            const gameUrl = `https://www.infinite-pixels.com/game.html?game=${game.slug}`;
            return `
                <a href="${gameUrl}" class="favorite-item">
                    <img src="${game.image}" alt="${game.name}" class="favorite-item-image">
                    <div class="favorite-item-info">
                        <h4>${game.name}</h4>
                        <p>Added ${new Date(game.dateAdded).toLocaleDateString()}</p>
                    </div>
                </a>
            `;
        }).join('');

        favoritesSection.innerHTML = `
            <div class="favorites-section-header">
                <h2 class="favorites-section-title">Your Favorite Games</h2>
                <a href="favorites.html" class="view-all-favorites">View All →</a>
            </div>
            <div class="favorites-list">
                ${gamesList}
            </div>
        `;

        // Insert after the second section
        const sections = mainContent.querySelectorAll('section');
        if (sections.length >= 2) {
            const secondSection = sections[1];
            // insert after second section
            secondSection.parentNode.insertBefore(favoritesSection, secondSection.nextSibling);
        } else {
            // fallback if less than 2 sections
            mainContent.appendChild(favoritesSection);
        }
    }

    // Method to refresh homepage favorites (call when favorites change)
    refreshHomepageFavorites() {
        const existingSection = document.querySelector('.favorites-section');
        if (existingSection) {
            existingSection.remove();
        }
        this.initHomepageFavorites();
    }
}

// Initialize Favorites Manager
let favoritesManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    favoritesManager = new FavoritesManager();
});

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.FavoritesManager = FavoritesManager;
    window.favoritesManager = favoritesManager;
}

// Recently Played Manager
class RecentlyPlayedManager {
    constructor() {
        this.storageKey = 'infinitePixels_recentlyPlayed';
        this.maxGames = 24;
        this.init();
    }

    init() {
        // Load and display recently played games on page load
        this.displayRecentGames();
        
        // Set up event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Clear history button
        const clearBtn = document.getElementById('clearHistoryBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearHistory());
        }
    }

    // Add a game to recently played (call this when a game is accessed)
    addGameToRecent(gameSlug) {
        const game = gamesDatabase.find(g => g.slug === gameSlug);
        if (!game) return;

        let recentGames = this.getRecentGames();
        
        // Remove the game if it already exists (to move it to the front)
        recentGames = recentGames.filter(g => g.slug !== gameSlug);
        
        // Add the game to the beginning with current timestamp
        const gameWithTimestamp = {
            ...game,
            lastPlayed: Date.now()
        };
        
        recentGames.unshift(gameWithTimestamp);
        
        // Keep only the most recent games
        if (recentGames.length > this.maxGames) {
            recentGames = recentGames.slice(0, this.maxGames);
        }
        
        // Save to localStorage
        localStorage.setItem(this.storageKey, JSON.stringify(recentGames));
        
        // Refresh display if on recently played page
        if (document.getElementById('recentGamesGrid')) {
            this.displayRecentGames();
        }
    }

    getRecentGames() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading recent games:', error);
            return [];
        }
    }

    displayRecentGames() {
        const container = document.getElementById('recentGamesGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (!container) return;

        const recentGames = this.getRecentGames();
        
        if (recentGames.length === 0) {
            container.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        container.style.display = 'grid';
        if (emptyState) emptyState.style.display = 'none';

        container.innerHTML = recentGames.map(game => this.createGameCard(game)).join('');
    }

    createGameCard(game) {
        const timeAgo = this.formatTimeAgo(game.lastPlayed);
        
        return `
            <div class="game-card" onclick="window.location.href='https://www.infinite-pixels.com/game.html?game=${game.slug}'">
                <img src="${game.image}" alt="${game.name}" class="recent-game-image" 
                     onerror="this.src='images/placeholder-game.jpg'">
                <div class="game-info">
                    <h3 class="game-name">${game.name}</h3>
                    <div class="game-tags">
                        ${game.tags.map(tag => `<span class="game-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="last-played">
                        <i class="fas fa-clock"></i>
                        <span>Played ${timeAgo}</span>
                    </div>
                </div>
            </div>
        `;
    }

    formatTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        // For older dates, show actual date
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear your recently played games history?')) {
            localStorage.removeItem(this.storageKey);
            this.displayRecentGames();
        }
    }
}

// Initialize the recently played manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.recentlyPlayedManager = new RecentlyPlayedManager();
});

// Function to track game visits (add this to your game pages)
function trackGameVisit(gameSlug) {
    if (window.recentlyPlayedManager) {
        window.recentlyPlayedManager.addGameToRecent(gameSlug);
    } else {
        // If manager isn't loaded yet, try again after a short delay
        setTimeout(() => {
            if (window.recentlyPlayedManager) {
                window.recentlyPlayedManager.addGameToRecent(gameSlug);
            }
        }, 100);
    }
}

// Auto-track visits when on game.html page
if (window.location.pathname.includes('game.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const gameSlug = urlParams.get('game');
    if (gameSlug) {
        document.addEventListener('DOMContentLoaded', () => {
            trackGameVisit(gameSlug);
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
  // Get the current page (e.g. "games.html")
  const currentPage = window.location.pathname.split("/").pop();

  // Select all sidebar links
  const navLinks = document.querySelectorAll(".sidebar a");

  navLinks.forEach(link => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage || (linkPage === "index.html" && currentPage === "")) {
      link.classList.add("active");
    }
  });
});

class InfinitePixelsGameSection {
    constructor(sectionId, category, options = {}) {
        this.sectionId = sectionId;
        this.category = category.toLowerCase();
        this.maxGames = options.maxGames || null;
        this.customTitle = options.customTitle || null;
        this.customSubtitle = options.customSubtitle || null;
        this.showHeader = options.showHeader !== false;
        this.maxDescriptionLength = options.maxDescriptionLength || 100;
    }

    getElements() {
        return {
            section: document.getElementById(`${this.sectionId}-section`),
            title: document.getElementById(`${this.sectionId}-category-title`),
            subtitle: document.getElementById(`${this.sectionId}-category-subtitle`),
            grid: document.getElementById(`${this.sectionId}-games-grid`)
        };
    }

    getCategoryInfo() {
        const categoryInfo = {
            multiplayer: {
                title: 'Multiplayer Games',
            },
            racing: {
                title: 'Racing Games',
            },
            action: {
                title: 'Action Games',
            },
            shooter: {
                title: 'Shooter Games',
            },
            fighting: {
                title: '2 Player Games',
            },
            cars: {
                title: 'Car Games',
            },
            '3d': {
                title: '3D Games',
            },
            sports: {
                title: 'Sports Games',
            }
        };

        return categoryInfo[this.category] || {
            title: `${this.category.charAt(0).toUpperCase() + this.category.slice(1)} Games`,
        };
    }

    loadGames() {
        const elements = this.getElements();
        if (!elements.grid) return;

        let filteredGames = this.getGamesByCategory();

        if (this.maxGames && filteredGames.length > this.maxGames) {
            filteredGames = filteredGames.slice(0, this.maxGames);
        }

        if (filteredGames.length === 0) {
            elements.grid.innerHTML = `
                <div class="infinite-pixels-no-games">
                    <p>No games found in the "${this.category}" category.</p>
                    <p>Check back soon for new additions!</p>
                </div>
            `;
            return;
        }

        elements.grid.innerHTML = filteredGames.map(game => this.createGameCard(game)).join('');
        this.updateCategoryHeader();
    }

    updateCategoryHeader() {
        const elements = this.getElements();
        if (!this.showHeader) return;

        const categoryInfo = this.getCategoryInfo();
        const title = this.customTitle || categoryInfo.title;
        const subtitle = this.customSubtitle || categoryInfo.subtitle;

        if (elements.title) elements.title.textContent = title;
        if (elements.subtitle) elements.subtitle.textContent = subtitle;
    }

    getGamesByCategory() {
        if (typeof gamesDatabase === 'undefined') {
            console.warn('gamesDatabase not found');
            return [];
        }
        
        return gamesDatabase.filter(game => 
            game.tags && game.tags.some(tag => tag.toLowerCase() === this.category.toLowerCase())
        );
    }

    createGameCard(game) {
        const shortDescription = this.truncateDescription(game.description);
        const gamePageUrl = `https://www.infinite-pixels.com/game.html?game=${game.slug}`;

        return `
            <div class="infinite-pixels-game-card" data-game-id="${game.id}" data-section="${this.sectionId}">
                <img src="${game.image}" alt="${game.name}" class="infinite-pixels-game-image" onerror="this.src='images/placeholder-game.jpg'">
                <div class="infinite-pixels-game-content">
                    <a href="${gamePageUrl}" class="infinite-pixels-game-title">${game.name}</a>
                    <div class="infinite-pixels-game-tags">
                        ${game.tags.map(tag => `<span class="infinite-pixels-game-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="infinite-pixels-game-description">
                        <span class="infinite-pixels-description-preview">
                            ${shortDescription.text}
                            ${shortDescription.isTruncated ? 
                                `<button class="infinite-pixels-read-more-btn" onclick="infinitePixelsGameManager.toggleDescription('${this.sectionId}', ${game.id})">read more</button>` : 
                                ''
                            }
                        </span>
                        <span class="infinite-pixels-description-full" style="display: none;">
                            ${game.description}
                            <button class="infinite-pixels-read-more-btn" onclick="infinitePixelsGameManager.toggleDescription('${this.sectionId}', ${game.id})">read less</button>
                        </span>
                    </div>
                    <a href="${gamePageUrl}" class="infinite-pixels-play-button">Play Now</a>
                </div>
            </div>
        `;
    }

    truncateDescription(description) {
        if (!description || description.length <= this.maxDescriptionLength) {
            return { text: description || '', isTruncated: false };
        }

        const truncated = description.substring(0, this.maxDescriptionLength);
        const lastSpaceIndex = truncated.lastIndexOf(' ');
        
        return {
            text: truncated.substring(0, lastSpaceIndex > 0 ? lastSpaceIndex : this.maxDescriptionLength) + '...',
            isTruncated: true
        };
    }

    refresh(newCategory = null, newOptions = {}) {
        if (newCategory) this.category = newCategory.toLowerCase();
        Object.assign(this, newOptions);
        this.loadGames();
    }
}

class InfinitePixelsGameSectionsManager {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.sections = new Map();
        
        if (!this.container) {
            console.error(`Container not found: ${containerSelector}`);
            return;
        }
    }

    generateSectionHTML(sectionId, showHeader, category = '', viewMoreUrl = '') {
        // Generate the view more URL if not provided
        if (!viewMoreUrl && category) {
            viewMoreUrl = `https://www.infinite-pixels.com/category.html?category=${category.toLowerCase().replace(/\s+/g, '+')}`;
        }
    
        const viewMoreButton = viewMoreUrl ? `
            <a href="${viewMoreUrl}" class="infinite-pixels-view-more-btn">
                View More ${category} Games
            </a>
        ` : '';

        return `
            <section class="infinite-pixels-game-category-section" id="${sectionId}-section">
                ${showHeader ? `
                <div class="infinite-pixels-category-header">
                    <h2 class="infinite-pixels-category-title" id="${sectionId}-category-title"></h2>
                    <p class="infinite-pixels-category-subtitle" id="${sectionId}-category-subtitle"></p>
                    ${viewMoreButton}
                </div>
                ` : ''}
                <div class="infinite-pixels-games-grid" id="${sectionId}-games-grid">
                    <!-- Games will be populated here -->
                </div>
            </section>
        `;
    }

// Update the createSection method to pass category and custom URL
createSection(sectionId, category, options = {}) {
    const viewMoreUrl = options.viewMoreUrl || `https://www.infinite-pixels.com/category.html?category=${category.toLowerCase().replace(/\s+/g, '+')}`;
    const sectionHTML = this.generateSectionHTML(sectionId, options.showHeader !== false, category, viewMoreUrl);
    this.container.insertAdjacentHTML('beforeend', sectionHTML);
    
    const section = new InfinitePixelsGameSection(sectionId, category, options);
    this.sections.set(sectionId, section);
    
    setTimeout(() => section.loadGames(), 10);
    
    return section;
}

    removeSection(sectionId) {
        const sectionElement = document.getElementById(`${sectionId}-section`);
        if (sectionElement) {
            sectionElement.remove();
        }
        this.sections.delete(sectionId);
    }

    getSection(sectionId) {
        return this.sections.get(sectionId);
    }

    refreshAllSections() {
        this.sections.forEach(section => section.loadGames());
    }

    createMultipleSections(sectionsConfig) {
        sectionsConfig.forEach(config => {
            this.createSection(config.id, config.category, config.options || {});
        });
    }

    toggleDescription(sectionId, gameId) {
        const section = this.getSection(sectionId);
        if (!section) return;

        const gameCard = document.querySelector(`[data-game-id="${gameId}"][data-section="${sectionId}"]`);
        if (!gameCard) return;

        const preview = gameCard.querySelector('.infinite-pixels-description-preview');
        const full = gameCard.querySelector('.infinite-pixels-description-full');

        if (preview && full) {
            if (preview.style.display !== 'none') {
                preview.style.display = 'none';
                full.style.display = 'block';
            } else {
                preview.style.display = 'block';
                full.style.display = 'none';
            }
        }
    }
}

// Initialize the manager
const infinitePixelsGameManager = new InfinitePixelsGameSectionsManager('#infinite-pixels-game-sections-container');

// Create multiple sections automatically
infinitePixelsGameManager.createMultipleSections([
    {
        id: 'multiplayer-zone',
        category: 'multiplayer',
        options: {
            maxGames: 4,
            customTitle: 'Top Multiplayer Games',
            customSubtitle: ''
        }
    },
    {
        id: 'featured-racing',
        category: 'racing',
        options: {
            maxGames: 4,
            customTitle: 'Top Racing Games',
            customSubtitle: ''
        }
    },
    {
        id: 'top-action',
        category: 'action',
        options: {
            maxGames: 4,
            customTitle: 'Top Action Games',
            customSubtitle: ''
        }
    },
    {
        id: 'best-shooters',
        category: 'shooter',
        options: {
            maxGames: 4,
            customTitle: 'Top Shooter Games',
            customSubtitle: ''
        }
    },
    {
        id: '2-player',
        category: '2 player',
        options: {
            maxGames: 4,
            customTitle: 'Top 2 Player Games',
            customSubtitle: ''
        }
    },
    {
        id: 'car-collection',
        category: 'cars',
        options: {
            maxGames: 4,
            customTitle: 'Top Car Games',
            customSubtitle: ''
        }
    }
]);

// Optional utility functions
function refreshInfinitePixelsGameSections() {
    infinitePixelsGameManager.refreshAllSections();
}

function addInfinitePixelsGameSection(id, category, options = {}) {
    return infinitePixelsGameManager.createSection(id, category, options);
}

function removeInfinitePixelsGameSection(id) {
    infinitePixelsGameManager.removeSection(id);
}