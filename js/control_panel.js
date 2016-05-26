function ControlPanel(world, game){
    if (!(this instanceof ControlPanel)){
        return new ControlPanel(world);
    }
        
    this.UseKeyboard = function(){
        $(window).on('keydown', keyboardHandler);
        $(window).on('keyup', keyboardHandler);
    };
    
    function keyboardHandler(event){
            if (event !== null){
                var isDown = (event.type === 'keydown');
                switch (event.keyCode)
                {
                    case 37 : {
                        if(isDown){
                            world.MoveHeroLeft();
                        }else{
                            world.StopHero();
                        }
                        break;
                    }
                    case 38 : { 
                        if (isDown){
                            world.HeroJump();
                        }else{
                            world.StopHeroJump();  
                        }
                        break;
                    }
                    case 39 : {
                       if(isDown){
                            world.MoveHeroRight();
                        }else{
                            world.StopHero();
                        }
                        break;
                    }
                    case 40 : {
                            world.HeroSpring();
                            break;
                    }
                    case 32 : {
                        if (world.isPlay()){
                            world.HeroUseExtg(isDown);
                        }else{
                            game.StartGame();
                        }
                    }
                }
            }
        }
}

