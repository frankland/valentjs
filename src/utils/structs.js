import t from 'tcomb';
const { Num, Str, Bool, Dat, list, maybe, subtype } = t;

// subtypes
var Int = subtype(Num, (number) => number % 1 === 0, 'Int');
var DateStr = subtype(Str, date => !!(date.match(/^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{0,})?Z?$/)), 'DateStr');


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
export const MaybeListDat = maybe(ListDat, 'MaybeListDat');


// [[1,..n],[1...m]...k]
export const ListListNum = list(ListNum, 'ListListNum');
// [[1, undefined, .n],[1 undefined,..m]...k]
export const ListMaybeListNum = list(MaybeListNum, 'ListMaybeListNum');

// [['a',..n],['a'...m]...k]
export const ListListStr = list(ListStr, 'ListListStr');
// [['a', undefined, .n],['a' undefined,..m]...k]
export const ListMaybeListStr = list(MaybeListStr, 'ListMaybeListStr');
