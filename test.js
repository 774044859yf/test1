/**
 * Created by Administrator on 2019/4/16.
 */
function Person(name){
    return new person(name)
}
var person=function (name){
    console.log('Hi! This is '+name+'!');
    this.eat=function(o){
        console.log('Eat '+o+'!');
        return this;
    }
    this.sleep=function(time){
        var self=this;
        //console.log(typeof time*1)
        if(!time||typeof time!='number'){
            return self;
        }
        console.log('等待'+time+'秒')
        setTimeout(function(){
            console.log('Wake up after '+time)
            return self;
        },time*1);
        return self;
    }
    this.sleepFirst=function(time){
        var self=this;
        if(!time||typeof time!='number'){
            return self;
        }
        console.log('等待'+time+'秒')
        setTimeout(function(){
            console.log('Wake up after '+time)
            return self;
        },time*1)
        return self;
    }
}

Person("Li");
// 输出： Hi! This is Li!

Person("Dan").sleep(10).eat("dinner");
// 输出：
// Hi! This is Dan!
// 等待10秒..
// Wake up after 10
// Eat dinner~

Person("Jerry").eat("dinner").eat("supper");
// 输出：
// Hi This is Jerry!
// Eat dinner~
// Eat supper~

Person("Smith").sleepFirst(5).eat("supper");
// 输出：
// 等待5秒
// Wake up after 5
// Hi This is Smith!
// Eat supper
