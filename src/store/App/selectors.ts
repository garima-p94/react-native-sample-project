import { createSelector } from 'reselect';
import { isObject, isExist } from '@helpers';
import { appInitState } from '.';
import { storePhases } from '@constants';

// appInitalizePhase
export const getAppInitPhaseState = (state: any = appInitState) => {
  return isExist(state.appReducer.appInitalizePhase)
    ? state.appReducer.appInitalizePhase
    : storePhases.init;
};

export const getAppModeState = (state: any = appInitState) => {
  return isExist(state.appReducer.isTestMode)
    ? state.appReducer.isTestMode
    : '1';
};

export const getActiveAppState = (state: any = appInitState) => {
  return isObject(state.appReducer.activeAppObject)
    ? state.appReducer.activeAppObject
    : {};
};
