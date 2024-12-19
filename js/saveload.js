function getDefaultGame(){
    return {
        matter: new Decimal(),
        bestMatter:{
            all: new Decimal(),
            deflation: new Decimal()
        },
        notation: "default",
        createdTime: Date.now(),
        currentTime: null,
        previousTime: null,
        autobuyers: {
            matter: [
                {
                    interval: new Decimal(1000),
                    timer: 0,
                    amount: new Decimal(),
                    intervalAmount: new Decimal(),
                    isActive: true
                },
                {
                    interval: new Decimal(2000),
                    timer: 0,
                    amount: new Decimal(),
                    intervalAmount: new Decimal(),
                    isActive: true
                }
            ],
            deflation: [
                {
                    interval: new Decimal(1000),
                    timer: 0,
                    amount: new Decimal(),
                    intervalAmount: new Decimal(),
                    isActive: true
                }
            ]
        },
        deflation: new Decimal(),
        deflator: new Decimal(),
        deflationPower: new Decimal(),
        isOverflow: false,
        overflowPoint: new Decimal(),
    }
}
const defaultGame = getDefaultGame();
function FillMissingValues(game){
    const defaultGame = getDefaultGame();
    if(game.autobuyers===undefined) game.autobuyers = defaultGame.autobuyers;
    if(game.autobuyers.matter===undefined) game.autobuyers.matter = defaultGame.autobuyers;
    if(game.autobuyers.deflation===undefined) game.autobuyers.deflation = defaultGame.autobuyers.deflation;
    for(type in game.autobuyers){
        for(i in game.autobuyers[type]){
            if(game.autobuyers[type][i].isActive===undefined) game.autobuyers[type][i].isActive=true;
        }
    }
    if(game.notation===undefined) game.notation="default";
    if(game.matter===undefined) game.matter=new Decimal();
    if(game.deflation===undefined) game.deflation=new Decimal();

    if(game.isOverflow===undefined) game.isOverflow=false;
    if(game.deflationPower===undefined) game.deflationPower=new Decimal();
    if(game.deflator===undefined) game.deflator=new Decimal();
    if(game.bestMatter===undefined) game.bestMatter=defaultGame.bestMatter;
    if(game.bestMatter.all===undefined) game.bestMatter.all=defaultGame.bestMatter.all;
    if(game.bestMatter.deflation===undefined) game.bestMatter.deflation=defaultGame.bestMatter.deflation;
    if(game.bestMatter.overflow===undefined) game.bestMatter.overflow=defaultGame.bestMatter.overflow;

    if(game.overflowPoint===undefined) game.overflowPoint=new Decimal();
}
function ConvertToStringifiable(obj){
    if(obj===null) return obj;
    if(obj===undefined) return {_t: "undefined"};
    if(obj.constructor===String) return obj;
    if(obj.constructor===Number){
        if(obj===Infinity) return {_t: "Infinity"};
        if(obj===-Infinity) return {_t: "-Infinity"};
        if(isNaN(obj)) return {_t: "NaN"};
        return obj;
    }
    if(obj===true) return true;
    if(obj===false) return false;
    if(obj instanceof Function){
        throw TypeError("Functions are not supported due to security issues");
    }
    if(obj instanceof Symbol){
        throw TypeError("Symbols are not supported due to them being unique");
    }
    if(obj instanceof Array){
        const rslt = [];
        for(i in obj){
            rslt.push(ConvertToStringifiable(obj[i]));
        }
        return rslt;
    }
    //Object
    const rslt = {};
    if(obj instanceof Decimal){
        rslt._t = "Decimal"
    }
    for(key in obj){
        rslt[key] = ConvertToStringifiable(obj[key]);
    }
    return rslt;
}
function ConvertToUsable(obj){
    if(obj===null) return null;
    if(obj._t==="undefined") return undefined;
    if(typeof obj === "string") return obj;
    if(typeof obj === "number") return obj;
    if(obj._t==="Infinity") return Infinity;
    if(obj._t==="-Infinity") return -Infinity;
    if(obj._t==="NaN") return NaN;
    if(obj===true) return true;
    if(obj===false) return false;
    if(obj.constructor === Array){
        const rslt = [];
        for(i in obj){
            rslt.push(ConvertToUsable(obj[i]));
        }
        return rslt;
    }
    if(obj._t==="Decimal"){
        return Decimal.fromComponents(obj.sign, obj.layer, obj.mag)
    }
    const rslt={};
    for(key in obj){
        rslt[key] = ConvertToUsable(obj[key]);
    }
    return rslt;
}
function base64ToBytes(base64) {
    const binString = atob(base64);
    return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

function bytesToBase64(bytes) {
    const binString = Array.from(bytes, (byte) =>
        String.fromCodePoint(byte),
    ).join("");
    return btoa(binString);
}
function save(game){
    if(game===undefined) throw TypeError();
    const te = new TextEncoder().encode(JSON.stringify(ConvertToStringifiable(game)));
    localStorage.setItem("FalseInfinitySave",bytesToBase64(te))
}
function load(){
    const dt =new TextDecoder().decode(base64ToBytes(localStorage.getItem("FalseInfinitySave")))
    game=ConvertToUsable(JSON.parse(dt));
}