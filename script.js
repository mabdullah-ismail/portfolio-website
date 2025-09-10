document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navbarCollapse.classList.remove('show');
            });
        });
    }
    
    // Add visual effects to interactive elements
    const interactiveElements = document.querySelectorAll('.cyberButton, .contactLink, .projectCard, .infoCard, .nav-link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            element.classList.add('neon-glow');
        });
        
        element.addEventListener('mouseleave', function() {
            element.classList.remove('neon-glow');
        });
    });
    
    // Cursor trail effect
    const cursorTrail = document.createElement('div');
    cursorTrail.className = 'cursor-trail';
    document.body.appendChild(cursorTrail);
    
    const trail = [];
    const trailLength = 20;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        cursorTrail.appendChild(dot);
        trail.push({
            element: dot,
            x: 0,
            y: 0,
            delay: i * 2
        });
    }
    
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animate() {
        let x = mouseX;
        let y = mouseY;
        
        trail.forEach((dot, index) => {
            const nextDot = trail[index + 1] || trail[0];
            
            dot.x = x;
            dot.y = y;
            
            dot.element.style.left = `${x}px`;
            dot.element.style.top = `${y}px`;
            dot.element.style.opacity = 1 - (index / trailLength);
            dot.element.style.transform = `scale(${1 - (index / trailLength) * 0.5})`;
            
            // Add glitch effect randomly
            if (Math.random() > 0.97) {
                dot.element.style.left = `${x + (Math.random() * 10 - 5)}px`;
                dot.element.style.top = `${y + (Math.random() * 10 - 5)}px`;
                setTimeout(() => {
                    dot.element.style.left = `${x}px`;
                    dot.element.style.top = `${y}px`;
                }, 50);
            }
            
            x += (nextDot.x - dot.x) * 0.3;
            y += (nextDot.y - dot.y) * 0.3;
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Initialize skill bars animation
    function initSkillBars() {
        const skillBars = document.querySelectorAll('.skill-bar');
        
        // Set initial width to 0
        skillBars.forEach(bar => {
            bar.style.width = '0%';
        });
        
        // Create observer for skill bars
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const level = bar.getAttribute('data-level');
                    
                    // Animate the skill bar width
                    setTimeout(() => {
                        bar.style.width = level + '%';
                    }, 200);
                    
                    // Add glitch effect randomly
                    const glitchInterval = setInterval(() => {
                        if (Math.random() > 0.7) {
                            const currentWidth = parseInt(bar.style.width);
                            bar.style.width = (currentWidth + Math.random() * 10 - 5) + '%';
                            
                            setTimeout(() => {
                                bar.style.width = level + '%';
                            }, 150);
                        }
                    }, 2000);
                    
                    // Stop observing after animation
                    skillObserver.unobserve(bar);
                }
            });
        }, { threshold: 0.2 });
        
        // Observe all skill bars
        skillBars.forEach(bar => {
            skillObserver.observe(bar);
        });
    }
    
    // Initialize skill bars
    initSkillBars();
    
    // Mini-Game Easter Egg
    const easterEggTrigger = document.getElementById('easter-egg-trigger');
    const miniGame = document.getElementById('mini-game');
    const closeGame = document.getElementById('close-game');
    const startGame = document.getElementById('start-game');
    const gameArea = document.getElementById('game-area');
    const player = document.getElementById('player');
    const scoreDisplay = document.getElementById('game-score');
    
    let gameActive = false;
    let playerPosition = 50; // percentage
    let score = 0;
    let speed = 2;
    let obstacles = [];
    let gameLoop;
    
    // Show game on click
    easterEggTrigger.addEventListener('click', function(e) {
        e.preventDefault();
        miniGame.classList.add('active');
    });
    
    // Close game
    closeGame.addEventListener('click', function() {
        miniGame.classList.remove('active');
        resetGame();
    });
    
    // Start game
    startGame.addEventListener('click', function() {
        if (!gameActive) {
            startGameplay();
        }
    });
    
    // Game controls - Keyboard
    document.addEventListener('keydown', function(e) {
        if (gameActive) {
            if ((e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') && playerPosition > 0) {
                playerPosition -= 5;
            } else if ((e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') && playerPosition < 100) {
                playerPosition += 5;
            }
            player.style.left = playerPosition + '%';
        }
    });
    
    // Game controls - Touch/Mobile
    let touchStartX = 0;
    gameArea.addEventListener('touchstart', function(e) {
        if (gameActive) {
            touchStartX = e.touches[0].clientX;
            e.preventDefault();
        }
    }, { passive: false });
    
    gameArea.addEventListener('touchmove', function(e) {
        if (gameActive) {
            const touchX = e.touches[0].clientX;
            const diff = touchX - touchStartX;
            const movePercent = (diff / gameArea.offsetWidth) * 100;
            
            playerPosition = Math.max(0, Math.min(100, playerPosition + movePercent));
            player.style.left = playerPosition + '%';
            
            touchStartX = touchX;
            e.preventDefault();
        }
    }, { passive: false });
    
    // Add control buttons for mobile
    const leftBtn = document.getElementById('control-left');
    const rightBtn = document.getElementById('control-right');
    
    if (leftBtn && rightBtn) {
        leftBtn.addEventListener('touchstart', function(e) {
            if (gameActive && playerPosition > 0) {
                const moveInterval = setInterval(() => {
                    playerPosition = Math.max(0, playerPosition - 2);
                    player.style.left = playerPosition + '%';
                }, 20);
                
                leftBtn.addEventListener('touchend', function() {
                    clearInterval(moveInterval);
                }, { once: true });
            }
            e.preventDefault();
        }, { passive: false });
        
        rightBtn.addEventListener('touchstart', function(e) {
            if (gameActive && playerPosition < 100) {
                const moveInterval = setInterval(() => {
                    playerPosition = Math.min(100, playerPosition + 2);
                    player.style.left = playerPosition + '%';
                }, 20);
                
                rightBtn.addEventListener('touchend', function() {
                    clearInterval(moveInterval);
                }, { once: true });
            }
            e.preventDefault();
        }, { passive: false });
    }
    
    // Start gameplay
    function startGameplay() {
        gameActive = true;
        score = 0;
        speed = 2;
        scoreDisplay.textContent = score;
        startGame.textContent = 'RUNNING';
        
        // Clear existing obstacles
        obstacles.forEach(obstacle => {
            if (obstacle.element && obstacle.element.parentNode) {
                obstacle.element.parentNode.removeChild(obstacle.element);
            }
        });
        obstacles = [];
        
        // Game loop
        gameLoop = setInterval(function() {
            // Create new obstacle randomly
            if (Math.random() > 0.95) {
                createObstacle();
            }
            
            // Move obstacles
            moveObstacles();
            
            // Check collisions
            checkCollisions();
            
            // Increase score
            score++;
            scoreDisplay.textContent = score;
            
            // Increase speed gradually
            if (score % 500 === 0) {
                speed += 0.5;
            }
        }, 20);
    }
    
    // Create obstacle
    function createObstacle() {
        const obstacle = document.createElement('div');
        obstacle.className = 'game-obstacle';
        
        // Random position
        const posX = Math.random() * 100;
        obstacle.style.left = posX + '%';
        obstacle.style.top = '-20px';
        
        // Random size (more challenging)
        const size = 10 + Math.random() * 20;
        obstacle.style.width = size + 'px';
        obstacle.style.height = size + 'px';
        
        // Add to game area
        gameArea.appendChild(obstacle);
        
        // Add to obstacles array
        obstacles.push({
            element: obstacle,
            position: { x: posX, y: 0 }
        });
    }
    
    // Move obstacles
    function moveObstacles() {
        obstacles.forEach((obstacle, index) => {
            obstacle.position.y += speed;
            obstacle.element.style.top = obstacle.position.y + 'px';
            
            // Remove if out of bounds
            if (obstacle.position.y > gameArea.offsetHeight) {
                gameArea.removeChild(obstacle.element);
                obstacles.splice(index, 1);
            }
        });
    }
    
    // Check collisions
    function checkCollisions() {
        const playerRect = player.getBoundingClientRect();
        
        obstacles.forEach(obstacle => {
            const obstacleRect = obstacle.element.getBoundingClientRect();
            
            if (playerRect.left < obstacleRect.right && 
                playerRect.right > obstacleRect.left && 
                playerRect.top < obstacleRect.bottom && 
                playerRect.bottom > obstacleRect.top) {
                // Collision detected
                gameOver();
            }
        });
    }
    
    // Game over
    function gameOver() {
        gameActive = false;
        clearInterval(gameLoop);
        startGame.textContent = 'RETRY';
        
        // Add glitch effect
        gameArea.classList.add('glitch');
        
        // Show game over message
        const gameOverMsg = document.querySelector('.game-over-message');
        gameOverMsg.classList.add('visible');
        
        setTimeout(() => {
            gameArea.classList.remove('glitch');
            setTimeout(() => {
                gameOverMsg.classList.remove('visible');
            }, 500);
        }, 1000);
    }
    
    // Reset game
    function resetGame() {
        gameActive = false;
        clearInterval(gameLoop);
        score = 0;
        scoreDisplay.textContent = score;
        startGame.textContent = 'START';
        
        // Clear obstacles
        obstacles.forEach(obstacle => {
            if (obstacle.element && obstacle.element.parentNode) {
                obstacle.element.parentNode.removeChild(obstacle.element);
            }
        });
        obstacles = [];
        
        // Reset player position
        playerPosition = 50;
        player.style.left = playerPosition + '%';
        
        // Hide game over message
        const gameOverMsg = document.querySelector('.game-over-message');
        gameOverMsg.classList.remove('visible');
        
        // Remove glitch effect
        gameArea.classList.remove('glitch');
    }
});