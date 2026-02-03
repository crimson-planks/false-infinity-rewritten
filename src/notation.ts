import Decimal from './lib/break_eternity.js';
import { Presets, BaseConvert } from './lib/eternal_notations.esm.js';
import { OVERFLOW } from './prestige.js';
export enum NotationName {
  Default = 'default',
  Scientific = 'scientific'
}
/**
 * numberArray should be an array of non-negative integers
 */
export function inequality_core(numberArray: number[],base: number){
  const digitsArray = numberArray.map((v,i,a)=>BaseConvert(v,base,0,0,0,-1).split('').map((v)=>+v))
  console.log(digitsArray)
  const resultArray: string[] = []
  for(let i=0;i<digitsArray.length;i++){
    let digitsArrayI = digitsArray[i]
    for(let j=0;j<digitsArrayI.length-1;j++){
      let curr = digitsArrayI[j];
      let next = digitsArrayI[j+1];
      if(curr<next) resultArray.push('<')
      else if(curr===next) resultArray.push('=')
      else resultArray.push('>')
    }
    if(i===digitsArray.length-1) break;
    let curr = digitsArrayI[digitsArrayI.length-1]
    let next = digitsArray[i+1][0]
    if(curr<next) resultArray.push('(<)')
    else if(curr===next) resultArray.push('(=)')
    else resultArray.push('(>)')
  }
  return resultArray.join('')
}
export function formatValue(inputValue: Decimal, notation: NotationName) {
  if(inputValue.isNan()) return "NaN"
  if(inputValue.gt(OVERFLOW)) return "Error: Overflow"
  switch (notation) {
    case NotationName.Default:
      return Presets.Default.formatDecimal(inputValue);
    case NotationName.Scientific:
      return Presets.Scientific.formatDecimal(inputValue);
    default:
      throw TypeError(`Unknown notation name: ${notation}`);
  }
}
