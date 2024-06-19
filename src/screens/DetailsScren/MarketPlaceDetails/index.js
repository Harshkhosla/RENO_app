import { Text, View, ScrollView, StyleSheet, TouchableHighlight, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _doHomeService, _doMarketPlace, _doShowCase } from '../../../../store/home/home.action';
import Caraouselanimation from '../../../components/Caraouselanimation';
import { vh } from '../../../util/dimenstions';
import Colors from '../../../constants/colors';
import ProjectShowCaseSlider from '../../../components/projectShowCaseSlider';
import MarketPlaceSlider from '../../../components/MarketPlaceSlider';
import RoutePaths from '../../../Navigations/RoutePaths';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CommonHomeList from '../../../components/CommonHomeList';
import MarketPlaceCard from '../../../components/MarketPlaceCard';
import { BASE_URL } from '../../../services/environment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import ReviewPopup from '../addreview';
import RenderHTML from 'react-native-render-html';


const MarketPlaceDetails = ({ navigation, route }) => {
  const { item } = route.params;
  const { data } = route.params;
  console.log(data,"harsh sior ");
  const { isLoading, marketPlaceList, homeServiceList, showCaseList } =
    useSelector(state => state.home);
  console.log(item, "254654");
  const [picUrl, setPicUrl] = useState(null);
  
  const [reviews, setReviews] = useState([]);
  const { user_Info } = useSelector(state => state.home);
  const [isLiked, setIsLiked] = useState(false);

  const [isReviewPopupVisible, setReviewPopupVisible] = useState(false);


  const openReviewPopup = () => {
    setReviewPopupVisible(true);
  };

  const closeReviewPopup = () => {
    setReviewPopupVisible(false);
  };

  useEffect(() => {
    // Call the API to get the member details
    const getMemberInfo = async () => {
      try {
        const apiKey = '90bd6f5b-033f-42e7-8e92-2a443dfa42f8';
        const mid = item?.mid;

        const response = await fetch(`${BASE_URL}viewmember_crm?mid=${mid}`, {
          headers: {
            'api-key': apiKey,
          },
        });

        const result = await response.json();

        if (result.success) {
          setPicUrl(result.member.pic_url);
        } else {
          console.error('Failed to fetch member details:', result.message);
        }
      } catch (error) {
        console.error('Error fetching member details:', error.message);
      }
    };

    getMemberInfo();
  }, []);

  const isSeller = user_Info?.mid === item?.seller_id;
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
        if (likedItems && likedItems.lid && likedItems.lid.includes(item?.lid)) {
          setIsLiked(true);
        }
      } catch (error) {
        console.error('Error checking liked status:', error.message);
      }
    };

    checkLikedStatus();
  }, [item?.lid]);

  const handleLikeClick = async () => {
    // Toggle the liked state
    setIsLiked(!isLiked);

    // You can also send a request to your server to update the like status
    // and count in your database
    try {
      const apiKey = '90bd6f5b-033f-42e7-8e92-2a443dfa42f8';
      const mid = user_Info?.mid
      const lid = item?.lid;

      const formData = new FormData();
      formData.append('mid', mid);
      formData.append('lid', lid);

      const response = await axios.post(
        'https://apis2.devcorps.in/api/like-lid',
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


  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `https://apis2.devcorps.in/api/getreviews_bypid?pid=${user_Info?.mid}`,
        {
          headers: {
            'api-Key': '90bd6f5b-033f-42e7-8e92-2a443dfa42f8',
          },
        }
      );

      const reviewData = await response.json();

      if (reviewData.success) {
        setReviews(reviewData.reviews);
      } else {
        console.error('Failed to fetch reviews:', reviewData.message);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error.message);
    }
  };

  const submitReview = (reviewData) => {
    console.log('Review Submitted:', reviewData);
    fetchReviews();
  };

  const showAllReviewsButton = reviews.length > 2 && (
    <TouchableHighlight
      style={{
        backgroundColor: '#CFCFCF',
        padding: 6,
        borderRadius: 12,
        marginTop: 10,
        alignItems: 'center',
      }}
      onPress={toggleHideReviews}
      underlayColor="#CFCFCF"
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
        <Text style={{ color: 'black', fontWeight: '700' }}>
          {showAllReviews ? 'Hide All Reviews' : 'Show All Reviews'}
        </Text>
        <MaterialIcons name={showAllReviews ? 'expand-less' : 'expand-more'} size={20} color="black" />
      </View>
    </TouchableHighlight>
  );

  const _handleButtonClick = (item, routePath) => {
    console.log(item);
    console.log(routePath);
    navigation.navigate(routePath, {item: item});
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#F5F5F5', minHeight: vh(54), padding: 10 }}>
        <ScrollView>
          <ProjectShowCaseSlider
            isShareShow={true}
            data={item?.slider_photos}
          />
           <View style={{ backgroundColor: '#F5F5F5', minHeight: vh(54), padding: 10, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: Colors.Black, fontSize: 17, fontWeight: '700', flex: 1 }}>{item?.service_name}</Text>
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
              MRP: ${item?.price}
            </Text>
            <View style={styles.gap} />

            <Text style={{ color: Colors.Black, fontSize: 15, fontWeight: '500' }}>
              Description
            </Text>

            {!isSeller && (
              <TouchableHighlight
                style={{
                  alignItems: 'center',
                  backgroundColor: '#385752',
                  padding: 10,
                  margin: 10,
                  borderRadius: 23,
                  alignSelf: 'center',
                  textDecorationLine: 'underline',
                  width: '100%'
                }}
                onPress={() => navigation.navigate(RoutePaths.ChatScreenListing, { mid: user_Info?.mid, lid: item?.lid, seller_id: item?.seller_id })}
                underlayColor={Colors.lightgreen2}
              >
                <Text style={{ color: Colors.White }}>Chat Now</Text>
              </TouchableHighlight>
            )}
          </View>
          {/* <Text style={{ margin: 10, color: Colors.Black, fontSize: 14 }}>{item?.description}</Text> */}
          <RenderHTML
        source={{ html: item?.description }}
        baseStyle={{ color: Colors.Black, fontSize: 14 }}
      />
          <View style={{ flexDirection: 'row', padding: 20, alignItems: 'center', marginBottom: 5, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'column', marginBottom: 5, justifyContent: 'space-between' }}>
              <Text style={{ color: Colors.Black }}>Posted By</Text>
              <View style={styles.gap} />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Image source={{ uri: picUrl }} style={styles.circularCardImage} />
                <Text style={{ color: Colors.Black }}>{item?.seller_name}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'column', marginBottom: 5, justifyContent: 'space-between' }}>
              <Text style={{ color: Colors.Black }}>Service Area</Text>
              <View style={styles.gap} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <MaterialIcons name="location-on" size={14} color="white" style={styles.locationIcon} />
                <View style={styles.gap1} />
                <Text style={{ color: Colors.Black }}>{item?.service_area}</Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ marginRight: '45%', color: Colors.Gray, fontSize: 17 }}>
            Reviews ({reviews?.length})
          </Text>
          <Text
            style={{
              marginRight: '45%',
              color: '#385752',
              fontSize: 14,
              textDecorationLine: 'underline',
            }}
            onPress={openReviewPopup}>
            Write a Review
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {Array.from({ length: data?.rating }).map((_, index) => (
            <MaterialCommunityIcons key={index} name="star" size={18} color={Colors.appOrange} />
          ))}
        </View>
        <Text style={{ marginRight: '45%', color: Colors.Black, fontSize: 17 }}>
          {data?.rating} out of 5
        </Text>
        {reviews
          .slice(0, reviews ? reviews?.length : 2)
          .map((review) => (
            <View key={review?.rid} style={styles.reviewContainer}>
              <Image source={{ uri: review?.review_photo }} style={styles.circularCardImage} />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.Gray }}>
                    {review?.username}
                  </Text>
                </View>
                <Text style={{ marginLeft: 2, fontSize: 9, color: '#00819E' }}>verified purchase</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                  {Array.from({ length: review?.rating }).map((_, index) => (
                    <MaterialCommunityIcons key={index} name="star" size={14} color={Colors.appOrange} />
                  ))}
                </View>
                <Text style={{ color: Colors.Black, fontSize: 14, fontWeight: '400' }}>
                  {review?.review}
                </Text>
              </View>
            </View>
          ))}
        {showAllReviewsButton}
        {reviews.length > 2 && showAllReviews && (
          <View>
            Additional reviews can be rendered here
          </View>
        )}
      {/* </ScrollView> */}
     
      <ReviewPopup visible={isReviewPopupVisible} onClose={closeReviewPopup}  onSubmit={submitReview}  />
 


          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, justifyContent: 'space-between' }}>
            <Text style={[styles.txt,]}>
              Similar listings
              </Text>
          </View>

          <ScrollView horizontal={true}>
            <CommonHomeList
              isHorizontal={true}
              data={marketPlaceList}
              headerTitle={"MarketPlace"}
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
        </ScrollView>
      </View>
    </View>
  );
};

export default MarketPlaceDetails;

const styles = StyleSheet.create({
  gap: {
    height: 10
  },
  gap1: {
    width: 10
  },
  circularCardImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 20,
  },
  locationIcon: {
    backgroundColor: '#385752',
    borderRadius: 40,
    padding: 6,
  },
  txt: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.Black,
  },
});