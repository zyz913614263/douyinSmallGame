import Player from "./player/player";
import DataBus from "./databus";
import BackGround from "./runtime/background";
import GameInfo from "./runtime/gameinfo";
import Enemy from "./npc/enemy";
import Music      from './runtime/music'
let databus = new DataBus();
//TODO DB

let systemInfo = tt.getSystemInfoSync();
let canvas = tt.createCanvas(),
    ctx = canvas.getContext("2d");

//背景音乐
let bgmAudio = new Audio();
bgmAudio.loop = true;
bgmAudio.src = "./res/audio/bgm.mp3";

/**
 * 游戏主函数
 */
export default class Main {
    constructor() {
        // 维护当前requestAnimationFrame的id
        this.aniId = 0;
        this.personalHighScore = null;
        this.clickAudio = new Audio();
        this.clickAudio.src = "./res/audio/click.mp3";

        this.btStartX = 0;
        this.btEndX = 0;
        this.btStartY = 0;
        this.btEndY = 0;

        this.start();
    }

    start() {
        databus.reset();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);

        ctx.fillStyle = "#000000";
        ctx.font = `${parseInt(systemInfo.windowWidth / 20)}px Arial`;
        ctx.fillText("无敌飞行员", 150, 200);

        const bt = tt.createImage();
        bt.src = "./res/images/btn_fill.png";

        bt.onload = () => {
            this.btStartX = systemInfo.windowWidth / 2 - 100;
            this.btStartY = systemInfo.windowHeight / 2 - 120 + 205;
            this.btEndX = this.btStartX + 200;
            this.btEndY = this.btStartY + 70;
            ctx.drawImage(
                bt,
                0,
                0,
                bt.width,
                bt.height,
                this.btStartX,
                this.btStartY,
                this.btEndX - this.btStartX,
                this.btEndY - this.btStartY
            );
            ctx.fillStyle = "#000000";
            ctx.font = `${parseInt(systemInfo.windowWidth / 20)}px Arial`;
            ctx.fillText(
                "开始 >>",
                systemInfo.windowWidth / 2 - 40,
                systemInfo.windowHeight / 2 - 100 + 225
            );
        };

        //bgmAudio.play()
        //if (count %2 == 0)
        //bgmAudio.pause()

        const icon = tt.createImage();
        icon.src = "./res/images/logo.png";

        icon.onload = () => {
            ctx.drawImage(
                icon,
                0,
                0,
                icon.width,
                icon.height,
                (systemInfo.windowWidth - 220) / 2,
                220,
                220,
                220
            );
        };

        /*const icon1 = tt.createImage();
        icon1.src = './res/icon1.png';
    
        icon1.onload = () => {
            ctx.drawImage(icon1, 0, 0, icon1.width, icon1.height, (systemInfo.windowWidth - 100)/2-10, 250, 120, 120);
        };*/
        tt.onTouchStart((e) => {
            let x = e.touches[0].clientX;
            let y = e.touches[0].clientY;

            if (
                x >= this.btStartX &&
                x <= this.btEndX &&
                y >= this.btStartY &&
                y <= this.btEndY
            ) {
                this.clickAudio.currenttime = 0;
                this.clickAudio.play();
                tt.offTouchStart();
                this.level1();
            }
        });

        this.gameinfo = new GameInfo();
        this.player = new Player(ctx);
        this.bg = new BackGround(ctx);
        this.bindLoop = this.loop.bind(this);
        this.hasEventBind = false;
        this.music    = new Music()

        // 清除上一局的动画
        window.cancelAnimationFrame(this.aniId);

        this.aniId = window.requestAnimationFrame(this.bindLoop, canvas);
    }

    level1() {
        databus.gameStart = true;
        this.player.initEvent(ctx);
        // ctx.fillStyle = "#ffffff";
        // ctx.fillRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);

        // this.player.img.onload = () => {
        //     this.player.drawToCanvas(ctx);
        //     this.player.initEvent(ctx);
        // };
    }

    /**
     * 随着帧数变化的敌机生成逻辑
     * 帧数取模定义成生成的频率
     */
    enemyGenerate() {
        if (databus.frame % 30 === 0) {
            let enemy = databus.pool.getItemByClass("enemy", Enemy);
            enemy.init(6);
            databus.enemys.push(enemy);
        }
    }

    // 全局碰撞检测
    collisionDetection() {

        databus.bullets.forEach((bullet) => {
            for (let i = 0, il = databus.enemys.length; i < il; i++) {
                let enemy = databus.enemys[i];

                if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
                    enemy.playAnimation();
                    this.music.playExplosion();

                    bullet.visible = false;
                    databus.score += 1;

                    break;
                }
            }
        });

        for (let i = 0, il = databus.enemys.length; i < il; i++) {
            let enemy = databus.enemys[i];

            if (this.player.isCollideWith(enemy)) {
                databus.gameOver = true;

                // 获取历史高分
                if (this.personalHighScore) {
                    if (databus.score > this.personalHighScore) {
                        this.personalHighScore = databus.score;
                    }
                }

                break;
            }
        }
    }

    /**
     * canvas重绘函数
     * 每一帧重新绘制所有的需要展示的元素
     */
    render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.bg.render(ctx);

        databus.bullets.forEach((item) => {
            item.drawToCanvas(ctx);
        });
        
        databus.enemys.forEach((item) => {
            item.drawToCanvas(ctx);
        });
        

        this.player.drawToCanvas(ctx);

        databus.animations.forEach((ani) => {
            if (ani.isPlaying) {
                ani.aniRender(ctx);
            }
        });

        this.gameinfo.renderGameScore(ctx, databus.score);
        // 游戏结束停止帧循环
        if (databus.gameOver) {
            let btAera = this.gameinfo.renderGameOver(
                ctx,
                databus.score,
                this.personalHighScore
            );

            if (!this.hasEventBind) {
                this.hasEventBind = true;
                tt.onTouchStart((e) =>{
                    let x = e.touches[0].clientX
                    let y = e.touches[0].clientY
                
                    let area = btAera
                
                    if (   x >= area.startX
                        && x <= area.endX
                        && y >= area.startY
                        && y <= area.endY  )
                     {
                         tt.offTouchStart()
                         this.start()
                     }})
            }
        }
    }

    // 游戏逻辑更新主函数
    update() {
        if (databus.gameOver) return;

        this.bg.update();

        databus.bullets.concat(databus.enemys).forEach((item) => {
            item.update();
        });

        this.enemyGenerate();

        this.collisionDetection();

        if (databus.frame % 20 === 0) {
            this.player.shoot()
            this.music.playShoot()
        }
    }

    // 实现游戏帧循环
    loop() {
        if (databus.gameStart == false) {
            this.aniId = window.requestAnimationFrame(this.bindLoop, canvas);
            return;
        }
        databus.frame++;

        this.update();
        this.render();

        this.aniId = window.requestAnimationFrame(this.bindLoop, canvas);
    }
}
