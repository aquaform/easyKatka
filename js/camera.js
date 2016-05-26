function Camera(w, h, worldW, worldH){
    if (!(this instanceof Camera)){
        return new Camera(w, h);
    }
    
    if((typeof w !== 'number')||(typeof h !== 'number')){
        throw new Error("incorrect parameters");
    }
    
    var width = w,
        height = h,
        worldWidth = worldW,
        worldHeight = worldH,
        left = 0,
        top = 0,
        right = 0,
        down = 0;

    function isDotInside(dotX, dotY){
        if(dotX >= left && dotX <= right){
            if (dotY >= top && dotY <= down){
                return true;
            }
        }
        return false;
    }
    
    function isObjectInside(object){
        //предполагается что object никогда не будет больше камеры в двух размерностях сразу
        //хотя может прокатит и для таких
        var xl = object.X,
            yt = object.Y,
            xr = object.X + object.Width,
            yd = object.Y + object.Height;
            
        if(isDotInside(xl, yt)||
           isDotInside(xr, yt)||
           isDotInside(xl, yd)||
           isDotInside(xr, yd)){
                return true;
           }
           
        if (object.Width >= width){
            if (yt > top && yt < down){
                return true;
            }
            
            if (yd > top && yd < down){
                return true;
            }
        }
        
        if (object.Height >= height){
            if (xl > left && xl < right){
                return true;
            }
            
            if (xr > left && xr < right){
                return true;
            }
        }
        
        return false;          
    }
        
    function modifyObject(object){
        var ret = Object.create(object);
        
        ret.X -= left;
        ret.Y -= top;
        
        var xl = ret.X,
            yt = ret.Y,
            xr = ret.X + ret.Width,
            yd = ret.Y + ret.Height;
   
        xl = xl < 0 ? 0 : xl;
        xr = xr > width ? width : xr;
        yt = yt < 0 ? 0 : yt;
        yd = yd > height ? height : yd;
        
        ret.X = xl;
        ret.Y = yt;
        ret.Width = xr - xl;
        ret.Height = yd - yt;
        
        return ret;   
    }


    this.Update = function(mainObj, objects){
        left = Math.round(mainObj.X - width/2);
        left = left < 0 ? 0 : left;
        left = left + width > worldWidth ? worldWidth - width : left;
        right = left + width;
        
        top = Math.round(mainObj.Y + mainObj.Height - height/2);
        top = top < 0 ? 0 : top;
        top = top + height > worldHeight ? worldHeight - height : top;
        down = top + height;
        
       // console.log(left,top,right,down);
        
        var ret = [];
        
        for(var i = 0, len = objects.length; i<len;i++){
            if(isObjectInside(objects[i])){
                ret.push(modifyObject(objects[i]));
            }
        }
        
        return ret;
    };
}