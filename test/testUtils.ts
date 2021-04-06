// check two types equals or not
// Equals<[true, false], [true, false]> => true
export type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

// check two types equals using functions
// assertType<Equals<string, string>>()
export const assertType = <T extends true>() => {};
export const assertNotType = <T extends false>() => {};
