import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';
import Colors from '../../../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import RoutePaths from '../../../../Navigations/RoutePaths';

const SupportScreen = () => {
  const [chats, setChats] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  console.log("kkkkdsdsdsddsskkkkkkk",socket);
  const [loadspin, setLoadSpin] = useState(false);
  const [creatingTicket, setCreatingTicket] = useState(false);
  const [showChatWindow, setShowChatWindow] = useState(false); // New state
  const { user_Info } = useSelector((state) => state.home);

  useEffect(() => {
    // Fetch initial chat messages
    fetchChatData();
  }, []);

  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io('https://ws.devcorps.in', {
      path: '/socket.io',
      transports: ['websocket'], // Use WebSocket transport
    });
  
    setSocket(socket);
  
    // Fetch initial chat messages
    fetchChatData();
  
    // Add event listeners for receiving messages
    socket.on('message', (newMessage) => {
      console.log(newMessage,"lsdlksddsdssdkdskksdlklsd");
      setChats((prevChats) => [...prevChats, newMessage]);
    });
  
    // Clean up function to disconnect the socket when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);
  const fetchChatData = async () => {
    try {
      const mid = user_Info?.mid;
      const response = await axios.post(
        'https://apis.devcorps.in/getticket',
        { tid: mid },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': '90bd6f5b-033f-42e7-8e92-2a443dfa42f8',
          },
        }
      );

      if (response?.data?.success) {
        setChats(response?.data?.data?.msgs || []);
        setCreatingTicket(response?.data?.data?.msgs?.length === 0);
        setShowChatWindow(response?.data?.data?.msgs?.length > 0) // Update state based on existing messages
      } else {
        // If ticket not found, set creatingTicket to true
        setCreatingTicket(true);
      }
    } catch (error) {
      console.error('Error fetching chat data:', error.message);
    }
  };

  const createTicket = async () => {
    try {
      const mid = user_Info?.mid;
      const createTicketResponse = await axios.post(
        'https://apis.devcorps.in/createticket',
        {
          uid: mid,
          subj: subject,
          msg: message,
          usname: 'reno_dev',
          role: 'user',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': '90bd6f5b-033f-42e7-8e92-2a443dfa42f8',
          },
        }
      );
  
      if (createTicketResponse?.data && createTicketResponse?.data?.success) {
        const responseData = createTicketResponse?.data?.data;
        const newChats = responseData && responseData?.msgs ? responseData?.msgs : [];
        setChats(newChats);
        setSubject('');
        setMessage('');
        setCreatingTicket(false);
        setShowChatWindow(true); // Update state to show chat window
        fetchChatData(); // Fetch messages immediately after creating the ticket
      } else {
        console.error('Error creating ticket:', createTicketResponse.data);
      }
    } catch (error) {
      console.error('Error creating ticket:', error.message);
    }
  };
  
  
  const handleSendMsg = async () => {
    setLoadSpin(true);

    const mid = user_Info?.mid;
    const newMessage = {
      tid: mid,
      uid: mid,
      msg: message,
      role: 'user',
      date: `${formatDate(new Date())}`,
      time: formatTime(new Date()),
    };

    try {
      // Send new message
      const response = await axios.post(
        'https://apis.devcorps.in/replyticket',
        newMessage,
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': '90bd6f5b-033f-42e7-8e92-2a443dfa42f8',
          },
        }
      );

      if (response.data.success) {
        setChats((prevChats) => [...prevChats, newMessage]);
        setMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error.message);
    }

    setLoadSpin(false);
  };

  const getCurrentTime = () => {
    const currentDate = new Date();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatTime = (date) => {
    const inputDate = new Date(date);
    
    // if (isNaN(inputDate.getTime())) {
    //   console.error('Invalid date:', date);
    //   return 'Invalid Damhjhgvhbte';
    // }
  
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
  
    const formattedDate = `${monthNames[inputDate.getMonth()]} ${inputDate.getDate()}, ${inputDate.getFullYear()}`;
    const formattedTime = `${(inputDate.getHours() < 10 ? '0' : '') + inputDate.getHours()}:${(inputDate.getMinutes() < 10 ? '0' : '') + inputDate.getMinutes()}:${(inputDate.getSeconds() < 10 ? '0' : '') + inputDate.getSeconds()}`;
  
    return ` ${formattedTime}`;
  };

  const formatDate = (date) => {
    const inputDate = new Date(date);
    
    // if (isNaN(inputDate.getTime())) {
    //   console.error('Invalid date:', date);
    //   return 'Invalid Date';
    // }
  
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
  
    const formattedDate = `${monthNames[inputDate.getMonth()]} ${inputDate.getDate()}, ${inputDate.getFullYear()}`;
    const formattedTime = `${(inputDate.getHours() < 10 ? '0' : '') + inputDate.getHours()}:${(inputDate.getMinutes() < 10 ? '0' : '') + inputDate.getMinutes()}:${(inputDate.getSeconds() < 10 ? '0' : '') + inputDate.getSeconds()}`;
  
    return `${formattedDate}`;
  };
  
  
  

  return (
    <View style={styles.container}>
      {creatingTicket ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.sub}
            placeholder="Subject"
            placeholderTextColor={Colors.Gray}
            value={subject}
            onChangeText={(text) => setSubject(text)}
          />
          <TextInput
            style={styles.message}
            placeholder="Your message"
            placeholderTextColor={Colors.Gray}
            multiline
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
          <TouchableOpacity style={styles.sendButton} onPress={createTicket}>
            <Text style={styles.sendButtonText}>Start Chat</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {showChatWindow && ( // Show chat window only when showChatWindow is true
            <FlatList
              data={chats}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View>
                  {/* {index === 0 || formatDate(item.date) !== formatDate(chats[index - 1].date) ? (
                    <View style={styles.dateHeader}>
                      <Text style={styles.dateHeaderText}>{item.date}</Text>
                    </View>
                  ) : null} */}
                  <View style={styles.messageContainer}>
                    <View style={styles.messageBackground}>
                      <Text style={[styles.messageText, item.role === 'user' ? styles.userMessage : styles.otherMessage]}>
                        {item.msg}
                      </Text>
                    </View>
                    <Text style={[styles.timestampText, { textAlign: item.role === 'user' ? 'right' : 'left' }]}>
                      {item.time}
                    </Text>
                  </View>
                </View>
              )}
            />
          )}

          {/* Input container for sending new messages */}
          <View style={styles.inputContainer1}>
            <TextInput
              style={styles.input1}
              placeholder="Type your message..."
              placeholderTextColor={'#000'}
              value={message}
              onChangeText={(text) => setMessage(text)}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMsg}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    padding: 10,
    borderBottomColor: '#ddd',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  messageBackground: {
    backgroundColor: '#EBEBEB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    maxWidth: '80%',  
    alignSelf: 'flex-end', 
  },
  timestampText: {
    fontSize: 12,
    color: '#888',
  },
  inputContainer: {
    justifyContent: 'center',
    padding: 10,
  },
  sub: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#000',
    backgroundColor: '#FFFFFF',
  },
  message: {
    height: 80,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#000',
    backgroundColor: '#FFFFFF',
  },
  sendButton: {
    backgroundColor: Colors.Black,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  userMessage: {
    textAlign: 'right',
  },
  otherMessage: {
    textAlign: 'left',
  },
  inputContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input1: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    color: '#000',
  },
  timestampText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right', 
  },
  dateHeader: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
});

export default SupportScreen;