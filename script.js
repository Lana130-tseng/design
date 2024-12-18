const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 設定畫布大小
canvas.width = 1000;
canvas.height = 600;
canvas.backgroundcolor="#D0D0D0"
// 玩家類別
class Player {
    constructor() {
        this.width = 300;
        this.height = 300;
        this.x = canvas.width / 100;
        this.y = canvas.height/ 500;
        this.speed = 7;
        this.jumpPower = -15;
        this.velocity = 0;
        this.gravity = 0.8;
        this.isJumping = false;
        this.direction = 1; // 1 表示向右，-1 表示向左
        this.frameIndex = 1; // 當前動畫幀
        this.frameCount = 5; // 總幀數
        this.frameTimer = 0; // 幀計時器
        this.frameInterval = 100; // 幀切換間隔（毫秒）
        
        // 載入所有圖片
        this.images = [];
        for (let i = 1; i <= this.frameCount; i++) {
            const img = new Image();
            img.src = `https://github.com/Lana130-tseng/design/a.png`;
            this.images.push(img);
        }
        this.currentImage = this.images[0];

        // 新增文字提示相關屬性
        this.showText = false;
        this.textTimer = null;
    }

    move(direction) {
        this.x += direction * this.speed;
        this.direction = direction;
        this.x = Math.max(0, Math.min(this.x, canvas.width - this.width));
        
        // 更新動畫幀
        const now = Date.now();
        if (now - this.frameTimer > this.frameInterval) {
            this.frameTimer = now;
            this.frameIndex = (this.frameIndex % this.frameCount) + 1;
            this.currentImage = this.images[this.frameIndex - 1];
        }
    }

    jump() {
        if (!this.isJumping) {
            this.velocity = this.jumpPower;
            this.isJumping = true;
            
            // 顯示文字
            this.showText = true;
            
            // 清除之前的計時器（如果存在）
            if (this.textTimer) {
                clearTimeout(this.textTimer);
            }
            
            // 設定5秒後隱藏文字
            this.textTimer = setTimeout(() => {
                this.showText = false;
            }, 5000);
        }
    }

    update() {
        // 重力效果
        this.velocity += this.gravity;
        this.y += this.velocity;

        // 確保玩家不會掉出畫布底部
        if (this.y > canvas.height - 300) {
            this.y = canvas.height - 300;
            this.velocity = 0;
            this.isJumping = false;
        }
    }

    draw() {
        // 繪製角色
        if (this.direction < 0) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(this.currentImage, -this.x - this.width, this.y, this.width, this.height);
            ctx.restore();
        } else {
            ctx.drawImage(this.currentImage, this.x, this.y, this.width, this.height);
        }

        // 如果需要顯示文字
        if (this.showText) {
            ctx.save();
            ctx.font = '36px Arial';
            ctx.fillStyle = 'purple';
            ctx.textAlign = 'center';
            // 將文字顯示在角色上方
            ctx.fillText('認真上課!', this.x + this.width/2, this.y - 20);
            ctx.restore();
        }
    }
}

const player = new Player();

// 按鍵狀態
const keys = {
    left: false,
    right: false,
    up: false
};

// 監聽按鍵事件
window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            keys.left = true;
            break;
        case 'ArrowRight':
            keys.right = true;
            break;
        case 'ArrowUp':
            keys.up = true;
            player.jump();
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            keys.left = false;
            break;
        case 'ArrowRight':
            keys.right = false;
            break;
        case 'ArrowUp':
            keys.up = false;
            break;
    }
});

// 遊戲主迴圈
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新玩家位置
    if (keys.left) {
        player.move(-1);
    } else if (keys.right) {
        player.move(1);
    } else {
        // 靜止狀態使用第一幀
        player.currentImage = player.images[0];
    }
    
    player.update();
    player.draw();

    requestAnimationFrame(gameLoop);
}

// 確保所有圖片都載入後才開始遊戲
let loadedImages = 0;
player.images.forEach(img => {
    img.onload = () => {
        loadedImages++;
        if (loadedImages === player.frameCount) {
            gameLoop();
        }
    };
}); 
