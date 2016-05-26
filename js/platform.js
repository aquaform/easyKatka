function Platform(x,y,width,height, img){
    if (!(this instanceof Platform)){
        return new Platform(x, y, width, height, img);
    }
    
    if (typeof x !== "number" || typeof y !== "number" ||
            typeof width !== "number" || typeof height !== "number"){
        throw new Error("incorrect parameters");
    }
    
    this.X = x;
    this.Y = y;    
    this.Width = width;
    this.Height = height;
    this.Color = "rgb(0,0,0)";
    
    var frameX = 10,
        frameY = 205,
        frameWidth = 120,
        frameHeight = 26;

    this.Draw = function(ctx) {
        ctx.drawImage(img, frameX, frameY, frameWidth, frameHeight,  this.X, this.Y, this.Width, this.Height);  
    };
}