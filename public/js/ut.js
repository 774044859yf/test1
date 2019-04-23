/**
 * Created by xiao lei on 2016/6/23.
 */
//单例模式封装
var ut=(function(){
    var flag='getComputedStyle' in window;
    return {
        //rnd:兼容版的求一定范围的随机数 n,m
        rnd:function(n,m){
            n=Number(n);
            m=Number(m);
            if(isNaN(n) || isNaN(m)){
                return Math.random();//如果传的数字无效，直接返回0-1随机小数
            }
            if(n>m){
                tmp=n;
                n=m;
                m=tmp;
            }
            return Math.round(Math.random()*(m-n)+n);
        },
        //listToArray：类数组转数组
        listToArray:function listToArray(arg){
            if(flag){
                return Array.prototype.slice.call(arg)
            }
            var ary=[];
            for(var i=0; i<arg.length; i++){
                ary[ary.length]=arg[i];
            }
            return ary;

        },
        //jsonParse:把JSON格式的字符串转成JSON格式的数据(对象)
        jsonParse:function(jsonStr){
            /*var obj={};
             if('JSON' in window){//高级浏览器支持
             obj=JSON.parse(jsonStr);
             }else{//处理低级浏览器的兼容
             obj=eval('('+jsonStr+')')
             }
             return obj;*/
            return 'JSON' in window?JSON.parse(jsonStr):eval('('+jsonStr+')');
        },
        //win:浏览器盒子模型的兼容性处理；
        win:function (attr,value){
            //获取时候就得return； 设置的时候不需要；
            //win有两个功能： 获取-return 设置（不需要return）
            //当win方法调用时，传了一个参数的时候（1.arguments.length 2.typeof value==='undefined'）；就是获取；否则就是设置；
            if(typeof value==='undefined'){//获取
                return document.documentElement[attr]||document.body[attr];
            }
            //设置；
            document.documentElement[attr]=document.body[attr]=value;
        },
        //offset:当前元素距离body的位置 {left:l,top:t}
        offset:function(curEle){
            var l=curEle.offsetLeft;
            var t=curEle.offsetTop;
            var par=curEle.offsetParent;
            while(par){
                if(navigator.userAgent.indexOf('MSIE 8.0')===-1){
                    l+=par.clientLeft;
                    t+=par.clientTop;
                }
                l+=par.offsetLeft;
                t+=par.offsetTop;
                par=par.offsetParent;
            }
            return {left:l,top:t}
        },
        //getCss:获取经过浏览器计算过的样式（面试：如何获取非行间样式）
        getCss:function(curEle,attr){
            var val,reg;
            if(flag){
                val=getComputedStyle(curEle,false)[attr];
            }else{
                if(attr==='opacity'){
                    val=curEle.currentStyle['filter'];
                    reg=/^alpha\(opacity[=:](\d+)\)$/;
                    return reg.test(val)?reg.exec(val)[1]/100:1;
                }else{
                    val=curEle.currentStyle[attr];
                }

            }
            reg=/^([+-])?\d+(\.\d+)?(pt|px|rem|em)$/
            return reg.test(val)?parseFloat(val):val;
        },
        //getByClass：在一定的范围内，通过className来获取元素
        getByClass:function(curEle,strClass){
            curEle=curEle||document;
            if(flag){
                return this.listToArray(curEle.getElementsByClassName(strClass))
            }
            var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
            var nodeList=curEle.getElementsByTagName('*');
            var ary=[];
            for(var i=0; i<nodeList.length; i++){
                var curNode=nodeList[i];
                var bOk=true;
                for(var k=0; k<aryClass.length; k++){
                    var curClass=aryClass[k];
                    //var reg=new RegExp('(^| +)'+curClass+'( +|$)')
                    var reg=new RegExp('\\b'+curClass+'\\b');
                    if(!reg.test(curNode.className)){
                        bOk=false;
                        break;
                    }
                }
                if(bOk){
                    ary[ary.length]=curNode;
                }
            }
            return ary;
        },
        //hasClass:验证这个元素上是否有某个class名；
        hasClass:function(curEle,cName){
            cName=cName.replace(/(^ +)|( +$)/g,'')
            var reg=new RegExp('\\b'+cName+'\\b');
            return reg.test(curEle.className)
        },
        //addClass:如果元素身上没有这个class名，我们才会添加
        addClass:function(curEle,strClass){
            var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
            for(var i=0; i<aryClass.length; i++){
                var curClass=aryClass[i];
                if(!this.hasClass(curEle,curClass)){
                    curEle.className+=' '+curClass;
                }
            }
        }
    }
})();











