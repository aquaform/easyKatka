function Game(){
    var canvas = $('#canvas')[0],
        interval = 0,
        painter = new Painter(canvas),
        world = new World(painter.GetWidth() * 2, painter.GetHeight() * 1.5),        
        camera = new Camera(painter.GetWidth(), painter.GetHeight(), world.GetWidth(), world.GetHeight()),
        controlPanel = new ControlPanel(world, this),
        tickTime = 50;

    var update = $.proxy(function(){
                var objects = world.Update();
                if(objects === true || objects === false){
                    this.StopGame();
                    var str = " press space for ";
                    str+= objects ? "next" : "new";
                    painter.ShowEndScreen(world.GetScore(),
                                          world.GetGameTime(),
                                          world.GetPlayerName(),
                                          str
                                        );
                }else{
                    objects  = camera.Update(objects[objects.length-1],objects);
                    painter.Update(objects);
                }
            }, this);
        
        
    this.StartGame = function(){
        world.StartNewWorld();
        interval = setInterval(update,tickTime);
    };
    
    this.StopGame = function(){
        clearInterval(interval);
    };

    controlPanel.UseKeyboard();
}

