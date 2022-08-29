import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, Keyboard, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { getActiveUserState, logoutUser } from '@store/User';
import { getOtp, verifyOtp } from '@services';
import {
  isExist,
  toMaskedEmail,
  isObject,
  isBoolean,
  toSentenceCase,
} from '@helpers';
import {
  Spinner,
  CodeInput,
  BaseHeader,
  CustomText,
  InitLogo,
} from '@components';
import { colors, globalStyles } from '@styles';
import { ObjectType } from '@types';

const OtpAuthentication = React.memo(() => {
  const { goBack, navigate } = useNavigation();
  const routes: ObjectType = useRoute();
  const dispatch = useDispatch();
  const userData = useSelector(getActiveUserState);

  const isInit = routes.params?.isInit ?? false;
  const onVerification = routes.params?.onVerification ?? null;

  const [isLoading, setLoading] = useState(true);
  const [codeValue, setCodeValue] = useState({
    code: '',
    isSent: true,
    seconds: 30,
  });

  const validateCode = (e) => isExist(e) && e.length === 6;

  const { gtype } = useMemo(() => {
    const type =
      isObject(userData.cust_data) &&
      isBoolean(userData.cust_data.is_sms_otp_enabled)
        ? 'phone'
        : 'email';
    return { gtype: type };
  }, [userData]);

  const isSendEnable = isExist(userData[gtype]);

  useEffect(() => {
    isSendEnable && onSendCode();
  }, []);

  useEffect(() => {
    if (codeValue.isSent) {
      const timerId = setInterval(() => {
        if (codeValue.seconds === 0) {
          handleChange({ key: 'isSent', value: false });
        } else {
          handleChange({ key: 'seconds', value: codeValue.seconds - 1 });
        }
      }, 1000);
      return () => clearInterval(timerId);
    }
  });

  const handleChange = ({ key, value }) => {
    setCodeValue((prevState) => ({ ...prevState, [key]: value }));
    if (validateCode(value)) {
      onSubmit(value);
    }
  };

  const onSendCode = async () => {
    setLoading(true);
    const isSent = await getOtp({ gtype });
    setLoading(false);
    if (isSent) {
      handleChange({ key: 'seconds', value: 30 });
      handleChange({ key: 'isSent', value: true });
    }
  };

  const handleSupport = async () => {
    await dispatch(logoutUser());
    goBack();
  };

  const onSubmit = async (code: string | number) => {
    Keyboard.dismiss();
    if (isLoading) {
      return;
    }
    setLoading(true);
    const isVerified = await verifyOtp({ gtype, code });
    if (isVerified) {
      if (onVerification) {
        await onVerification();
      }
    }
    setLoading(false);
  };

  const RenderFields = ({ value }) => (
    <View style={styles.fieldView}>
      <CustomText
        text={`Verification code was just sent to ${value}`}
        extraStyles={{ width: '95%', color: colors.mediumGray }}
        numberOfLines={3}
      />
      {/* <TouchableOpacity
        disabled={!isSendEnable}
        onPress={() => !isLoading && onSendCode()}
        style={fields.isSent && { marginBottom: 6 }}>
        {fields.isSent ?
            <DetailsText
              details={`Resend in ${fields.seconds}s`}
              extraStyles={{ color: colors.mediumGray }}
            /> :
            <DetailsText
              details="Send"
              extraStyles={[styles.sendButton, !isEnabled && { color: colors.lightGray }]}
            />}
      </TouchableOpacity> */}
    </View>
  );

  return (
    <View style={styles.container}>
      {!isInit ? <BaseHeader text="Verification" /> : <InitLogo isBack />}
      <View style={styles.planContainer}>
        {isLoading && (
          <Spinner isWhiteBg={false} isFullScreen={false} isAbsolute={true} />
        )}
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          {!isSendEnable && (
            <View style={{ marginTop: 40 }}>
              <Text style={{ color: colors.mediumGray, fontSize: 14 }}>
                {`Cannot send OTP as ${toSentenceCase(gtype)} is missing. `}
                <Text
                  suppressHighlighting
                  onPress={() => handleSupport()}
                  style={{ color: colors.appBlue }}>
                  Contact Support
                </Text>
              </Text>
            </View>
          )}
          {isSendEnable && (
            <>
              <View style={{ flex: 1, marginTop: 40 }}>
                <CustomText
                  isHeading
                  size="xxl"
                  text="Enter the verification code"
                />
                <View style={{ marginTop: 20 }}>
                  <RenderFields
                    value={
                      gtype === 'phone'
                        ? `${userData[gtype].replace(/\d(?=\d{4})/g, '*')}`
                        : toMaskedEmail(userData[gtype])
                    }
                  />
                  <CodeInput
                    editable={!isLoading}
                    animated={false}
                    codeLength={6}
                    cellSize={40}
                    value={codeValue.code}
                    onTextChange={(e) =>
                      handleChange({ key: 'code', value: e })
                    }
                    restrictToNumbers
                    cellSpacing={10}
                    containerStyle={{ marginVertical: 20 }}
                  />
                </View>
              </View>
              <View style={[globalStyles.rowCenter]}>
                <CustomText
                  isHeading
                  text={`00:${codeValue.seconds < 10 ? '0' : ''}${
                    codeValue.seconds
                  }`}
                  size="xl"
                  extraStyles={{
                    color: codeValue.isSent ? colors.appBlue : colors.darkGray,
                    marginRight: 10,
                  }}
                />
                <CustomText
                  text="Resend Code?"
                  size="m"
                  extraStyles={{
                    color: !codeValue.isSent
                      ? colors.appBlue
                      : colors.darkGray,
                  }}
                  onPress={() => !isLoading && onSendCode()}
                />
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
});

export default OtpAuthentication;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBlue,
  },
  planContainer: {
    flex: 0.75,
    backgroundColor: colors.white,
    marginHorizontal: 10,
    borderRadius: 15,
    justifyContent: 'center',
  },
  fieldView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  sendButton: {
    color: colors.appBlue,
    fontSize: 20,
    fontWeight: '800',
    bottom: 3,
  },
});
