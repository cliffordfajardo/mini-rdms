import { table } from './Schema';


/**
 * Takes an incoming tuple from the user and serialized it, giving back a buffer of the serialized data.
 */
export class TupleSerializer {

  public serialize(table: table, incomingTuple: any) {
    const tupleSize = TupleSerializer.getTupleSize(table);

    const tupleBuffer = new ArrayBuffer(tupleSize);
    let offset = 0;

    // iterate over each column, serialize the value
    table.columns.forEach(column => {
      const valueToSerialize = incomingTuple[column.name];
      if (valueToSerialize === undefined) throw new Error(`Cannot serialize object to ${table.name}. Column ${column.name} is missing.`);

      if (column.type === 'string')
        this.serializeString(tupleBuffer, offset, column.size, valueToSerialize);
      
      else if (column.type === 'integer')
        this.serializeInteger(tupleBuffer, offset, valueToSerialize);
    
      else if (column.type === 'float')
        this.serializeFloat(tupleBuffer, offset, valueToSerialize);
      
      else if (column.type === 'boolean')
        this.serializeBoolean(tupleBuffer, offset, valueToSerialize);
      
      else throw new Error(`Cannot serialize unknown type ${column.type}`);

      // update the offset for the next value to be serialized.
      offset += column.size;
    });

    return tupleBuffer;
  }


  
  /**
  * Takes a string and converts it into a stream of bytes. 
  * Serialization is the process of taking a data structure and converting it to a format (binary)
  * that can be saved or used across systems.
  * 
  * charCodeAt - will represent values in utf-16
  * Side note: The number of bytes taken to represent the string depends entirely on which encoding you use to turn it into bytes
  */
  public serializeString(targetBuffer: ArrayBuffer, offset: number, size: number, str: string) {
    const mutableView = new Uint8Array(targetBuffer, offset, size); // mutable views allow us to modify the underlying buffer

    for (let i = 0; i < str.length; i++) {
      mutableView[i] = str.charCodeAt(i);
    }

    return targetBuffer;
  }
  
  private deserializeString(targetBuffer: ArrayBuffer, offset: number, size: number) {
    const mutableView = new Uint8Array(targetBuffer, offset, size); // mutable views allow us to modify the underlying buffer
    let result = '';

    for (let i = 0; i < mutableView.byteLength; i++) {
      result += mutableView[i] ? String.fromCharCode(mutableView[i]) : '';
    }

    return result;
  }



  /**
   * Takes an integer (integers are 4 bytes) and converts it into a stream of bytes. 
   */
  public serializeInteger(targetBuffer: ArrayBuffer, offset: number, integer: number) {
    const mutableView = new Int32Array(targetBuffer, offset, 1); // mutable views allow us to modify the underlying buffer
    mutableView[0] = integer;
    return targetBuffer;
  }

  public deserializeInteger(targetBuffer: ArrayBuffer, offset: number) {
    return new Int32Array(targetBuffer, offset, 1)[0];
  }



  /**
   * Takes a float (we/re choosing to support 32bit floats)
   */
  public serializeFloat(targetBuffer: ArrayBuffer, offset: number, float: number) {
    const mutableView = new Float32Array(targetBuffer, offset, 1); // mutable views allow us to modify the underlying buffer
    mutableView[0] = float;
    return targetBuffer;
  }

  public deserializeFloat(targetBuffer: ArrayBuffer, offset: number) {
    return new Float32Array(targetBuffer, offset, 1)[0];
  }




  public serializeBoolean(targetBuffer: ArrayBuffer, offset: number, boolean: boolean) {
    const mutableView = new Uint8Array(targetBuffer, offset, 1); // mutable views allow us to modify the underlying buffer
    mutableView[0] = boolean ? 1 : 0;
    return targetBuffer;
  }

  public deserializeBoolean(targetBuffer: ArrayBuffer, offset: number) {
    return new Uint8Array(targetBuffer, offset, 1)[0] === 1 ? 1 : 0;
  }


  



  

  public deserialize(table: table, tupleBuffer: ArrayBuffer) {
    const result: any = {};
    let offset = 0;

    table.columns.forEach(column => {
      if (column.type === 'string')
        result[column.name] = this.deserializeString(tupleBuffer, offset, column.size);
      else if (column.type === 'integer')
        result[column.name] = this.deserializeInteger(tupleBuffer, offset);
      else if (column.type === 'float')
        result[column.name] = this.deserializeFloat(tupleBuffer, offset);
      else if (column.type === 'boolean')
        result[column.name] = this.deserializeBoolean(tupleBuffer, offset);
      else throw new Error(`Cannot deserialize unknown type ${column.type}`);

      offset += column.size;
    });

    return result;
  }


  /**
   * Caculate the size of a tuple  by looking at each of our tables column type sizes.
   */
  static getTupleSize(table: table){
    return table.columns
      .map(col => col.size)
      .reduce((a, b) => a + b);
  }
}

// const ts = new TupleSerializer();

// const tb = ts.serialize(ratings, { userId: 1, movieId: 2, rating: 3.5, timestamp: 1112486027 });
// const to = ts.deserialize(ratings, tb);

// console.log(to);
