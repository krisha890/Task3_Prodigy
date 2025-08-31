// Tic Tac Toe Game Class
class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = { X: 0, O: 0 };
        this.gameMode = 'pvp'; // 'pvp' or 'ai'
        this.aiThinking = false;
        
        // DOM elements
        this.cells = document.querySelectorAll('.cell');
        this.statusMessage = document.querySelector('.status-message');
        this.currentPlayerText = document.getElementById('current-player-text');
        this.scoreX = document.getElementById('score-x');
        this.scoreO = document.getElementById('score-o');
        this.playerX = document.getElementById('player-x');
        this.playerO = document.getElementById('player-o');
        this.resetBtn = document.getElementById('resetBtn');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.pvpModeBtn = document.getElementById('pvp-mode');
        this.aiModeBtn = document.getElementById('ai-mode');
        
        this.initializeEventListeners();
        this.updateDisplay();
    }
    
    initializeEventListeners() {
        // Cell click events
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });
        
        // Button events
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.newGameBtn.addEventListener('click', () => this.newGame());
        
        // Mode selection events
        this.pvpModeBtn.addEventListener('click', () => this.setGameMode('pvp'));
        this.aiModeBtn.addEventListener('click', () => this.setGameMode('ai'));
        
        // Add ripple effect to buttons
        this.addRippleEffect();
        
        // Add keyboard shortcuts
        this.addKeyboardShortcuts();
    }
    
    handleCellClick(e) {
        const cell = e.target;
        const index = parseInt(cell.dataset.index);
        
        if (this.board[index] !== '' || !this.gameActive || this.aiThinking) {
            return;
        }
        
        // Make move
        this.makeMove(index);
        
        // Check for win or draw
        if (this.checkWin()) {
            this.handleWin();
        } else if (this.checkDraw()) {
            this.handleDraw();
        } else {
            this.switchPlayer();
            
            // If AI mode and it's AI's turn, make AI move
            if (this.gameMode === 'ai' && this.currentPlayer === 'O') {
                this.makeAIMove();
            }
        }
        
        this.updateDisplay();
    }
    
    makeMove(index) {
        this.board[index] = this.currentPlayer;
        const cell = this.cells[index];
        
        // Add player symbol with animation
        cell.textContent = this.currentPlayer;
        cell.classList.add(this.currentPlayer.toLowerCase());
        
        // Add click sound effect (visual feedback)
        this.addClickEffect(cell);
    }
    
    checkWin() {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        
        for (let condition of winConditions) {
            const [a, b, c] = condition;
            if (this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                this.winningCombination = condition;
                return true;
            }
        }
        return false;
    }
    
    checkDraw() {
        return this.board.every(cell => cell !== '');
    }
    
    handleWin() {
        this.gameActive = false;
        this.scores[this.currentPlayer]++;
        
        // Highlight winning cells
        this.winningCombination.forEach(index => {
            this.cells[index].classList.add('winning');
        });
        
        // Update status
        const winnerName = this.currentPlayer === 'X' ? 'Player 1' : 
                          (this.gameMode === 'ai' ? 'AI' : 'Player 2');
        this.statusMessage.textContent = `${winnerName} wins! 🎉`;
        this.statusMessage.classList.add('winner');
        
        // Show notification
        this.showNotification(`${winnerName} wins! 🏆`, 'success');
        
        // Animate game card
        this.animateGameWon();
    }
    
    handleDraw() {
        this.gameActive = false;
        
        // Update status
        this.statusMessage.textContent = "It's a draw! 🤝";
        this.statusMessage.classList.add('draw');
        
        // Show notification
        this.showNotification("It's a draw! 🤝", 'info');
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        
        // Update player indicators
        this.playerX.classList.toggle('active', this.currentPlayer === 'X');
        this.playerO.classList.toggle('active', this.currentPlayer === 'O');
        
        // Update current player text
        const playerName = this.currentPlayer === 'X' ? 'Player 1' : 
                          (this.gameMode === 'ai' ? 'AI' : 'Player 2');
        this.currentPlayerText.textContent = `${playerName}'s Turn`;
    }
    
    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.aiThinking = false;
        
        // Clear board
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning');
        });
        
        // Reset status
        this.statusMessage.textContent = "Click any cell to start playing!";
        this.statusMessage.classList.remove('winner', 'draw');
        
        // Reset player indicators
        this.playerX.classList.add('active');
        this.playerO.classList.remove('active');
        
        // Update current player text
        this.currentPlayerText.textContent = "Player 1's Turn";
        
        // Show notification
        this.showNotification('Game reset! 🔄', 'info');
    }
    
    newGame() {
        // Reset scores
        this.scores = { X: 0, O: 0 };
        this.scoreX.textContent = '0';
        this.scoreO.textContent = '0';
        
        // Reset game
        this.resetGame();
        
        // Show notification
        this.showNotification('New game started! 🎮', 'success');
    }
    
    updateDisplay() {
        // Update scores
        this.scoreX.textContent = this.scores.X;
        this.scoreO.textContent = this.scores.O;
    }
    
    setGameMode(mode) {
        this.gameMode = mode;
        
        // Update button states
        this.pvpModeBtn.classList.toggle('active', mode === 'pvp');
        this.aiModeBtn.classList.toggle('active', mode === 'ai');
        
        // Update player names
        const playerOName = document.querySelector('#player-o .player-name');
        playerOName.textContent = mode === 'ai' ? 'AI' : 'Player 2';
        
        // Reset game when changing modes
        this.resetGame();
        
        // Show notification
        const modeText = mode === 'pvp' ? 'Player vs Player' : 'Player vs AI';
        this.showNotification(`Mode changed to ${modeText}! 🎮`, 'info');
    }
    
    makeAIMove() {
        if (!this.gameActive || this.aiThinking) return;
        
        this.aiThinking = true;
        this.statusMessage.textContent = "AI is thinking... 🤔";
        
        // Add a small delay to make AI feel more natural
        setTimeout(() => {
            const bestMove = this.findBestMove();
            this.makeMove(bestMove);
            
            // Check for win or draw
            if (this.checkWin()) {
                this.handleWin();
            } else if (this.checkDraw()) {
                this.handleDraw();
            } else {
                this.switchPlayer();
            }
            
            this.aiThinking = false;
            this.updateDisplay();
        }, 500 + Math.random() * 500); // Random delay between 500-1000ms
    }
    
    findBestMove() {
        // Simple AI strategy: try to win, block opponent, or take center/corners
        const availableMoves = this.board.map((cell, index) => cell === '' ? index : -1).filter(index => index !== -1);
        
        // 1. Try to win
        for (let move of availableMoves) {
            const testBoard = [...this.board];
            testBoard[move] = 'O';
            if (this.checkWinForBoard(testBoard, 'O')) {
                return move;
            }
        }
        
        // 2. Block opponent from winning
        for (let move of availableMoves) {
            const testBoard = [...this.board];
            testBoard[move] = 'X';
            if (this.checkWinForBoard(testBoard, 'X')) {
                return move;
            }
        }
        
        // 3. Take center if available
        if (this.board[4] === '') {
            return 4;
        }
        
        // 4. Take corners if available
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(corner => this.board[corner] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        
        // 5. Take any available edge
        const edges = [1, 3, 5, 7];
        const availableEdges = edges.filter(edge => this.board[edge] === '');
        if (availableEdges.length > 0) {
            return availableEdges[Math.floor(Math.random() * availableEdges.length)];
        }
        
        // Fallback to random move
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    checkWinForBoard(board, player) {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        
        for (let condition of winConditions) {
            const [a, b, c] = condition;
            if (board[a] === player && board[b] === player && board[c] === player) {
                return true;
            }
        }
        return false;
    }
    
    addClickEffect(cell) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = cell.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = rect.width / 2 - size / 2;
        const y = rect.height / 2 - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(59, 130, 246, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        cell.style.position = 'relative';
        cell.style.overflow = 'hidden';
        cell.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    addRippleEffect() {
        const buttons = document.querySelectorAll('.btn, .mode-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.4);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }
    
    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'KeyR':
                    this.resetGame();
                    break;
                case 'KeyN':
                    this.newGame();
                    break;
                case 'KeyM':
                    this.setGameMode(this.gameMode === 'pvp' ? 'ai' : 'pvp');
                    break;
                case 'Digit1':
                case 'Digit2':
                case 'Digit3':
                case 'Digit4':
                case 'Digit5':
                case 'Digit6':
                case 'Digit7':
                case 'Digit8':
                case 'Digit9':
                    const index = parseInt(e.code.replace('Digit', '')) - 1;
                    if (index >= 0 && index < 9) {
                        this.cells[index].click();
                    }
                    break;
            }
        });
    }
    
    animateGameWon() {
        const gameCard = document.querySelector('.game-card');
        gameCard.style.animation = 'gameWon 0.6s ease-in-out';
        setTimeout(() => {
            gameCard.style.animation = '';
        }, 600);
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-family: inherit;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }
}

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: 1rem;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
`;
document.head.appendChild(style);

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new TicTacToe();
    
    // Add entrance animation
    const gameCard = document.querySelector('.game-card');
    gameCard.style.opacity = '0';
    gameCard.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        gameCard.style.transition = 'all 0.8s ease';
        gameCard.style.opacity = '1';
        gameCard.style.transform = 'translateY(0)';
    }, 100);
    
    // Add keyboard instructions
    const instructions = document.createElement('div');
    instructions.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-family: inherit;
    `;
    instructions.innerHTML = '1-9: Move | R: Reset | N: New Game | M: Toggle Mode';
    document.body.appendChild(instructions);
    
    // Hide instructions after 5 seconds
    setTimeout(() => {
        instructions.style.opacity = '0';
        instructions.style.transition = 'opacity 0.5s ease';
        setTimeout(() => instructions.remove(), 500);
    }, 5000);
});

// Add performance optimization
let lastTime = 0;
function throttle(func, limit) {
    return function() {
        const now = Date.now();
        if (now - lastTime >= limit) {
            func.apply(this, arguments);
            lastTime = now;
        }
    }
}

// Optimize scroll events
const throttledScrollHandler = throttle(() => {
    // Any scroll-based functionality can go here
}, 16); // 60fps

window.addEventListener('scroll', throttledScrollHandler);
