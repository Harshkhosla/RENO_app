import {View, Image, useWindowDimensions, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Carousel from 'react-native-reanimated-carousel';
import PaginationDot from 'react-native-animated-pagination-dot';

// import axios from 'react-native-axios';
import {useIsFocused} from '@react-navigation/native';
import Images from '../constants/Images';
import { Text } from 'react-native-elements';
import RoutePaths from '../Navigations/RoutePaths';
import { TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
const Caraouselanimation = ({  data }) => {
  // console.log(data,"harshshsshshshshshsh");
  
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const focused = useIsFocused();
  const { height, width } = useWindowDimensions();
  const handleButtonPress = (item) => {
    console.log("dhsddd", item);
    
   
  // Check if item.banner_title exists before converting to uppercase
  const uppercaseTitle = item ? item.toUpperCase() : '';
  const navigateTo = uppercaseTitle.replace(/^\//, '');
console.log(navigateTo,'ddssdsd');
if(navigateTo==="SERVCAT_HSM"){

  navigation.navigate( "SERVICES");// Assuming item.button_link contains the router path
}else{
  navigation.navigate( navigateTo);// Assuming item.button_link contains the router path

}
  };


  const renderitem = ({ item }) => {
    console.log(item);
    const words = item.banner_title.split(' ');

  // Get the first three words
  const firstThreeWords = words.slice(0, 3).join(' ');

  // Get the remaining words after the first three
  const remainingWords = words.slice(3).join(' ');
    return (
      <TouchableOpacity  onPress={() => handleButtonPress(item?.button_link)} >
            <View style={{ height: 179, width: '100%', position: 'relative' }}>
                <Image
                    source={{ uri: item?.banner_image_url }}
                    style={{
                        flex: 1,
                        width: null,
                        height: null,
                        alignSelf: 'stretch',
                        borderRadius: 20,
                        resizeMode: 'cover',
                    }}
                />
                 {/* onPress={handleButtonPress(item?.button_link)} */}
                <View style={styles.overlay }>
                    <Text style={styles.bannerTitle}> {firstThreeWords}
            {'\n'}
            {remainingWords}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
  };

  return (
    <View style={{ paddingTop: 10 }}>
      <View style={{ alignItems: 'center' }}>
        {focused && data ? (
          <Carousel
            pagingEnabled={true}
            loop={focused}
            width={width}
            height={179}
            autoPlay={true}
            scrollEnabled={true}
            data={data}
            scrollAnimationDuration={1000}
            onSnapToItem={(index) => setActiveIndex(index)}
            renderItem={renderitem}
          />
        ) : (
          <View style={{ width: width, height: 230 }} />
        )}
        {data ? (
          <PaginationDot
            activeDotColor={'green'}
            curPage={activeIndex}
            maxPage={data.length}
            sizeRatio={1.2}
          />
        ) : null}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center', // Align text to the center vertically
    alignItems: 'flex-start', // Align text to the left
    padding: 10, 
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black', // Adjust the color according to your design
  },
});

export default Caraouselanimation;
