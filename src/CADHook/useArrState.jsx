import { useState } from "react";

/**
 * @param {Array<Object>} initialState
 * @returns {[Array<Object>, Function, Function, Function, Function, Function]}
 */
function useArrState(initialState) {
  const [state, setState] = useState(initialState);

  const addItem = (value) => {
    const arr = [...state];
    arr.push(value);
    setState(arr);
  };

  const updateItem = (index, value) => {
    const arr = [...state];
    if (arr[index] && Object.keys(arr[index]).length > 0) {
      arr[index] = value;
    }
    setState(arr);
  };

  const updateItemField = (index, key, value) => {
    const arr = [...state];
    if (arr[index] && Object.keys(arr[index]).includes(key)) {
      arr[index][key] = value;
    }
    setState(arr);
  };

  const removeItem = (index) => {
    const arr = [...state];
    arr.splice(index, 1);
    setState(arr);
  };

  return [state, setState, addItem, updateItem, removeItem, updateItemField];
}

export default useArrState;
