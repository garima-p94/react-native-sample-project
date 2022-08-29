import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { portfolioReducer, portfolioInitState } from './AccountPortfolio';
import { categoriesReducer, categoryInitState } from './Categories';
import { exploreReducer } from './Explore';
import { userInitState, userReducer, USER_LOG_OUT } from './User';
import { appReducer, appInitState } from './App';
import { ordersReducer } from './Orders';
import { ObjectType } from '@types';
import { storePhases } from '@constants';
import { clearAllLocalStorage } from '@utils';

const applicationReducer = combineReducers({
  portfolioReducer,
  categoriesReducer,
  exploreReducer,
  userReducer,
  appReducer,
  ordersReducer,
});

let store: ObjectType = {};
export const configureStore = ({
  isTestMode,
  activeAppObject,
  lastLoggedIn,
  activeUser,
  userDefaultAccount,
  isAuthenticated,
  appInitalizePhase,
}: ObjectType) => {
  const preLoaded = {
    appReducer: {
      ...appInitState,
      isTestMode,
      activeAppObject,
      appInitalizePhase,
    },
    userReducer: {
      ...userInitState,
      loginResponse: lastLoggedIn,
      activeUser,
      userDefaultAccount,
      isAuthenticated,
    },
    portfolioReducer: {
      ...portfolioInitState,
      portfolioAccount: userDefaultAccount,
    },
  };
  store = createStore(rootReducer, preLoaded, applyMiddleware(logger));
  return store;
};

export { store };

export const rootReducer = (state: any, action: any) => {
  if (state && action.type !== '@@redux/INIT') {
    if (action.type === USER_LOG_OUT) {
      // const stateCopy = Object.assign({}, state);
      clearAllLocalStorage(); // stateCopy
      Object.keys(state).map((key) => {
        if (key !== 'appReducer') {
          if (key === 'categoriesReducer') {
            state[key].categories = { ...categoryInitState };
          }
          state[key] = undefined;
        } else {
          state[key].appInitalizePhase = storePhases.init;
        }
      });
    }
  }
  return applicationReducer(state, action);
};
