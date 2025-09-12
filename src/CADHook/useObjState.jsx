import { useState } from "react";

/**
 * @param {Object} initialState
 * @returns {[Object, Function, Function, Function]}
 */
function useObjState(initialState) {
  const [state, setState] = useState(initialState);

  function handleState(key, value) {
    setState((prevObj) => ({ ...prevObj, [key]: value }));
  }

  function clearState() {
    setState(initialState);
  }

  return [state, setState, handleState, clearState];
}

export default useObjState;
