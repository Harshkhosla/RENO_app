import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios'
import React, {useEffect, useState} from 'react';
import Caraouselanimation from '../../../../components/Caraouselanimation';
import MarketPlaceCard from '../../../../components/MarketPlaceCard';
import HomeServiceCard from '../../../../components/HomeServiceCard';
import HomeShowCaseCard from '../../../../components/HomeShowCaseCard';
import CommonHomeList from '../../../../components/CommonHomeList';
import SearchBar from '../../../../components/SearchBar';
import { get_product_list } from '../../../../services/getApi';
import { GET_BANNER, MARKET_PLACE_LIST } from '../../../../services/ApiUrls';
import { useDispatch, useSelector } from 'react-redux';
import { _doGetUserInfo, _doHomeService, _doMarketPlace, _doShowCase } from '../../../../store/home/home.action';
import RoutePaths from '../../../../Navigations/RoutePaths';
import { showSnack } from '../../../../util/snack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/Ionicons';
import Colors from '../../../../constants/colors';
import AppTextInput from '../../../../components/AppTextInput';
import { normalize } from '../../../../util/dimenstions';

const Home = ({navigation}) => {
  const {isLoading, marketPlaceList, homeServiceList, showCaseList} = useSelector(state => state.home);
  const {User_mid} = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [bannerData, setBannerDate] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchComplete, setSearchComplete] = useState(false);
console.log(searchResults,"jhatsgshsh");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(_doMarketPlace());
    dispatch(_doHomeService());
    dispatch(_doShowCase());
    if (User_mid) {
      dispatch(_doGetUserInfo(User_mid));
    }

    getBannerList();
  }, []);

  const _handleButtonClick = (item, routePath) => {
    navigation.navigate(routePath, {item: item});
  };

  const getBannerList = () => {
    get_product_list(GET_BANNER)
      .then(result => {
        if (result?.success) {
          setBannerDate(result?.banners);
        } else {
          showSnack(result?.msg);
        }
      })
      .catch(error => {
        showSnack(error.message);
      });
  };

const handleSearch = (searchTerm) => {
  const apiKey = '90bd6f5b-033f-42e7-8e92-2a443dfa42f8';
  const searchUrl = `https://apis2.devcorps.in/api/search?searchTerm=${searchTerm}`;
  
  axios.get(searchUrl, { headers: { 'api-key': apiKey } })
  .then(response => {
      console.log(response,"harshharsh");
      if (response?.data.success) {
        setSearchResults(response?.data?.lid.concat(response?.data?.spid, response?.data?.pid));
        setSearchComplete(true); // Set searchComplete to true when search results are available
      } else {
        setSearchResults([]);
        setSearchComplete(false); // Set searchComplete to false if no results found
      }
    })
    .catch(error => {
      setSearchResults([]);
      setSearchComplete(false); // Set searchComplete to false on error
    });
};

  return (
    <View style={{flex: 1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.searchContainer}>
          <AppTextInput
            style={styles.inputStyle}
            placeholder={'Search'}
            onChangeText={text => setSearchTerm(text)} // Update search term state
            placeholderTextColor={'#CACACA'}
            value={searchTerm.toString()} // Bind value to state
          />
          <TouchableOpacity
  style={styles.searchButton}
  onPress={() => handleSearch(searchTerm)} // Corrected onPress event
>
  <Text style={styles.searchButtonText}>Search</Text>
</TouchableOpacity>
        </View>


        {bannerData.length > 0 && <Caraouselanimation data={bannerData} />}

        {searchComplete && searchResults.length > 0 && ( // Render CommonHomeList only when search is complete and results are available
          <CommonHomeList
            navigation={navigation}
            routePath={RoutePaths.MarketPlace}
            isHorizontal={true}
            data={searchResults} // Render searchResults instead of marketPlaceList
            headerTitle={'MarketPlace'}
            renderItem={(item, index) => {
              return (
                <MarketPlaceCard
                  data={item.item}
                  onPress={() =>
                    _handleButtonClick(item.item, RoutePaths.MarketPlaceDetails)
                  }
                />
              );
            }}
          />
        )}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>MarketPlace</Text>
          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={() => navigation.navigate(RoutePaths.CategoriesPage)}>
            <Text style={styles.viewMoreText}>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text style={styles.viewMoreText}>View More</Text>
    <Icons name="chevron-forward" size={20} color={'#385752'} />
  </View>
</Text>

          </TouchableOpacity>
        </View>

        <CommonHomeList
          navigation={navigation}
          routePath={RoutePaths.MarketPlace}
          isHorizontal={true}
          data={marketPlaceList}
          headerTitle={'MarketPlace'}
          renderItem={(item, index) => {
            {console.log(item,"sdckjhbvdhbs");}
            return (
              <MarketPlaceCard
                data={item.item}
                onPress={() =>
                  _handleButtonClick(item.item, RoutePaths.MarketPlaceDetails)
                }
              />
            );
          }}
        />

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Home Service</Text>
          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={() => navigation.navigate(RoutePaths.Services)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text style={styles.viewMoreText}>View More</Text>
    <Icons name="chevron-forward" size={20} color={'#385752'} />
  </View>
          </TouchableOpacity>
        </View>

        <CommonHomeList
          navigation={navigation}
          routePath={RoutePaths.Services}
          isHorizontal={true}
          data={homeServiceList}
          headerTitle={'Home Service'}
          renderItem={(item, index) => {
            return (
              <HomeServiceCard
                data={item.item}
                onPress={() =>
                  _handleButtonClick(item.item, RoutePaths.ShowCaseDetails)
                }
              />
            );
          }}
        />

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>ShowCase</Text>
          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={() => navigation.navigate(RoutePaths.showCase)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text style={styles.viewMoreText}>View More</Text>
    <Icons name="chevron-forward" size={20} color={'#385752'} />
  </View>
        </TouchableOpacity>
        </View>

        <CommonHomeList
          navigation={navigation}
          routePath={RoutePaths.showCase}
          isHorizontal={true}
          data={showCaseList}
          headerTitle={'Project ShowCase'}
          renderItem={(item, index) => {
            return (
              <HomeShowCaseCard
                data={item.item}
                onPress={() =>
                  _handleButtonClick(item.item, RoutePaths.ShowCaseDetails)
                }
              />
            );
          }}
        />

  

      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          navigation.navigate(RoutePaths.ChattingScreen)
          console.log('Forum button pressed');
        }}>
        <Icon name="forum" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    padding: 8,
  },
  sectionContainer:{
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between',
 padding:8
  },
  sectionTitle:{
   fontSize:19,
   fontWeight: 'bold',
   fontFamily: 'Poppins-Bold',
  },
  searchButton: {
    backgroundColor: '#385752',
    borderRadius: 5,
    marginLeft: 8,
    marginTop:10,
    padding: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginTop: 5,
    justifyContent: 'space-between',
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.Black,
    fontFamily: 'Poppins-Regular',
  },
  viewMoreButton: {
    fontSize: 16,
    fontWeight: '400',
    color: '#385752',
    alignItems: 'center',
  }, inputStyle: {
    height: 45,
    width:'80%',
    fontSize: normalize(15),
    borderRadius: 10,
    fontFamily: 'Poppins-Regular',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#385752',
    borderRadius: 30,
    padding: 15,
    elevation: 5,
  },
  viewMoreText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#385752',
    fontFamily: 'Poppins-Regular',
  },
});

export default Home;
