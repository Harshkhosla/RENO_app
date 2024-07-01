import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Image } from 'react-native';
import CommonHomeList from '../../../../components/CommonHomeList';
import TopCard from '../../../../components/TopCard';
import HomeServiceCard from '../../../../components/HomeServiceCard';
import RoutePaths from '../../../../Navigations/RoutePaths';
import { useSelector } from 'react-redux';
import Colors from '../../../../constants/colors';
const Services = ({ navigation }) => {
  const [selectedItemCategory, setSelectedItemCategory] = useState('Product');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [productCategories, setProductCategories] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [selectedCategoryProducts, setSelectedCategoryProducts] = useState([]);
  const [selectedCategoryProducts1, setSelectedCategoryProducts1] = useState([]);
console.log(selectedCategory,"<>>>>>>>>>>ddjdsnjsdn");
// console.log(serviceCategories,"<>>>>>>>>>>ddjdsnjsdn");
  const { isLoading, marketPlaceList, homeServiceList, showCaseList } =
    useSelector((state) => state.home);

  useEffect(() => {
    if (selectedItemCategory === 'Product') {
      fetchProductCategories();
      fetchServiceCategories2();
    } else if (selectedItemCategory === 'Service') {
      fetchServiceCategories();
      // fetchProductsForCategory();
      
      // fetchServiceCategories3();
      console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjj",selectedCategoryProducts1);
      setSelectedCategoryProducts1(selectedCategoryProducts1.filter(item => item.product_category === '')); 
      console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjj",selectedCategoryProducts1);
      // console.log();
    } else {
      setProductCategories([]);
      setServiceCategories([]);
    }
  }, [selectedItemCategory,selectedCategoryProducts]);
// console.log(productCategories,"oaosooao");
// console.log(serviceCategories,"sddskhdhjsb");
  useEffect(() => {
    if (selectedItemCategory && selectedCategory) {
      const categoryNameField =
        selectedItemCategory === 'Product' ? 'product_category' : 'service_category';
      const categoryId = selectedCategory.pcid; // Replace 'pcid' with the correct field for product category
      const serviceCategoryId = selectedCategory.scid; // Use the correct field for service category
      // Fetch products only if a specific category is selected
      if (selectedCategory.category_name !== 'All') {
        fetchProductsForCategory(
          categoryNameField,
          selectedItemCategory === 'Product' ? categoryId : serviceCategoryId
        );
      }
    }
  }, [selectedItemCategory, selectedCategory]);

  useEffect(() => {
    // Fetch all products when 'All' category is selected
    if (selectedItemCategory && selectedCategory && selectedCategory.category_name === 'All') {
      fetchProductsForCategory(
        selectedItemCategory === 'Product' ? 'product_category' : 'service_category',
        ''
      );
    }
  }, [selectedCategory]);

  const fetchProductCategories = async () => {
    try {
      const response = await fetch('https://apis.devcorps.in/getAllProductCategories_hsm', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'api-key': '90bd6f5b-033f-42e7-8e92-2a443dfa42f8',
        },
      });

      const result = await response.json();
      if (result.success) {
        setProductCategories(result.data || []);
      } else {
        console.error('Failed to fetch product categories');
      }
    } catch (error) {
      console.error('Error fetching product categories:', error);
    }
  };

  const fetchServiceCategories = async () => {
    try {
      const response = await fetch('https://apis.devcorps.in/getAllServiceCategories_hsm', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'api-key': '90bd6f5b-033f-42e7-8e92-2a443dfa42f8',
        },
      });

      const result = await response.json();
      if (result.success) {
        setServiceCategories(result.data || []);
      } else {
        console.error('Failed to fetch service categories');
      }
    } catch (error) {
      console.error('Error fetching service categories:', error);
    }
  };

  const fetchServiceCategories2 = async () => {
    try {
      const response = await fetch('https://apis.devcorps.in/getAllProducts_hsm', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'api-key': '90bd6f5b-033f-42e7-8e92-2a443dfa42f8',
        },
      });

      const result = await response.json();
      if (result.success) {
        
        // setSelectedCategoryProducts1([]);/
        setSelectedCategoryProducts1(result?.products || []);
      } else {
        console.error('Failed to fetch service categories');
      }
    } catch (error) {
      console.error('Error fetching service categories:', error);
    }
  };

  const fetchServiceCategories3 = async () => {
    try {
      const response = await fetch('https://apis.devcorps.in/getAllServiceCategories_hsm', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'api-key': '90bd6f5b-033f-42e7-8e92-2a443dfa42f8',
        },
      });

      const result = await response.json();
      if (result.success) {
        setSelectedCategoryProducts1(result?.products || []);
      } else {
        console.error('Failed to fetch service categories');
      }
    } catch (error) {
      console.error('Error fetching service categories:', error);
    }
  };

  const fetchProductsForCategory = (categoryNameField, categoryId) => {
    console.log(categoryNameField,"sdkjsdjn");
    console.log(homeServiceList,"sdkjsdjn");
    const productsForCategory = homeServiceList.filter(
      (product) => !categoryId || product[categoryNameField] === categoryId
    );
    setSelectedCategoryProducts(productsForCategory);
  };

  const _handleItemCategoryClick = (itemCategory) => {
    setSelectedItemCategory(itemCategory);
    setSelectedCategory({ category_name: itemCategory  });
  };

  const _handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const getCategoryNameById = (categoryId, categoryNameField) => {
    const categories = selectedItemCategory === 'Product' ? productCategories : serviceCategories;
    const category = categories.find((cat) => cat.pcid === categoryId);
    return category ? category[categoryNameField] : '';
  };

  const getCategoryData = () => {
    console.log(selectedItemCategory);
    return selectedItemCategory === 'Product' ? productCategories : serviceCategories;
  };

  return (
    <ScrollView>
      <View style={styles.container}>
      <Text style={[styles.title, ]}>Home Services</Text>
        <CommonHomeList
          isHorizontal={true}
          data={['Service Category', 'Product Category']}
        
          renderItem={(item, index) => {
            // Add your rendering logic for the horizontal list items here if needed
          }}
        />

        <View style={styles.categoryContainer}>
          
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedItemCategory === 'Product' && styles.selectedItemCategory,
            ]}
            onPress={() => _handleItemCategoryClick('Product')}
          >
            <Text style={[styles.itemcategoryText, ]}>
              Product Category
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedItemCategory === 'Service' && styles.selectedItemCategory,
            ]}
            onPress={() => _handleItemCategoryClick('Service')}
          >
            <Text style={[styles.itemcategoryText]}>
              Service Category
            </Text>
          </TouchableOpacity>
        </View>

        {selectedItemCategory && (
  <ScrollView horizontal={true}>
    {[{ category_name: 'All', photos: ['https://files.devcorps.in/95c5043c-56de-42e2-b861-87ff36454524-removebg-preview.png'] }, ...getCategoryData()].map((category) => (
      <TouchableOpacity
        key={category.category_name}
        style={[
          styles.categoryCard,
          selectedCategory && selectedCategory.category_name === category.category_name && styles.selectedCategory,
        ]}
        onPress={() => _handleCategoryClick(category)}
      >
        {selectedCategory && selectedCategory.category_name === category.category_name && (
          <View style={styles.circularOutline}>
            <Image source={{ uri: category.photos[0] }} style={styles.categoryImage} />
          </View>
        )}
        {selectedCategory && selectedCategory.category_name !== category.category_name && (
          <View  style={{borderRadius: 70}}>

            <Image source={{ uri: category.photos[0] }} style={styles.categoryImage} />
          </View>
        )}
        <Text style={styles.categoryName}>{category.category_name}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
)}
{/* <Text>dvsdvvsdv</Text> */}


<View style={styles.separator} />
{selectedCategory?.category_name === "Service" ? (
  selectedCategoryProducts.length > 0 ? (
    <ScrollView horizontal={true}>
      <View style={styles.productListContainer}>
        {selectedCategoryProducts1 && selectedCategoryProducts1.length > 0 && (
          <CommonHomeList
            isHorizontal={false}
            data={selectedCategoryProducts1}
            headerTitle={`Products in ${selectedCategory.category_name === 'All' ? (selectedItemCategory === 'Product' ? 'Product' : 'Service') : selectedCategory.category_name} Category`}
            renderItem={(item, index) => {
              console.log(item); // Logging the item
              return <HomeServiceCard data={item.item} />;
            }}
          />
        )}
      </View>
    </ScrollView>
  ) : null
) : (
  <>
    <View style={styles.gap} />
    <View style={styles.divider} />

    {selectedItemCategory && selectedCategory && selectedCategoryProducts.length > 0 && (
      <ScrollView horizontal={true}>
        <View style={styles.productListContainer}>
          <CommonHomeList
            isHorizontal={false}
            data={selectedCategoryProducts}
            headerTitle={`Products in ${getCategoryNameById(
              selectedCategory.category_id,
              selectedItemCategory === 'Product' ? 'product_category' : 'service_category'
            )} Category`}
            renderItem={(item, index) => (
              <HomeServiceCard data={item.item} />
            )}
          />
        </View>
      </ScrollView>
    )}
  </>
)}
    



      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   padding:8
  },

  circularOutline: {
    borderWidth: 2,
    borderRadius: 46, 
    borderColor: '#8FC743', 
    padding: 4, 
  },
  divider: {
    height: 1,
    backgroundColor: 'CFCFCF',
    marginEnd:10,
    marginStart:10

  },

  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 36,
    marginTop: -15,
    marginBottom: 12,
  },

  itemcategoryText: {
    color: '#000',
    fontSize:17
  },
  title: {
    fontSize: 24, // Adjust the font size as needed
    // textAlign: 'center',
    marginBottom:4,
    color: Colors.Black,
  },
  selectedItemCategory: {
    borderBottomWidth: 2,
    borderBottomColor: '#8FC743',
  },
  selectedCategory: {
    borderBottomColor: '#8FC743',
  },
  categoryCard: {
    marginTop: 10,
    marginRight: 18, overflow: "hidden", /* This prevents the image from overflowing the container */
    position: "relative",
    alignItems: 'center',
  },
  categoryImage: {
    width: 42,
    aspectRatio: 1,
    height: 42,
    // borderRadius: 70,
   
  },  separator: {
    borderBottomWidth: 2,
    borderBottomColor: 'lightgray',
    marginHorizontal: 1,
    marginTop: 15,
    marginBottom: -15,
  },
  categoryName: {
    fontSize: 12,
    color: 'black',
  },
  productListContainer: {
    marginTop: 16,
   
  },
  gap:{
    height:10
  }
});

export default Services;