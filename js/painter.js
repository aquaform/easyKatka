function Painter(canvas){
    if (!(this instanceof Painter)){
        return new Painter(canvas);
    }
    
    if (typeof canvas !== "object"){
        throw new Error("incorrect parameters");
    }
    
    var width = canvas.width,
        height = canvas.height,
        ctx = canvas.getContext("2d");
    
    this.GetWidth = function(){
        return width;
    };
    
    this.GetHeight = function(){
        return height;
    };
    
    var fillBackground = function(){
        canvas.width = canvas.width;
    };
        
    this.Update = function(objects){  
        fillBackground();

        for(var i = 0, len = objects.length-1; i < len; i++){
            objects[i].Draw(ctx);
        }
        
        var hero = objects[objects.length - 1];
        if(hero instanceof Hero){
            hero.Draw(ctx);
            ctx.strokeText(hero.Health, width * 0.9, height * 0.1);
        }
    };
    
    this.ShowEndScreen = function(score, time, name, text){
        fillBackground();
        
        var str = typeof score === "number" ? "You get " + score + " score \n" : "";
        str += typeof time === "string" ? "for " + time + "\n" : "";
        str += typeof name === "string" ? "firefighter " + name : "";
        str += typeof text === "string" ? text : "";
        ctx.strokeText(str, width * 0.4, height * 0.4);
    };
}