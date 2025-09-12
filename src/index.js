// Import Component
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import AgencyData from './Context/Agency/Index';
import LoginData from './CADContext/loginAuth';
import IncidentData from './CADContext/Incident/index';
import QueueCallProvider from './CADContext/QueueCall/index';
import AxiosCom from './interceptors/axios';
import { PrimeReactProvider } from 'primereact/api';
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import reducers from "./redux/reducers";
import { thunk } from 'redux-thunk';
import { QueryClient, QueryClientProvider } from "react-query";
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

// Active user check
export const INACTIVE_USER_TIME_THRESHOLD = 600000;
export const USER_ACTIVITY_THROTTLER_TIME = 600000;

let userActivityTimeout = null;
let userActivityThrottlerTimeout = null;
let isInactive = true;

// please Don't remove Commented code Devkashyap
const queryClient = new QueryClient();

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <PrimeReactProvider>
        <LoginData>
          <IncidentData>
          <QueueCallProvider>
              <AgencyData>
                <App />
                <AxiosCom />
              </AgencyData>
          </QueueCallProvider>
          </IncidentData>
        </LoginData>
      </PrimeReactProvider>
    </QueryClientProvider>
  </Provider>
);



// const root = createRoot(document.getElementById('root'));
// let isLoggedIn = true
// const TIMEOUT = 600000


// activateActivityTracker();

// function activateActivityTracker() {
//   window.addEventListener("load", userActivityThrottler);
//   window.addEventListener("mousemove", userActivityThrottler);
//   window.addEventListener("click", userActivityThrottler);
//   window.addEventListener("scroll", userActivityThrottler);
//   window.addEventListener("keydown", userActivityThrottler);
//   window.addEventListener("resize", userActivityThrottler);
//   window.addEventListener("beforeunload", deactivateActivityTracker);
// }

// function deactivateActivityTracker() {
//   window.removeEventListener("mousemove", userActivityThrottler);
//   window.removeEventListener("scroll", userActivityThrottler);
//   window.removeEventListener("keydown", userActivityThrottler);
//   window.removeEventListener("resize", userActivityThrottler);
//   window.removeEventListener("beforeunload", deactivateActivityTracker);
// }

// function resetUserActivityTimeout() {
//   clearTimeout(userActivityTimeout);
//   userActivityTimeout = setTimeout(() => {
//     isLoggedIn = false
//     userActivityThrottler();
//   }, TIMEOUT);
// }

// function userActivityThrottler() {
//   if (isLoggedIn) {
//     root.render(
//       <Provider store={store}>
//         <PrimeReactProvider>
//           <AgencyData>
//             <App />
//             <AxiosCom />
//           </AgencyData>
//         </PrimeReactProvider>
//       </Provider>
//     );
//     resetUserActivityTimeout();
//   } else {
//     root.render(<Deactivate />);
//   }
//   if (!userActivityThrottlerTimeout) {
//     userActivityThrottlerTimeout = setTimeout(() => {
//       resetUserActivityTimeout();
//       clearTimeout(userActivityThrottlerTimeout);
//     }, TIMEOUT);
//   }
// }

// const Deactivate = () => {
//   window.location.href = '/'
//   localStorage.clear()
// }

