import React, { createContext, useState, useEffect, useContext } from 'react';
import { getTheme, isObject } from '@helpers';
import { ObjectType } from '../types';

export const ThemeContext = createContext({
  activeTheme: {},
  setActiveTheme: () => {},
  themes: {},
  setThemes: () => {},
});

export const ThemeProvider = ({ activeAppObject, children }: ObjectType) => {
  const [themes, setThemes] = useState({ primary: {}, secondary: {} });
  const [activeTheme, setActiveTheme] = useState({});

  useEffect(() => {
    const isData = isObject(activeAppObject);
    const primary = isData ? getTheme(activeAppObject.primary) : {};
    const secondary = isData ? getTheme(activeAppObject.secondary) : {};
    setThemes({ primary, secondary });
    setActiveTheme(primary);
  }, [activeAppObject]);

  return (
    <ThemeContext.Provider
      value={{
        activeTheme,
        setActiveTheme,
        themes,
        setThemes,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
ThemeProvider.defaultProps = {
  activeAppObject: { primary: {}, secondary: {} },
};

export const useTheme = (Component: typeof React.Component) => (props: any) => {
  const contextData = useContext(ThemeContext);
  return <Component {...props} {...contextData} />;
};
