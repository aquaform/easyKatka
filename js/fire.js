function Fire(x,y,width,height, mxHealth, img){
    if (!(this instanceof Fire)){
        return new Fire(x,y,width,height, img);
    }
        
    if (typeof x !== "number" || typeof y !== "number" ||
            typeof width !== "number" || typeof height !== "number"){
        throw new Error("incorrect parameters");
    }
    
    var maxHealth = mxHealth,
        stdX = x,
        stdY = y,
        stdWidth  = width,
        stdHeight = height,
        frameWidth = 47,
        frameHeight = 80,
        frCount = 7,
        frame = Math.floor(Math.random() * frCount),
        counter = 0;

    this.X = x;
    this.Y = y;    
    this.Width = width;
    this.Height = height;
    this.Color = "rgb(255,0,0)";
    this.Health = maxHealth;
    this.Ignition = 1;

    
    this.GetMaxHealth = function(){
        return maxHealth;
    };
    
    this.Update = function(isExtg, extgPower){
        extgPower = typeof extgPower === 'number' ? extgPower : 0;
        var add = isExtg ? -extgPower : this.Ignition;
        this.Health+=add;
        this.Health = this.Health > maxHealth ? maxHealth : this.Health;
        this.Health = this.Health < 0 ? 0 : this.Health;
        this.Width = stdWidth * this.Health/maxHealth;
        this.Height = stdHeight * this.Health/maxHealth;
        this.X = stdX + (stdWidth - this.Width)/2;
        this.Y = stdY + (stdHeight - this.Height);
    };
    
    this.Draw = function (ctx) {
        var xFrame = frame * (frameWidth + 0.6);
        ctx.drawImage(img, xFrame, 108, frameWidth, frameHeight,  this.X, this.Y, this.Width, this.Height);  

        counter++;
        if(counter % 2 === 0){
            frame++;
            counter = 0;
        }
        
        frame = frame > frCount ? 0 : frame;
    };
}
