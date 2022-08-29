import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import FastImage from 'react-native-fast-image';
import md5 from 'md5';
import { storeAppInitPhase } from '@store/App';
import * as Images from '@assets';
import { globalStyles, colors, spacing } from '@styles';
import {
  ButtonText,
  CustomText,
  Line,
  RoundedInput,
  ScrollViewList,
  Spinner,
} from '@components';
import { isExist, isArray, isObject, sentryMessage } from '@helpers';
import { errorMessages, storePhases } from '@constants';
import { userEmailLogin, isAuthenticatedStatus } from '@services';
import { useDispatch } from 'react-redux';

const reqdFields = ['email', 'password'];

const EmailLogin = ({ navigation }) => {
  const { navigate } = navigation;
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [missing, setMissingFields] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (f, v) => {
    isArray(missing) && setMissingFields([]);
    setFormData((prev) => ({
      ...prev,
      [f]: v,
    }));
  };

  const onLogin = useCallback(async () => {
    Keyboard.dismiss();
    const errors: Array<string> = reqdFields.filter(
      (e) => !isExist(formData[e]) && e,
    );
    if (isArray(errors)) {
      setMissingFields(errors);
      return;
    } else {
      setLoading(true);
      const res = await userEmailLogin({ params: { ...formData } });
      if (res && isObject(res.lastLoggedIn)) {
        sentryMessage(`email login success - ${res.lastLoggedIn.id}`);
        navigate('OtpAuth', {
          isInit: true,
          onVerification: async () => {
            await isAuthenticatedStatus(true);
            dispatch(storeAppInitPhase(storePhases.loading));
          },
        });
      } else {
        // check here
        sentryMessage(`email login failed - ${formData.email}`);
      }
      setLoading(false);
    }
  }, [dispatch, formData, navigate]);

  return (
    <ScrollViewList
      vertical={true}
      style={styles.container}
      contentContainerStyle={{ flex: 1 }}
      scrollEnabled={false}>
      {isLoading ? (
        <Spinner isWhiteBg={false} isFullScreen={false} isAbsolute={true} />
      ) : (
        <View />
      )}
      <View
        style={{ flex: 0.22, justifyContent: 'center', alignItems: 'center' }}>
        <FastImage
          source={Images.appWhiteLogo}
          style={{ width: 120, height: 70 }}
        />
      </View>
      <View
        style={styles.loginView}
        pointerEvents={isLoading ? 'none' : 'auto'}>
        <CustomText
          size="l"
          text="Sign in with your email"
          extraStyles={{ padding: spacing.m }}
        />
        <Line />
        <View style={styles.inputView}>
          <RoundedInput
            field="email"
            handleChange={handleChange}
            placeholder="Email"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
            onFocus={() => isArray(missing) && setMissingFields([])}
            fieldStyles={{ flex: 0.3, width: '90%' }}
            isInvalid={missing.includes('email')}
            error={errorMessages.inValidEmail}
          />
          <RoundedInput
            field="password"
            handleChange={(f, v) => handleChange(f, v ? md5(v) : v)}
            placeholder="Password"
            fieldStyles={{ marginTop: 20, width: '90%' }}
            textContentType="password"
            secureTextEntry={true}
            onFocus={() => isArray(missing) && setMissingFields([])}
            autoCapitalize="none"
            isInvalid={missing.includes('password')}
            error={errorMessages.inValidPassword}
          />
        </View>
        <View style={styles.button}>
          <ButtonText
            text="Sign In"
            onPress={() => {
              sentryMessage('Email Login Initialized');
              onLogin();
            }}
            size="xl"
            extraStyles={{ width: '90%' }}
          />
        </View>
        <Line />
        <View style={{ flex: 0.13, justifyContent: 'flex-end' }}>
          <CustomText
            size="s"
            text="By signing up, I agree to App's Terms of Service"
          />
        </View>
      </View>
    </ScrollViewList>
  );
};
export default EmailLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBlue,
  },
  loginView: {
    backgroundColor: colors.white,
    flex: 0.62,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 10,
    paddingVertical: spacing.m,
    width: '90%',
    alignSelf: 'center',
  },
  inputView: {
    width: '100%',
    paddingTop: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 0.6,
  },
  button: {
    ...globalStyles.columnCenter,
    flex: 0.3,
    width: '100%',
  },
});
