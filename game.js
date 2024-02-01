//console.log('使用抖音开发者工具开发过程中可以参考以下文档:')
//console.log('https://developer.open-douyin.com/docs/resource/zh-CN/mini-game/guide/minigame/introduction');

import Player     from './grid'

let systemInfo = tt.getSystemInfoSync()
let canvas = tt.createCanvas(),
ctx = canvas.getContext('2d');

let count = 1
//背景音乐
let bgmAudio = new Audio()
bgmAudio.loop = true
bgmAudio.src  = './res/audio/bgm.mp3'

let clickAudio  = new Audio()
clickAudio.src  = './res/audio/click.mp3'

let btStartX = 0
let btEndX = 0
let btStartY = 0
let btEndY = 0



function level1(){
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight)
    let player   = new Player(ctx)
    player.img.onload = () => {
        player.drawToCanvas(ctx)
        player.initEvent(ctx)
    }
     
    
}

function start(){
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight)

    ctx.fillStyle = '#000000'
    ctx.font = `${parseInt(systemInfo.windowWidth / 20)}px Arial`
    ctx.fillText('开 心 方 块', 150, 200)
    

    const bt = tt.createImage();
    bt.src = './res/images/btn_fill.png';
    

    bt.onload = () => {
        btStartX = systemInfo.windowWidth / 2-100
        btStartY = systemInfo.windowHeight / 2 - 120 + 205
        btEndX = btStartX + 200
        btEndY = btStartY + 70
        ctx.drawImage(bt, 0, 0, bt.width, bt.height,btStartX, btStartY, btEndX-btStartX, btEndY-btStartY);
        ctx.fillStyle = '#000000'
        ctx.font = `${parseInt(systemInfo.windowWidth / 20)}px Arial`
        ctx.fillText(
            '开始 >>',
            systemInfo.windowWidth / 2 - 40,
            systemInfo.windowHeight / 2 - 100 + 225
        )
    };    

    
    //bgmAudio.play()
    //if (count %2 == 0)
        //bgmAudio.pause()

    const icon = tt.createImage();
    icon.src = './res/images/icon.png';

    icon.onload = () => {
        ctx.drawImage(icon, 0, 0, icon.width, icon.height, (systemInfo.windowWidth - 220)/2, 220, 220, 220);
    };

    /*const icon1 = tt.createImage();
    icon1.src = './res/icon1.png';

    icon1.onload = () => {
        ctx.drawImage(icon1, 0, 0, icon1.width, icon1.height, (systemInfo.windowWidth - 100)/2-10, 250, 120, 120);
    };*/

    

}

function draw() {   
    start()

    tt.onTouchStart((e)=> {

        let x = e.touches[0].clientX
        let y = e.touches[0].clientY


        if (   x >= btStartX
            && x <= btEndX
            && y >= btStartY
            && y <= btEndY  ){
                count++
                clickAudio.currentTime = 0
                clickAudio.play()
                tt.offTouchStart()
                level1()
            }
            
    })

    /*tt.onTouchMove((e)=> {
    
        let x = e.touches[0].clientX
        let y = e.touches[0].clientY

        ctx.fillText(
            '<',
            x,y
          )
    
    })*/

    


    //const bg = tt.createImage();
    //bg.src = './res/bg.png';






    //bg.onload = () => {
        //ctx.drawImage(bg, 0, 0, bg.width, bg.height, -20, -20, systemInfo.windowWidth+40, systemInfo.windowHeight+50);
       
    //};


   
}

draw();

