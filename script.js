const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

canvas.width = 400;
canvas.height = 600;

// 게임 변수
let score = 0;
let gameSpeed = 2; // 기본 낙하 속도
let isGameOver = false;

// 플레이어 설정
const player = {
    x: 200,
    y: 100,
    width: 30,
    height: 30,
    color: '#FFD700',
    dy: 0,
    jumpForce: -8,
    gravity: 0.4
};

// 발판(소라빵) 설정
const platforms = [];
const platformWidth = 80;
const platformHeight = 20;

function createPlatform(y) {
    const x = Math.random() * (canvas.width - platformWidth);
    platforms.push({ x, y, width: platformWidth, height: platformHeight });
}

// 초기 발판 생성
for (let i = 0; i < 6; i++) {
    createPlatform(i * 100 + 150);
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    // 캐릭터 대신 원형으로 그리기 (나중에 이미지로 교체 가능)
    ctx.beginPath();
    ctx.arc(player.x + player.width/2, player.y + player.height/2, player.width/2, 0, Math.PI * 2);
    ctx.fill();
}

function drawPlatforms() {
    ctx.fillStyle = '#D2B48C'; // 소라빵 색상 (황토색)
    platforms.forEach(p => {
        // 소라빵 모양을 둥글게 표현
        ctx.beginPath();
        ctx.ellipse(p.x + p.width/2, p.y + p.height/2, p.width/2, p.height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#8B4513';
        ctx.stroke();
    });
}

function update() {
    if (isGameOver) return;

    // 중력 적용
    player.dy += player.gravity;
    player.y += player.dy;

    // 키보드 조작 (간이 구현)
    window.onkeydown = (e) => {
        if (e.key === 'ArrowLeft') player.x -= 20;
        if (e.key === 'ArrowRight') player.x += 20;
    };

    // 화면 밖으로 나가는 것 방지
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;

    // 발판 이동 및 충돌 체크
    platforms.forEach((p, index) => {
        p.y -= gameSpeed; // 화면이 위로 올라가는 연출 (캐릭터가 떨어짐)

        // 충돌 판정 (내려올 때만 밟음)
        if (player.dy > 0 &&
            player.x < p.x + p.width &&
            player.x + player.width > p.x &&
            player.y + player.height > p.y &&
            player.y + player.height < p.y + p.height + 10) {
            
            player.dy = player.jumpForce; // 딛고 점프!
            score++;
            scoreElement.innerText = score;

            // 난이도 조절: 30점이 넘으면 속도 증가
            if (score > 30) {
                gameSpeed = 4; // 속도 업
            }
        }

        // 화면 밖으로 나간 발판 재활용
        if (p.y < -20) {
            platforms.splice(index, 1);
            createPlatform(canvas.height);
        }
    });

    // 게임 오버 조건: 화면 위로 너무 올라가거나 바닥으로 떨어졌을 때
    if (player.y > canvas.height || player.y < -50) {
        isGameOver = true;
        alert("게임 오버! 점수: " + score);
        location.reload();
    }
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    drawPlatforms();
    drawPlayer();
    requestAnimationFrame(loop);
}

loop();