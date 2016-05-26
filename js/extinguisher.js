function Extinguisher(power){
    if(!(this instanceof Extinguisher)){
        return new Extinguisher(power);
    }
    
    if(typeof power !== "number"){
        throw new Error("incorrect parameters");
    }
    
    this.Power = power;
}


