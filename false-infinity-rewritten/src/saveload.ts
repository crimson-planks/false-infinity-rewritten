import Decimal from "@/lib/break_eternity";

export type stringifiableObject= string | number | boolean | null | {
  _type: "NaN" | "Infinity" | "-Infinity" | "undefined"
} | {
  _type: "Decimal",
  sign: number,
  mag: number,
  layer: number
}
| stringifiableObject[] | {
  [key: string]: stringifiableObject
};
export function toStringifiableObject(obj: unknown): stringifiableObject{
  if(typeof obj === "boolean") return obj;
  if(typeof obj === "string"){
    return obj
  }
  if(typeof obj === "bigint"){
    throw TypeError("BigInts are not supported")
  }
  if(typeof obj === "function"){
    throw TypeError("Functions are not supported due to injection attacks")
  }
  if(typeof obj === "symbol"){
    throw TypeError("Symbols are not supported")
  }
  if(typeof obj === "number"){
    if(isNaN(obj)) return {_type: "NaN"}
    if(!isFinite(obj)){
      if(obj > 0) return {_type: "Infinity"}
      else return {_type: "-Infinity"}
    }
    return obj;
  }
  if(obj instanceof Array){
    return obj.map(v=>toStringifiableObject(v));
  }
  if(obj instanceof Decimal){
    return {
      _type: "Decimal",
      sign: toStringifiableObject(obj.sign),
      mag: toStringifiableObject(obj.mag),
      layer: toStringifiableObject(obj.layer)
    }
  }
  if(typeof obj === "undefined"){
    return {_type: "undefined"}
  }
  if(obj===null) return null;
  if(typeof obj === "object"){
    const rslt: {[key: string]: stringifiableObject} = {}
    for(let key in obj){
      //@ts-ignore: for some reason, unknown - undefined - null = {} according to TS, and not object.
      rslt[key] = toStringifiableObject(obj[key]);
    }
  }
  return {_type: "undefined"}
}
export function toUsableObject(obj: stringifiableObject): unknown{
  if(obj===null) return null;
  if(typeof obj === "boolean") return obj;
  if(typeof obj === "string") return obj;
  if(obj instanceof Array){
    return obj.map(v=>toUsableObject(v));
  }
  if(typeof obj === "number") return obj;
  if(obj._type==="NaN") return NaN;
  if(obj._type==="Infinity") return Infinity;
  if(obj._type==="-Infinity") return -Infinity;
  if(obj._type==="undefined") return undefined;
  if(obj._type==="Decimal"){
    if(typeof obj.sign!=="number" || typeof obj.layer!=="number" || typeof obj.mag!=="number") throw TypeError("Invalid object structure for Decimal")
    return Decimal.fromComponents(obj.sign,obj.layer,obj.mag)
  }
  if(obj._type) throw TypeError(`Invalid _type ${obj._type}`);
  if(typeof obj === "object"){
    const rslt: {[key: string]: unknown} = {}
    for(let key in obj){
      //@ts-ignore: why doesn't TS discard those values when I put obj._type==="NaN"
      rslt[key] = toUsableObject(obj[key]);
    }
    return rslt;
  }
  return undefined;
}