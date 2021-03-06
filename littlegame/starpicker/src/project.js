window.__require=function t(e,i,s){function n(a,o){if(!i[a]){if(!e[a]){var h=a.split("/");if(h=h[h.length-1],!e[h]){var r="function"==typeof __require&&__require;if(!o&&r)return r(h,!0);if(c)return c(h,!0);throw new Error("Cannot find module '"+a+"'")}}var u=i[a]={exports:{}};e[a][0].call(u.exports,function(t){return n(e[a][1][t]||t)},u,u.exports,t,e,i,s)}return i[a].exports}for(var c="function"==typeof __require&&__require,a=0;a<s.length;a++)n(s[a]);return n}({Game:[function(t,e,i){"use strict";cc._RF.push(e,"5a62eMyHrFG1IvvbzFq/tvn","Game");var s=t("Player");cc.Class({extends:cc.Component,properties:{starPrefab:{default:null,type:cc.Prefab},maxStarDuration:0,minStarDuration:0,ground:{default:null,type:cc.Node},player:{default:null,type:s},scoreDisplay:{default:null,type:cc.Label},scoreAudio:{default:null,type:cc.AudioClip},btnStart:{default:null,type:cc.Node},lblGameOver:{default:null,type:cc.Node},labelHint:{default:null,type:cc.Label},keyboardHint:{default:"",multiline:!0},touchHint:{default:"",multiline:!0}},onLoad:function(){this.groundY=this.ground.y+this.ground.height/2,this.lblGameOver.active=!1;var t=cc.sys.isMobile?this.touchHint:this.keyboardHint;this.labelHint.string=t},onStartGame:function(){this.lblGameOver.active=!1,this.enabled=!0,this.timer=0,this.starDuration=0,this.score=0,this.spawnNewStar(),this.score=0,this.btnStart.x=3e3,this.player.startMoveAt(cc.v2(0,this.groundY))},spawnNewStar:function(){var t=cc.instantiate(this.starPrefab);this.node.addChild(t),t.setPosition(this.getNewStarPosition()),t.getComponent("Star").game=this,this.curStar=t,this.starDuration=this.maxStarDuration-(1-1/(Math.log(this.score+1)+1))*(this.maxStarDuration-this.minStarDuration),this.timer=0},getNewStarPosition:function(){var t,e=this.groundY+Math.random()*this.player.getComponent("Player").jumpHeight+50,i=this.node.width/2*.8;return t=2*(Math.random()-.5)*i,cc.v2(t,e)},gainScore:function(){this.score+=1,this.scoreDisplay.string="Score: "+this.score,cc.audioEngine.playEffect(this.scoreAudio,!1)},gameOver:function(){this.lblGameOver.active=!0,this.player.stopMove(),this.curStar.destroy(),this.btnStart.x=0},update:function(t){if(this.timer>this.starDuration)return this.gameOver(),void(this.enabled=!1);this.timer+=t}}),cc._RF.pop()},{Player:"Player"}],Player:[function(t,e,i){"use strict";cc._RF.push(e,"83db7bgPkdKyaSJ+iAjOBIu","Player"),cc.Class({extends:cc.Component,properties:{jumpHeight:0,jumpDuration:0,maxMoveSpeed:0,accel:0,elas:0,minSpeed:0,canvas:{default:null,type:cc.Node},jumpAudio:{default:null,type:cc.AudioClip}},setJumpAction:function(){var t=cc.moveBy(this.jumpDuration,cc.v2(0,this.jumpHeight)).easing(cc.easeCubicActionOut()),e=cc.moveBy(this.jumpDuration,cc.v2(0,-this.jumpHeight)).easing(cc.easeCubicActionIn()),i=cc.callFunc(this.playJumpSound,this);return cc.repeatForever(cc.sequence(t,e,i))},playJumpSound:function(){cc.audioEngine.playEffect(this.jumpAudio,!1)},onKeyDown:function(t){switch(t.keyCode){case cc.macro.KEY.a:this.accLeft=!0;break;case cc.macro.KEY.d:this.accRight=!0}},onKeyUp:function(t){switch(t.keyCode){case cc.macro.KEY.a:this.accLeft=!1;break;case cc.macro.KEY.d:this.accRight=!1}},onTouchStart:function(t){t.getLocation().x>=cc.winSize.width/2?(this.accLeft=!1,this.accRight=!0):(this.accLeft=!0,this.accRight=!1)},onTouchEnd:function(t){this.accLeft=!1,this.accRight=!1},startMoveAt:function(t){this.enabled=!0,this.xSpeed=0,this.node.setPosition(t),this.node.runAction(this.jumpAction)},stopMove:function(){this.enabled=!1,this.xSpeed=0,this.node.stopAllActions()},onLoad:function(){this.enabled=!1,this.accLeft=!1,this.accRight=!1,this.xSpeed=0,this.minPosX=-this.canvas.width/2,this.maxPosX=this.canvas.width/2,this.jumpAction=this.setJumpAction(),cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this),cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);var t=cc.Canvas.instance.node;t.on("touchstart",this.onTouchStart,this),t.on("touchend",this.onTouchEnd,this)},onDestroy:function(){cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this),cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);var t=cc.Canvas.instance.node;t.off("touchstart",this.onTouchStart,this),t.off("touchend",this.onTouchEnd,this)},update:function(t){this.accLeft?this.xSpeed-=this.accel*t:this.accRight&&(this.xSpeed+=this.accel*t),Math.abs(this.xSpeed)>this.maxMoveSpeed&&(this.xSpeed=this.maxMoveSpeed*this.xSpeed/Math.abs(this.xSpeed)),this.node.x+=this.xSpeed*t,Math.abs(this.node.x)>this.maxPosX&&(this.xSpeed=-this.xSpeed*this.elas,Math.abs(this.xSpeed)<this.minSpeed&&(this.xSpeed=-this.minSpeed*this.node.x/Math.abs(this.node.x)))}}),cc._RF.pop()},{}],Star:[function(t,e,i){"use strict";cc._RF.push(e,"e1554IfQhVFSZI/6r1xRW6g","Star"),cc.Class({extends:cc.Component,properties:{pickRadius:0},getPlayerDistance:function(){var t=this.game.player.node.getPosition();return this.node.position.sub(t).mag()},onPicked:function(){this.game.spawnNewStar(),this.game.gainScore(),this.node.destroy()},update:function(t){if(this.getPlayerDistance()<this.pickRadius)this.onPicked();else{var e=1-this.game.timer/this.game.starDuration;this.node.opacity=50+Math.floor(205*e)}}}),cc._RF.pop()},{}]},{},["Game","Player","Star"]);