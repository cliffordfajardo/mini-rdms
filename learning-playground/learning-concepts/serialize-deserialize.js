  // private serializeString(targetBuffer: ArrayBuffer, offset: number, size: number, str: string) {
  //   const mutableView = new Uint8Array(targetBuffer, offset, size);

  //   for (let i = 0; i < str.length; i++) {
  //     mutableView[i] = str.charCodeAt(i);
  //   }

  //   return targetBuffer;
  // }




/**
 * Takes a string and converts it into a stream of bytes.
 * Serialization is the process of taking a data structure and converting it to a format (binary)
 * that can be saved or used across systems.
 * @param {*} targetBuffer 
 * @param {*} offset 
 * @param {*} size 
 * @param {*} str 
 * 
 * @example
 * serializeString()
 */
function serializeString(targetBuffer, offset, size, str) {
  const mutableView = new Uint8Array(targetBuffer, offset, size);

  for (let i = 0; i < str.length; i++) {
    mutableView[i] = str.charCodeAt(i);
  }

  return targetBuffer;
  }

  const buf = new ArrayBuffer(284)
serializeString(buf, 0, 80, 'generes')