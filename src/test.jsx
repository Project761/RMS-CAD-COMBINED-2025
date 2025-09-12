import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useNoBackNavigation from "./useNoBackNavigation";

export default function Test() {
    useNoBackNavigation();
//   useEffect(() => {
//     // alert('hello');
//     window.history.pushState(null, document.title, window.location.href);
    
//     const handlePopState = () => {
//       window.history.go(1);
//     };
    
//     window.onpopstate = handlePopState;

//     // Cleanup the event listener on unmount
//     return () => {
//       window.onpopstate = null;
//     };
//   }, []);



  return <div>Test page.
    <Link to={'/dashboard-page'}>After login page</Link></div>;
}
