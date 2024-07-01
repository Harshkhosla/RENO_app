import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  ImageBackground,
} from 'react-native';
import Images from '../../../constants/Images';
import { vh, vw } from '../../../util/dimenstions';
import Colors from '../../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { signUpValidationSchema } from '../../../helper/Schema';
import Input from '../../../components/Input';
import { _dosignup } from '../../../store/auth/auth.actions';
import LoadingScreen from './LoadingScreen';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import CountryPicker from 'react-native-country-picker-modal';

const SignUp = ({ navigation }) => {
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [countryCode, setCountryCode] = useState('US');
  const [callingCode, setCallingCode] = useState('1');
  const dispatch = useDispatch();

  const handleSignUp = async (values) => {
    console.log('Submitting form with values:', values);

    try {
      let formdata = new FormData();
      formdata.append('uname', values.Name);
      formdata.append('pwd', values.Password);
      formdata.append('email', values.Email);
      formdata.append('phn', values.PhoneNumber);

      console.log('Form Data:', formdata);

      await dispatch(_dosignup(formdata, navigation));

      setIsEmailVerified(false);
    } catch (error) {
      console.error('Signup Error:', error);
    }
  };

  useEffect(() => {
    const verificationTimer = setTimeout(() => {
      setIsEmailVerified(true);
    }, 1000);

    return () => clearTimeout(verificationTimer);
  }, []);

  if (!isEmailVerified) {
    return <LoadingScreen />;
  }

  const onFacebookLoginFinished = (error, result) => {
    if (error) {
      console.log('Login failed with error: ', error);
    } else if (result.isCancelled) {
      console.log('Login was cancelled');
    } else {
      AccessToken.getCurrentAccessToken().then((data) => {
        console.log(
          'Facebook login successful with token: ',
          data.accessToken.toString()
        );
      });
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={Images.backgroundImage} style={styles.image}>
        <ScrollView>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backbtn}>
            <Icon name="arrow-back-outline" size={24} />
          </TouchableOpacity>
          <Image source={Images.logo} style={styles.logo} />

          <View style={styles.form}>
            <Text style={styles.text}>SIGN UP</Text>

            <Formik
              initialValues={{
                Name: '',
                Email: '',
                PhoneNumber: '',
                Password: '',
              }}
              validationSchema={signUpValidationSchema}
              onSubmit={(values) => handleSignUp(values)}
            >
              {({ handleChange, handleSubmit, values, errors, touched }) => (
                <>
                  <Input
                    placeholder="User Name"
                    value={values.Name}
                    onChangeText={handleChange('Name')}
                    error={errors.Name && touched.Name && errors.Name}
                  />
                  <Input
                    placeholder="E-mail"
                    value={values.Email}
                    onChangeText={handleChange('Email')}
                    error={errors.Email && touched.Email && errors.Email}
                  />
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Password"
                      placeholderTextColor="#888"
                      secureTextEntry={!passwordVisible}
                      value={values.Password}
                      onChangeText={handleChange('Password')}
                    />
                    <TouchableOpacity
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    >
                      <Icon
                        name={passwordVisible ? 'eye-off' : 'eye'}
                        size={20}
                        color="grey"
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.Password && touched.Password && (
                    <Text style={styles.errorText}>{errors.Password}</Text>
                  )}
                  <View style={styles.phoneContainer}>
                    <CountryPicker
                      countryCode={countryCode}
                      withFilter
                      withFlag
                      withCallingCode
                      withCallingCodeButton
                      onSelect={(country) => {
                        setCountryCode(country.cca2);
                        setCallingCode(country.callingCode[0]);
                      }}
                      containerButtonStyle={styles.countryPicker}
                    />
                    <TextInput
                      placeholder="Mobile Number"
                      value={values.PhoneNumber}
                      onChangeText={handleChange('PhoneNumber')}
                      style={styles.phoneInput}
                      keyboardType="phone-pad"
                    />
                  </View>
                  {errors.PhoneNumber && touched.PhoneNumber && (
                    <Text style={styles.errorText}>{errors.PhoneNumber}</Text>
                  )}
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('WebViewPage', {
                        title: 'Terms & Condition',
                        url: url.PRIVACY_POLICY,
                      })
                    }
                    style={{ alignSelf: 'flex-start', marginVertical: 11 }}
                  >
                    <Text style={{ fontSize: 12 }}>
                      By signing up, you agree to our{' '}
                      <Text style={{ color: '#88B347', fontSize: 12 }}>
                        Terms &{' '}
                      </Text>
                      <Text style={{ color: '#88B347', fontSize: 12 }}>
                        Privacy Policy
                      </Text>{' '}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.loginButton, { backgroundColor: '#385752' }]}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.buttonText}>Sign Up</Text>
                  </TouchableOpacity>
                </>
              )}
            </Formik>

            <View style={styles.orContainer}>
              <View style={styles.line} />

              <Text style={styles.font12gray}>OR</Text>

              <View style={{ flex: 0.6, height: 1, backgroundColor: '#dfdfdf' }} />
            </View>
            <TouchableOpacity
              style={[styles.loginButtonFacebook, { backgroundColor: '#3A589B' }]}
              onPress={onFacebookLoginFinished}
            >
              <Text style={styles.buttonText}>Login with Facebook</Text>
            </TouchableOpacity>
            <View style={styles.alreadyAccount}>
              <Text style={styles.signinText}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.clickableText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  logo: {
    alignSelf: 'center',
    height: vh(92),
    width: vw(174),
    marginTop: 20,
  },
  form: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  text: {
    color: '#2b2b2b',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e2e2',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 5,
    marginTop: 10,
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  checkAndForgotContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#8FC743',
    borderWidth: 0,
  },
  label: {
    fontSize: 16,
  },
  forgotPwd: {
    color: '#0D99FF',
  },
  loginButtonFacebook: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  line: { flex: 0.6, height: 1, backgroundColor: '#dfdfdf' },
  orText: {
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 5,
    fontSize: 10,
    fontWeight: 'bold',
  },
  alreadyAccount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signinText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#000',
  },
  clickableText: {
    color: '#8FC743',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
  },
  buildings: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    height: '75%',
    alignSelf: 'center',
  },
  font12gray: {
    fontSize: 12,
    color: '#aaa',
    margin: 10,
  },
  backbtn: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: Colors.White,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    left: 20,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 5,
    marginTop: 10,
  },
  countryPicker: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneInput: {
    flex: 0.7,
    padding: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default SignUp;
