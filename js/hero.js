function Hero(x,y,width,height, img){
    if (!(this instanceof Hero)){
        return new Hero(x,y,width,height, img);
    }
    
    if (typeof x !== "number" || typeof y !== "number"|| typeof width !== "number" ||
            typeof height !== "number"){
        throw new Error("incorrect parameters");
    }
    
    var minTickInJump = 3;
    var maxHealth = 100;
    
    this.X = x;
    this.Y = y;    
    this.Width = width;
    this.Height = height;
    this.Health = maxHealth;
    this.IsJump = false;
    this.TickInJump = 0;
    this.MaxTickInJump = 10;
    this.IsFalling = false;
    this.Spring = false;
    this.HorizontalSpeed = 5;
    this.VerticalSpeed = 0;
    this.Direction = 0; //left - -1 right - 1 stop = 0;
    this.StdVerticalSpeed = 5;
    this.Extinguisher = new Extinguisher(5);
    this.IsExtinguisher = false;
    
    var 
        frameWidth = 35,
        frameHeight = 40,
        curFrame = 0,
        spaceBetween = 0.9,
        countFrameStep = 7,
        tickForStep = 0,
        lastDirection  = 1;

    this.GetDirection = function(){
        return lastDirection;
    };
    
    
    this.IsStanding = function(obj){
        if(Math.abs(obj.Y - this.Y - this.Height) < this.Height / 2){
            var left = this.X + 7,
                right = this.X + this.Width - 7,
                objLeft = obj.X,
                objRight = obj.X + obj.Width;
            
            if (left < objRight && left > objLeft){
                return true;//если левая точка на платформе
            }
            
            if (right < objRight && right > objLeft){
                return true;//если правая точка на платформе
            }
            
            if (objLeft > left && objRight < right){
                return true;
            }
        }
        
        return false;
    };
    
    this.IsIntersect = function(obj){
            var left = this.X,
                right = this.X + this.Width,
                top = this.Y,
                down = this.Y + this.Height,
                objLeft = obj.X,
                objRight = obj.X + obj.Width, 
                objTop = obj.Y,
                objDown = obj.Y + obj.Height;
        
        if (down < objTop || top > objDown || right < objLeft || left > objRight){
            return false;
        }
        
        return true;
    };
    
    this.StartJump = function(){
        if (this.IsJump || this.IsFalling) {
            return;
        }
        
        this.IsJump = true;
        this.IsFalling = false;
        this.VerticalSpeed = this.StdVerticalSpeed;
    };
    
    this.StopJump = function(){
       if (!this.IsJump || this.IsFalling) return;
       if(this.TickInJump > minTickInJump){
            this.IsJump = false;
            this.IsFalling = true;
            this.TickInJump = 0;
            this.VerticalSpeed = 0;
        }else{
            this.TickInJump = this.MaxTickInJump - minTickInJump;        
        }      
    };
    
    this.Move = function(){
        this.X += this.Direction * this.HorizontalSpeed;
    };
    
    this.Draw = function(ctx){
        var xFrame = 0,
            inAir = this.IsFalling || this.IsJump;
    
        if (inAir){
            curFrame = 2;
        } 
        
        if (this.Direction !== 0){
            lastDirection = this.Direction;
            if(this.Direction>0){
                xFrame = this.rightFrameX();
            }else{
                xFrame = this.leftFrameX();
            }

            if (isStep()){
                nextFrame();
            }
        }else{
            if(!inAir){
                tickForStep = 0;
                curFrame = 0;
            }
            
            if(lastDirection>0){
                xFrame = this.rightFrameX();
            }else{
                xFrame = this.leftFrameX();
            }
        }
        ctx.drawImage(img, xFrame, 4, frameWidth, frameHeight,  this.X, this.Y, this.Width, this.Height);
    };
    
    function isStep(){
        tickForStep++;
        var ret = tickForStep > 1;
        if (ret){
            tickForStep = 0;
        }
        return ret;
    }
    
    function nextFrame(){
        curFrame++;
        if (curFrame >= countFrameStep) curFrame = 0;
    }
    
    this.leftFrameX = function(){
        return 5+(this.Width + spaceBetween) * curFrame;
    };
    
    this.rightFrameX = function(){
        return 503-(this.Width + spaceBetween) * curFrame - this.Width;
    };
}
