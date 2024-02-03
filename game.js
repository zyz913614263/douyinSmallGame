//console.log('使用抖音开发者工具开发过程中可以参考以下文档:')
//console.log('https://developer.open-douyin.com/docs/resource/zh-CN/mini-game/guide/minigame/introduction');
//import './libs/weapp-adapter'
//import './libs/symbol'
import Main from "./main";

//const db = await cloud.database();
//const res = await db.collection('demo').get(); 

let main = new Main();

tt.onShow(()=>{
    let isExist = tt.checkScene()
    if (isExist){
        /*tt.navigateToScene({
            scene:'sidebar',
            fail:console.log,
            success:console.log,
        })*/
    }else{
        /*tt.navigateToScene({
            scene:'sidebar',
            fail:console.log,
            success:console.log,
        })*/
    }
})

let is = tt.checkShortcut()
if (is == false){
    tt.addShortcut()
}
