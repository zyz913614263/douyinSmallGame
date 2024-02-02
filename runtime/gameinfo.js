const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

let atlas = new Image();
atlas.src = "res/images/Common.png";
let overAu = new Audio();
overAu.loop = false
overAu.src = "./res/audio/success.mp3";


export default class GameInfo {
    constructor(){
      this.overAuPlay = false
    }
    renderGameScore(ctx, score) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "20px Arial";

        ctx.fillText(score, 10, 30);
    }

    renderGameOver(ctx, score, personalHighScore) {
        if (this.overAuPlay == false){
          overAu.currenttime = 0;
          overAu.play();
          this.overAuPlay = true
        }
        ctx.drawImage(
            atlas,
            0,
            0,
            119,
            108,
            screenWidth / 2 - 150,
            screenHeight / 2 - 100,
            300,
            300
        );

        ctx.fillStyle = "#ffffff";
        ctx.font = "20px Arial";

        ctx.fillText(
            "游戏结束",
            screenWidth / 2 - 40,
            screenHeight / 2 - 100 + 50
        );

        ctx.fillText(
            "得分: " + score,
            screenWidth / 2 - 40,
            screenHeight / 2 - 100 + 130
        );

        if (personalHighScore) {
            ctx.fillText(
                "最高分: " + personalHighScore,
                screenWidth / 2 - 40,
                screenHeight / 2 - 100 + 160
            );
        }

        ctx.drawImage(
            atlas,
            120,
            6,
            39,
            24,
            screenWidth / 2 - 60,
            screenHeight / 2 - 100 + 180,
            120,
            40
        );

        ctx.fillText(
            "重新开始",
            screenWidth / 2 - 40,
            screenHeight / 2 - 100 + 205
        );

        /**
         * 重新开始按钮区域
         * 方便简易判断按钮点击
         */
        this.btnArea = {
            startX: screenWidth / 2 - 40,
            startY: screenHeight / 2 - 100 + 180,
            endX: screenWidth / 2 + 50,
            endY: screenHeight / 2 - 100 + 255,
        };
        return this.btnArea;
    }
}
