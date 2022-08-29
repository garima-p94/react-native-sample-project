import React, {
  useContext,
  useEffect,
  createContext,
  useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { storeAppInitPhase } from '@store/App';
import { getLoggedInUserState } from '@store/User';
import {
  getUserPaymentCards,
  getUserAddresses,
  getCryptoAssetsList,
  getUserAccounts,
  getGlobalCryptoActivity,
  getAccountPortfolioList,
  getPortfolioWorth,
} from '@services';
import { storePhases } from '@constants';

const { success } = storePhases;
interface InitializeProps {
  isInitProcessStart?: boolean;
  children?: React.ReactNode | JSX.Element[];
}

export const InitializeProcessContext = createContext({
  onStartProcess: () => {},
});

export const InitializeProcessProvider = ({
  children,
  isInitProcessStart,
}: InitializeProps) => {
  const dispatch = useDispatch();
  const user = useSelector(getLoggedInUserState);

  const startProcess = useCallback(async () => {
    await getGlobalCryptoActivity({ params: { page: 1 }, isRefresh: true });
    await getCryptoAssetsList();
    await getAccountPortfolioList({ isRefresh: true });
    await getPortfolioWorth();
    dispatch(storeAppInitPhase(success));
    await getUserAccounts();
    await getUserPaymentCards({ isRefresh: true });
    await getUserAddresses({ isRefresh: true });
  }, [dispatch, user]);

  useEffect(() => {
    isInitProcessStart && startProcess();
  }, [isInitProcessStart, startProcess]);

  return (
    <InitializeProcessContext.Provider value={{ onStartProcess: startProcess }}>
      {children}
    </InitializeProcessContext.Provider>
  );
};

export const withInitializeProcess =
  (Component: typeof React.Component) => (props: object) => {
    const { onStartProcess } = useContext(InitializeProcessContext);
    return <Component {...props} onStartProcess={onStartProcess} />;
  };
