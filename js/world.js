function World(w, h){
    if (!(this instanceof World)){
        return new World(w, h);
    }
    
    if (typeof w !== "number" || typeof h !== "number"){
        throw new Error("incorrect parameters");
    }
      
    var width = w,
        height = h,    
        gravity = 10,
        hero = new Hero(0, 0, 0, 0),  
        platforms = [],
        fires = [],
        score = 0,
        gameTime = 0,
        playerName = "",
        isPlay = false,
        minDistForEx = 15,
        sprite = new Image();

        sprite.src = "img/firefighter.png";
  
    
    function distance(objA, objB){
        return Math.sqrt(Math.pow(objA.X - objB.X + (objA.Width - objB.Width) / 2, 2) +
               Math.pow(objA.Y - objB.Y + (objA.Height - objB.Height) / 2, 2)) - (objA.Width + objB.Width) / 2;
    }
    
    function isLook(hero, fire){
        return (fire.X - hero.X) * hero.GetDirection() >= 0;
    }
      
    function generatePlatforms(){
        var i = 0, j = 0,
            rowCount = 6, colCount = 4,
            plHeight = 20,
            stepX = width / colCount, stepY = height / rowCount,
            startY = height - plHeight, halfDistance = hero.HorizontalSpeed * hero.MaxTickInJump;
        
        function addPlatform(i,j){
            platforms.push(new Platform(stepX * j, startY - stepY * i,
            stepX - (Math.random() * halfDistance + halfDistance), plHeight, sprite));
        }

        platforms = [];
        hero.StdVerticalSpeed = 1.3 * Math.floor(stepY / hero.MaxTickInJump) + 1;

        for(j = 0; j < colCount; j++){
            addPlatform(0,j);
        }//низ заполняем полностью

        for(i = 1; i < rowCount - 1; i++){ 
            for(j = 0; j < colCount; j++){
                if(true){
                    addPlatform(i,j);
                }
            }
        }
    }

    function generateFires(){
        var stdWidth = 43,
            stdHeight = 80,
            stdHealth = 50;
        var chanseFire = 1;
        for(var i = 0, len = platforms.length; i < len; i++){
            if(Math.random() < chanseFire){            
                var x = Math.floor(platforms[i].X + Math.random() * (platforms[i].Width - stdWidth));
                fires.push(new Fire(x, platforms[i].Y - stdHeight, stdWidth, stdHeight, stdHealth, sprite));
            }
        }
    }
    
    function concatArr(a,b){
        //только потому что работает на 10% быстрее
        var ret = a.slice();
        for (var i = 0, len = b.length; i < len; i++) {
            ret.push(b[i]);
        }
        
        return ret;
    }
    
    function heroInFire(){
        for(var i = 0, len = fires.length; i < len; i++){
            if(hero.IsIntersect(fires[i])){
                return true;
            }
        }

        return false;
    }
        
    function heroUpdate(){
            if (hero.Direction === -1 && hero.X <= 0){
                hero.Direction = 0;
                hero.X = 0;
            }
            
            if (hero.Direction === 1 && hero.X + hero.Width >= width){
                hero.Direction = 0;
                hero.X = width - hero.Width;
            }
            
            hero.Move();                       
            
            if (hero.IsJump){
               hero.Y -= hero.VerticalSpeed;
               hero.TickInJump++;
               if(hero.TickInJump >= hero.MaxTickInJump){
                   hero.StopJump();
               }
            }else{
                hero.IsFalling = true;

                for(var i = 0, len = platforms.length; i < len; i++){
                    if (hero.IsStanding(platforms[i])){
                        if(hero.Spring){
                            hero.Spring = false;
                            hero.Y += platforms[i].Height;
                            break;
                        }else{
                            hero.Y = platforms[i].Y - hero.Height;
                            hero.IsFalling = false;
                            break;
                        }
                    }
                }

                if (hero.IsFalling){
                    hero.Y += gravity;
                }
            }
            
            if(heroInFire()){
                hero.Health--;
                if (hero.Health < 0){ 
                    hero.Health = 0;
                };
            }
        }
     
    function firesUpdate(){
         
         var toRemove = 0;
         var isExtg = false;
         for(var i = 0, len = fires.length; i < len; i++){
            isExtg = hero.IsExtinguisher && (distance(hero, fires[i]) < minDistForEx) && isLook(hero, fires[i]);
            fires[i].Update(isExtg, hero.Extinguisher.Power);
            if(fires[i].Health <= 0){           
                var temp = fires[toRemove];
                fires[toRemove] = fires[i];
                fires[i] = temp;
                toRemove++;
            }
         }
         
        for(var i = 0; i < toRemove; i++){
            score += fires[i].GetMaxHealth();
        }
        fires.splice(0,toRemove);  
    }
     
    function isHeroDie(){
        if (hero.Y > width ||hero.Health <= 0) return true;
    }
    
    function isWin(){
        return fires.length === 0;
    }
    
    function generateLevel(){
        var spawnHeroX = 0,
            spawnHeroY = 0,
            heroWidth = 35,
            heroHeight = 40;
    
        hero = new Hero(spawnHeroX, spawnHeroY ,heroWidth, heroHeight, sprite);  
        platforms = [];
        fires = [];

        generatePlatforms();
        generateFires();
    };
        
    this.GetWidth = function(){
        return width;
    };
    
    this.GetHeight = function(){
        return height;
    };
        
    this.StartNewWorld = function(){
        score = 0;
        gameTime = new Date().getTime();
        isPlay = true;
        generateLevel();
    };
    
    this.StartNextWorld = function(){
        gameTime = gameTime + new Date().getTime();
        isPlay = true;
        generateLevel();
    };
    
    this.MoveHeroLeft = function(){
        hero.Direction = -1;
    };
    
    this.MoveHeroRight = function(){
        hero.Direction = 1;
    };
    
    this.StopHero = function(){
        hero.Direction = 0;
    };
    
    this.HeroJump = function(){
        hero.StartJump();
    };
    
    this.StopHeroJump = function(){
        hero.StopJump();
    };
    
    this.HeroUseExtg = function(use){
        hero.IsExtinguisher = use;
    };
    
    this.HeroSpring = function() {
        if (!(hero.IsFalling || hero.IsJump)){
            hero.Spring = true;
        }
    };
    
    this.Update = function(){
        heroUpdate();
        firesUpdate();
        
        if(isHeroDie()){ 
            gameTime = new Date().getTime() - gameTime;
            isPlay = false;
            return false;
        };
        
        if(isWin()){
            gameTime = new Date().getTime() - gameTime;
            isPlay = false;
            return true;
        }
                
        var ret = platforms.slice();
        ret = concatArr(ret, fires);
        ret.push(hero);
        
        return ret;
    };
    
    this.GetScore = function(){
        return score;
    };
    
    this.GetGameTime = function(){
        return gameTime;
    };
    
    this.GetPlayerName = function(){
        playerName = prompt("What's your name, firefighter?", "");
        return playerName;
    };
    
    this.isPlay = function(){
        return isPlay;
    };
}
