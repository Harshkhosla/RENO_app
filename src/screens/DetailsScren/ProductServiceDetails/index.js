import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, 
  TouchableOpacity,StyleSheet, TouchableHighlight, Image } from 'react-native';
import Colors from '../../../constants/colors';
import ProjectShowCaseSlider from '../../../components/projectShowCaseSlider';
import { vh } from '../../../util/dimenstions';
import RoutePaths from '../../../Navigations/RoutePaths';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { Linking } from 'react-native';
import { BASE_URL } from '../../../services/environment';
import CommonHomeList from '../../../components/CommonHomeList';
import MarketPlaceCard from '../../../components/MarketPlaceCard';
import HomeServiceCard from '../../../components/HomeServiceCard';
import RenderHTML from 'react-native-render-html';

const ProductServiceDetails = ({ navigation,route }) => {
  const { data } = route.params;
  const [isLiked, setIsLiked] = useState(false);
  // const { user_Info } = useSelector(state => state.home);
  const { isLoading, user_Info,marketPlaceList, homeServiceList, showCaseList } =
    useSelector(state => state.home);
  const [isOrderPlacedModalVisible, setOrderPlacedModalVisible] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const checkCartStatus = async () => {
      try {
        const apiKey = '90bd6f5b-033f-42e7-8e92-2a443dfa42f8';
        const mid = user_Info?.mid;
        const pid = data?.pid;

        const response = await axios.get(
          `https://apis2.devcorps.in/api/cart_hsm/cart?mid=${mid}&pid=${pid}`,
          {
            headers: {
              'api-key': apiKey,
            },
          }
        );

        const result = response.data;

        if (result.success) {
          setIsInCart(result.existsInCart);
        } else {
          console.error('Failed to check cart status:', result.message);
          // You might want to show an error message to the user
        }
      } catch (error) {
        console.error('Error checking cart status:', error.message);
      }
    };

    checkCartStatus();
  }, [data?.pid])

  const handleOrderPlacedModalClose = () => {
    // Close the "Order Placed" modal
    setOrderPlacedModalVisible(false);

    navigation.navigate(RoutePaths.OrdersScreen);

    // Optionally, navigate to the success screen or perform any other actions
  };
  const handleAddToCart = async () => {
    try {
      const apiKey = '90bd6f5b-033f-42e7-8e92-2a443dfa42f8';
      const mid = user_Info?.mid;
      const pid = data?.pid;

      const formData = new FormData();
      formData.append('mid', mid);
      formData.append('pid', pid);

      const response = await axios.post(
        'https://apis2.devcorps.in/api/cart_hsm',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'api-key': apiKey,
          },
        }
      );

      const result = response.data;

      if (result.success) {
        // Product added to the cart successfully
        setIsInCart(true);
      } else {
        console.error('Failed to add the product to the cart:', result.message);
        // You might want to show an error message to the user
      }
    } catch (error) {
      console.error('Error adding the product to the cart:', error.message);
    }
  };


  useEffect(() => {
    const checkLikedStatus = async () => {
      try {
        const apiKey = '90bd6f5b-033f-42e7-8e92-2a443dfa42f8';
        const mid = user_Info?.mid

        const response = await axios.get(
          `https://apis2.devcorps.in/api/liked-products?mid=${mid}`,
          {
            headers: {
              'api-key': apiKey,
            },
          }
        );

        const likedItems = response.data?.likedItems;
        if (likedItems && likedItems.pid && likedItems.pid.includes(data?.pid)) {
          setIsLiked(true);
        }
      } catch (error) {
        console.error('Error checking liked status:', error.message);
      }
    };

    checkLikedStatus();
  }, [data?.pid]);
console.log(data,"dsjndvdsjkvnsd");
  const handleLikeClick = async () => {
    // Toggle the liked state
    setIsLiked(!isLiked);

    // You can also send a request to your server to update the like status
    // and count in your database
    try {
      const apiKey = '90bd6f5b-033f-42e7-8e92-2a443dfa42f8';
      const mid = user_Info?.mid
      const pid = data?.pid;

      const formData = new FormData();
      formData.append('mid', mid);
      formData.append('pid', pid);

      const response = await axios.post(
        'https://apis2.devcorps.in/api/like-pid',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'api-key': apiKey,
          },
        }
      );

      const result = response.data;

      if (!result.success) {
        console.error('Failed to like the product:', result.message);
        // Reset the liked state if the request fails
        setIsLiked(!isLiked);
        // You might want to show an error message to the user
      }
    } catch (error) {
      console.error('Error liking the product:', error.message);
    }
  };


  const fetchProductDetails = async (pid) => {
    try {
      const apiKey = '90bd6f5b-033f-42e7-8e92-2a443dfa42f8';

      const response = await fetch(`${BASE_URL}getProduct_hsm?pid=${pid}`, {
        headers: { 'api-key': apiKey },
      });
      const data = await response.json();

      if (data.success) {
        return data.product;
      } else {
        console.error('Failed to fetch product details:', data.message);
      }
    } catch (error) {
      console.error('Error fetching product details:', error.message);
    }
  };
  const handleOrderPlaced = () => {
    // Show the "Order Placed" modal
    setOrderPlacedModalVisible(true);
  };
  const pid=data.pid;
  const placeOrder = async () => {
    try {
      // Fetch details for each product in the cart
      const productsData = [
        {
          pid: data.pid,
          product_name: data.product_name,
          price: data.selling_price,
          photo: data.thumbnail_image,
          count: 1, // Assuming the count is 1 as there is no count in the product details
          reward_points: data.reward_points,
        }
      ];
    
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
      const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
      // Construct the order data
      const orderData = {
        amount: data?.selling_price,
        currency: "SGD",
        email: user_Info?.email,
        phone: user_Info?.phn,
        name: user_Info?.uname,
        payment_methods: ["paynow_online"],
        // purpose: cartProducts.map((product) => product.product_name).join(', '),
        expires_after: "5 mins",
        Odata: {
          mid: user_Info?.mid,
          amount: data?.selling_price,
          payment_mode: "Online",
          tracking_id: `TRACK${data?.selling_price}`,
          delivery_status: "Pending",
          payment_status: "pending",
          email: user_Info?.email,
          shipping_addr: "US, Washington DC, London 445423 USA", 
          contact: user_Info?.phn,
          uname: user_Info?.uname,
          coupon: "0 ",
          shipping: "25",
          subtotal: "97.00", 
          tax: "8", 
          products: productsData,
          date: formattedDate,
          time: formattedTime,
        },
        points: {
          mid: user_Info?.mid,
          camt: user_Info?.cashback_points,
          ramt: user_Info?.reward_points,
        },
      };
  const apiKey = '90bd6f5b-033f-42e7-8e92-2a443dfa42f8';
  const response = await fetch('https://apis.devcorps.in/payment-request', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  const result = await response.json();

  // Handle the API response result here
  console.log('Payment API Response:', result);
  if (result && result.url) {
    await Linking.openURL(result.url);
    console.log('Payment API Response:', result);
    handleOrderPlaced();
  } else {
    throw new Error('Invalid URL in the response');
  }
} 
  // handleOrderPlaced();
 catch (error) {
  console.error('Error placing order:', error.message);
  // Handle error appropriately (e.g., show an error message)
}
};


  return (
    <View style={styles.container}>
      <ScrollView>
        <ProjectShowCaseSlider isShareShow={true} data={data?.gallery_images} />
        <View style={{ backgroundColor: '#F5F5F5', minHeight: vh(54), padding: 10, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: Colors.Black, fontSize: 17, fontWeight: '700', flex: 1 }}>{data?.product_name}</Text>
          <TouchableHighlight underlayColor="transparent" onPress={handleLikeClick}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {isLiked ? (
                <Ionicons name="thumbs-up" size={20} color={Colors.Green} />
              ) : (
                <Ionicons name="thumbs-up-outline" size={20} color={Colors.Gray} />
              )}
              <Text style={{ color: isLiked ? Colors.Green : Colors.Gray, marginLeft: 5 }}>{isLiked ? 'Liked' : 'Like'}</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={{ backgroundColor: '#F5F5F5', minHeight: vh(54), padding: 10 }}>
          
          <Text style={{ color: '#3BA617', fontSize: 12, fontWeight: '500' }}>
            MRP: ${data?.selling_price}
          </Text>
          <Text style={{ color: '#3BA617', fontSize: 12, fontWeight: '500' }}>
            <Text style={{ textDecorationLine: 'line-through' }}>
              ${data?.unit_price}
            </Text>
          </Text>
        </View>
        {/* <Text style={{ margin: 10, color: Colors.Black, fontSize: 14 }}>
          {data?.short_desc}
        </Text> */}
        <RenderHTML
        source={{ html: data?.short_desc }}
        baseStyle={{ color: Colors.Black, fontSize: 14 ,textAlign:"justify"}}
      />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
        <TouchableHighlight
          style={styles.button}
          onPress={handleAddToCart}
          underlayColor={Colors.lightgreen2}
          disabled={isInCart} // Disable button if product is already in the cart
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: Colors.White }}>
              {isInCart ? 'Added in Cart' : 'Add To Cart'}
            </Text>
            {isInCart && <Ionicons name="checkmark" size={20}  color={Colors.White} style={{ marginLeft: 5 }} />}
          </View>
        </TouchableHighlight>
          <TouchableHighlight 
          // onPress={placeOrder}
            style={styles.button}
            // onPress={() => {}}
              onPress={() =>    navigation.navigate(RoutePaths.ChekoutHsm, { pid: pid })}
              
            underlayColor={Colors.lightgreen2}>
            <Text style={{ color: Colors.White }}>Buy Now</Text>
          </TouchableHighlight>
          <Modal
        isVisible={isOrderPlacedModalVisible}
        onBackdropPress={handleOrderPlacedModalClose}
        style={styles.modal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Order Placed</Text>
          <TouchableOpacity onPress={handleOrderPlacedModalClose} style={styles.okButton}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
        </View>
        <Text style={{ fontSize: 16, fontWeight: '500', color: Colors.Black , padding: 10 }}>
          Description
        </Text>
        <View style={{ backgroundColor: '#F5F5F5', minHeight: vh(54), padding: 10 }}>
          {/* <Text style={{ color: Colors.Black, fontSize: 15, fontWeight: '400' }}>
            {data?.desc}
          </Text> */}
             <RenderHTML
        source={{ html: data?.desc }}
        baseStyle={{ color: Colors.Black, fontSize: 15 ,textAlign:"justify"}}
      />
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, justifyContent: 'space-between' }}>
            <Text style={[styles.txt,]}>
              Similar listings
              </Text>
          </View>

          <ScrollView horizontal={true}>
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
             
          </ScrollView>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  circularCardImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#385752',
    padding: 10,
    margin: 10,
    borderRadius: 23,
    alignSelf: 'center',
    textDecorationLine: 'underline',
    width: '40%',
  },
  gap: {
    height: 20,
  },
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  modalContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.Black,
  },
  okButton: {
    backgroundColor: '#3c9429',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  okButtonText: {
    color: Colors.White,
  },
});

export default ProductServiceDetails;
