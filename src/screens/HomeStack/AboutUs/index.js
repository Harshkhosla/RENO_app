import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import Images from '../../../constants/Images';
import Colors from '../../../constants/colors';

const AboutUs = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleWebViewLoad = () => {
    setIsLoading(false);
  };

  return (
    <View style={{ flex: 1 ,padding:"16x"}}>
      <ImageBackground
        source={Images.harsh_Wallet2}
        style={{height: 100, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{ fontSize: 24, color: Colors.Black, fontWeight: 'bold', marginLeft: 10 }}>
        About Us
      </Text>
      </ImageBackground>
      <ScrollView>
        <View style={{ margin: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Crafting Your Dream Spaces with Heart and Integrity </Text>
          <Text style={{textAlign:"justify"}}>
            At GinGko Interior Solutions, we're not just designing spaces; we're nurturing dreams and building enduring relationships. Located in the heart of Singapore, our firm stands as a beacon of innovation, transparency, and unwavering dedication to our clients. From the moment you step into our world, you become part of the GinGko family—a place where your ideas are heard, your vision is respected, and your satisfaction is our highest priority.

            Our journey began with a simple yet profound belief: that interior design should be accessible, honest, transparent and deeply connected to the people it serves. Each project we undertake is more than just a job; it's a partnership built on trust and a shared desire to create something extraordinary. We specialize in crafting bespoke interior spaces that are not only visually stunning but also resonate with your personal style and enhance your everyday life. At GinGko, we pour our hearts into every design, every decision, and every detail. We understand that your space is a reflection of you, and we are honouredhonored to be part of the process that turns your vision into a reality. Our commitment to excellence is unwavering, and we strive to exceed your expectations at every turn. Join us on this journey of creativity, passion, and excellence as we work together to create spaces that inspire, comfort, and delight.
          </Text>
        </View>
        <Text style={{ margin: 10,fontSize: 24, fontWeight: 'bold' }}>Our Commitments</Text>
        <View style={{ margin: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Transparency in Every Aspect:</Text>
          <Text style={{textAlign:"justify"}}>
            We believe in honest and open communication. That's why we're the onlyfirst interior design firm in Singapore to publish our full price list online, ensuring that our clients have all the information they need upfront, with no hidden fees and no gimmicks.
          </Text>
        </View>
        <View style={{ margin: 10 }}>
          {/* <Image
            source={Images.personProfile}
            style={{
              height: 200,

              width: '100%',
              resizeMode: 'contain',
            }}
          /> */}
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Commitment to Quality and Value:</Text>
          <Text style={{textAlign:"justify"}}>
            Our approach combines the affordability of contractor-direct pricing with the added benefit of professional design services. We provide top-tier design quality at unbeatable rates, giving you the best of both worlds.
          </Text>
        </View>
        <View style={{ margin: 10 }}>
          <Image
            source={Images.harsh_Wallet}
            style={{
              height: 200,
              width: '100%',
              resizeMode: 'contain',
            }}
          />
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Personalized, Client-Centric Service:</Text>
          <Text style={{textAlign:"justify"}}>
          Each project is a collaboration between our expert interior designers, dedicated project coordinators, and you – our valued client. We listen to your needs, respect your vision, and work tirelessly to exceed your expectations.        </Text>
        </View>
        <View style={{ margin: 10 }}>
          <Image
            source={Images.harsh_Wallet1}
            style={{
              height: 200,
              width: '100%',
              resizeMode: 'contain',
            }}
          />
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>What Sets Us Apart</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Innovative Pricing Structure:</Text>
          <Text style={{textAlign:"justify"}}>
          GinGko Interior Solutions is revolutionizing the industry with our transparent pricing model. Experience the confidence and clarity that comes from knowing exactly what you're paying for.    </Text>
        </View>
        <View style={{ margin: 10 }}>
          {/* <Image
            source={Images.home_Carosule}
            style={{
              height: 200,
              width: '100%',
              resizeMode: 'contain',
            }}
          /> */}
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Expert Design Team:</Text>
          <Text style={{textAlign:"justify"}}>
          Our in-house interior designers are not just skilled; they are innovators in the field. With a keen eye for both current trends and timeless styles, they create spaces that are both functional and visually stunning.     </Text>
        </View>
        <View style={{ margin: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Local Craftsmanship:</Text>
          <Text style={{textAlign:"justify"}}>
          We take pride in our local roots. Our Singapore-based factory is a testament to our commitment to superior craftsmanship. Clients are welcome to visit and see the quality of our work firsthand.     </Text>
        </View>
        <View style={{ margin: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
More Than Just Contractors:</Text>
          <Text style={{textAlign:"justify"}}>
          At GinGko, we offer full-fledged interior design services. We're not just contractors; we're your partners in creating a space that you'll love. Our high-standard design solutions are tailored to your unique needs and preferences. </Text>
        </View>
        <View style={{ margin: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
          Join Us on the Journey</Text>
          <Text style={{textAlign:"justify"}}>
          Discover the difference with GinGko Interior Solutions. Whether you're looking to transform your home or revamp your business space, we're here to make your design dreams a reality. Contact us today to start your journey towards an inspired and beautifully designed future.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutUs;
