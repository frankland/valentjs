import t from 'tcomb';
const { Num, Str, Bool, Dat, list, maybe, subtype } = t;

var Int = subtype(Num, function(n) {
  return n % 1 === 0;
}, 'Int');

var DateStr = subtype(Str, function(n) {
  return !!(n.match(/^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{0,})?Z?$/));
}, 'DateStr');


export { Int, Num, Str, Bool, Dat };

export const ListNum = list(Num, 'ListNum');
export const ListInt = list(Int, 'ListInt');
export const ListStr = list(Str, 'ListStr');
export const ListBool = list(Bool, 'ListBool');
export const ListDat = list(Dat, 'ListDat');


export const MaybeNum = maybe(Num, 'MaybeNum');
export const MaybeInt = maybe(Int, 'MaybeInt');
export const MaybeStr = maybe(Str, 'MaybeStr');
export const MaybeBool = maybe(Bool, 'MaybeBool');
export const MaybeDat = maybe(Dat, 'MaybeDat');


export const MaybeListNum = maybe(ListNum, 'MaybeListNum');
export const MaybeListInt = maybe(ListInt, 'MaybeListInt');
export const MaybeListStr = maybe(ListStr, 'MaybeListStr');
export const MaybeListBool = maybe(ListBool, 'MaybeListBool');
