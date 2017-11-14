
function Obserable(){
	this.handlers = {}
}
Obserable.prototype = {
	on:function(type,hander){
		this.handlers[type] =  this.handlers[type] || [];
	
		this.off(type);
		this.handlers[type].push({handler,type});		
	},
	off:function(type){
		this.handlers[type] && this.handlers[type] .forEach((item,i)=>{
			if(item.type  ===  type){
				this.handlers[type] .splice(i,1);
			};
		});
	},
	trigger:function(event){

		if(!event.target){
			event.target=this;
		}
		if(this.handlers[event.type] instanceof Array){
            var handlers=this.handlers[event.type];//检出被观察者注册的观察者
            for(var i=0,len=handlers.length;i<len;i++){
               return handlers[i].handler(event.data);//回调函数执行，也就是观察者更新自己
            }
        }
    }
}