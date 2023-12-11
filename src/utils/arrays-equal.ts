export function arraysEqual(arr1: any[], arr2: any[]) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const sortedArr1 = arr1.slice().sort().toString();
  const sortedArr2 = arr2.slice().sort().toString();

  return sortedArr1 === sortedArr2;
}
