import { StyleSheet, Text, View, Image, ScrollView ,TouchableOpacity} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../../constants/colors';
import { useSelector } from 'react-redux';
import MarketPlaceCard from '../../../../components/MarketPlaceCard';

import RoutePaths from '../../../../Navigations/RoutePaths';
import CommonHomeList from '../../../../components/CommonHomeList';
import CommonHomeList2 from '../../../../components/commonHomeList2';
import MarketPlaceCard2 from '../../../../components/MarketPlaceCard2';


const CategoryMpm = ({ navigation }) => {
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
        {/* Categories */}
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

        {/* Listings */}
        <ScrollView horizontal={true}>
          <CommonHomeList
            isHorizontal={true}
            data={listings}
            navigation={navigation}
            routePath={RoutePaths.MarketPlace}
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
        </ScrollView>
        <ScrollView horizontal={true}>
          <CommonHomeList
            isHorizontal={true}
            data={listings}
            navigation={navigation}
            routePath={RoutePaths.MarketPlace}
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
  txt: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.Black,
  },
  categoryCard: {
    marginTop: 4,
    marginRight: 18,
    alignItems: 'center',
  },
  categoryImage: {
    width: 40,
    height: 40,
    // borderRadius: 40,
    marginBottom: 8,
  },
  separator: {
    borderBottomWidth: 2,
    borderBottomColor: 'lightgray',
    marginHorizontal: 1,
    marginTop: 15,
    marginBottom: -15,
  },
  categoryName: {
    fontSize: 14,
    color: 'black',
  },
  gap: {
    height: 10,
  },
  listingCard: {
    marginVertical: 10,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.Gray,
    padding: 10,
    borderRadius: 8,
  },
 
  categoryImageContainer: {
    width: 48,
    height: 48,
    // borderRadius: 40,
    overflow: 'hidden',  
  },
  circularOutline: {
    borderWidth: 2,
    borderRadius: 40, 
    borderColor: '#8FC743', 
    padding: 2, 
  },
});

export default CategoryMpm;
