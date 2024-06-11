import { StyleSheet, Text, View, ImageBackground, ScrollView, Image,TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CommonHomeList from '../../../../components/CommonHomeList';
import HomeServiceCard from '../../../../components/HomeServiceCard';
import RoutePaths from '../../../../Navigations/RoutePaths';
import TopCard from '../../../../components/TopCard';
import MarketPlaceCard from '../../../../components/MarketPlaceCard';
import Colors from '../../../../constants/colors';
import Icons from 'react-native-vector-icons/Ionicons';

const MarketPlace = ({ navigation }) => {
  const { isLoading, marketPlaceList, homeServiceList, showCaseList } =
    useSelector(state => state.home);
 
    const [categoryData, setCategoryData] = useState([
      {
        cid: 'all',
        category_name: 'All',
        category_icon: 'https://files.devcorps.in/95c5043c-56de-42e2-b861-87ff36454524-removebg-preview.png',
      },
    ]);
  
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [listings, setListings] = useState([]);
  
    useEffect(() => {
      // Fetch category data
      fetchCategoryData();
    }, []);
  
    useEffect(() => {
      // Fetch listings based on selected category
      fetchListingsByCategory();
    }, [selectedCategory]);
  
    const fetchCategoryData = async () => {
      try {
        const response = await fetch('https://apis.devcorps.in/getAllCategory_mpm', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'api-key': '90bd6f5b-033f-42e7-8e92-2a443dfa42f8',
          },
        });
  
        const result = await response.json();
        if (result.success) {
          setCategoryData([...categoryData, ...(result.data || [])]);
        } else {
          console.error('Failed to fetch category data');
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };
  
    const fetchListingsByCategory = async () => {
      try {
        const response = await fetch('https://apis.devcorps.in/getAllListings_mpm', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'api-key': '90bd6f5b-033f-42e7-8e92-2a443dfa42f8',
          },
        });
  
        const result = await response.json();
        if (result.success) {
          const filteredListings = selectedCategory === 'all'
            ? result.data
            : result.data.filter(listing => listing.category.toLowerCase() === selectedCategory.toLowerCase());
  
          setListings(filteredListings || []);
        } else {
          console.error(`Failed to fetch listings for category: ${selectedCategory}`);
        }
      } catch (error) {
        console.error(`Error fetching listings for category: ${selectedCategory}`, error);
      }
    };
  
    const handleCategoryPress = (category) => {
      setSelectedCategory(category.category_name.toLowerCase());
    };
  
    const _handleButtonClick = (item, routePath) => {
      console.log(item);
      console.log(routePath);
      navigation.navigate(routePath, { item: item });
    };
  

  return (
    <ScrollView>
    <View style={styles.container}>
    <Text style={[styles.title, ]}>MarketPlace</Text>
   <ScrollView horizontal={true}>
   {categoryData.map(category => (
  <TouchableOpacity
    key={category.cid}
    style={[
      styles.categoryCard,
      selectedCategory === category.category_name.toLowerCase() && styles.selectedCategoryCard,
    ]}
    onPress={() => handleCategoryPress(category)}
  >
    <View
      style={[
        styles.categoryImageContainer,
        selectedCategory === category.category_name.toLowerCase() && styles.circularOutline,
      ]}
    >
      <Image
        source={{ uri: category.category_icon }}
        style={styles.categoryImage}
      />
    </View>
    <Text style={styles.categoryName}>{category.category_name}</Text>
  </TouchableOpacity>
))}




        
      </ScrollView>
      <View style={styles.separator} />
      <View style={styles.gap} />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, justifyContent: 'space-between' }}>
      <Text style={[styles.txt, ]}>
      Trending Now
            </Text>
          
            <TouchableOpacity
          style={styles.txt1}
          onPress={() => navigation.navigate(RoutePaths.CategoriesPage)}
          >
           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text style={styles.viewMoreText}>View More</Text>
    <Icons name="chevron-forward" size={20} color={'#385752'} />
  </View>

        </TouchableOpacity>
      
      </View>
      <ScrollView horizontal={true}>
        <CommonHomeList
          isHorizontal={true}
          data={listings}
          // headerTitle={'Trending Now'}
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
      </ScrollView>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, justifyContent: 'space-between' }}>
      <Text style={[styles.txt, ]}>
      Best Selling Product
                  </Text>
                  <TouchableOpacity
          style={styles.txt1}
          onPress={() => navigation.navigate(RoutePaths.CategoriesPage)}
          >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text style={styles.viewMoreText}>View More</Text>
    <Icons name="chevron-forward" size={20} color={'#385752'} />
  </View>
  </TouchableOpacity>

          
      
      </View>
      <ScrollView horizontal={true}>
        <CommonHomeList
          isHorizontal={true}
          data={listings}
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
      </ScrollView>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, justifyContent: 'space-between' }}>
      <Text style={[styles.txt, ]}>
      Recommended For you
            </Text>
            <TouchableOpacity
          style={styles.txt1}
          onPress={() => navigation.navigate("CategoriesPage")}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text style={styles.viewMoreText}>View More</Text>
    <Icons name="chevron-forward" size={20} color={'#385752'} />
  </View>
  </TouchableOpacity>

      
      </View>
      <ScrollView horizontal={true}>
        <CommonHomeList
          isHorizontal={true}
          data={listings}
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
      </ScrollView>
    </View>
    </ScrollView>
    
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12, 
  },
  categoriesText: {
    color: Colors.Black,
    fontSize: 16,

    marginLeft: 16,
  },
  circularOutline: {
    borderWidth: 2,
    borderRadius: 40, 
    borderColor: '#8FC743', 
    padding: 2, 
  },
  viewMoreText: {
    fontSize: 16,
    fontWeight: '400',
    // marginRight: 5,
    color: '#385752',
    
  },
  separator: {
    borderBottomWidth: 2,
    borderBottomColor: 'lightgray',
    marginHorizontal: 1,
    marginVertical: 15,
  },
  txt: {
   
    fontSize:19,
  fontWeight: 'bold',
    fontWeight: '400',
    color: Colors.Black,

  },
  title: {
    fontSize: 24, // Adjust the font size as needed
    // textAlign: 'center',
    marginBottom:2,
    color: Colors.Black,
  },
  txt1: {
    fontSize: 16,
    fontWeight: '400',
    color: '#488C20',

  },
  categoryCard: {
    marginTop: 10,
    marginRight: 18,
      overflow: "hidden", /* This prevents the image from overflowing the container */
    position: "relative",
    alignItems: 'center',
  },
  categoryImage: {
    width: 36,
    // aspectRatio: 1,
    height: 36,
    // borderRadius: 60,
   
  },
  categoryName: {
    fontSize: 14,
    color: 'black',
  },
 gap:{
  height:10
 }
});

export default MarketPlace;
