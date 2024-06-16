import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

const LoadingScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
      <Text style={{ marginTop: 10,  color: '#000000',fontSize: 24, fontWeight: 'bold' }}>Please verify your email</Text>
      <ActivityIndicator size="large" color="#2BBC15" />
      <Text style={{ marginTop: 10,  color: '#000000', fontSize: 16, textAlign: 'center' }}>
        You're almost there! We sent an email to You
        {/* <Text style={{ fontWeight: 'bold' }}> duncan@memberstack.com</Text> */}
      </Text>
      <Text style={{ marginTop: 10,   color: '#000000',fontSize: 16, textAlign: 'center' }}>
        Just click on the link in that email to complete your signup. If you don't see it, you may need to
        <Text style={{ fontWeight: 'bold', color: '#000000', }}> check your spam folder.</Text>
      </Text>
     
    </View>
  );
};

export default LoadingScreen;
