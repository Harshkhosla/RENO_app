import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import ProjectShowCaseCard from './ProjectShowCaseCard';
import RoutePaths from '../Navigations/RoutePaths';

const CategoryPage = ({ navigation, route }) => {
  const { categories = [] } = route.params;
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [projects, setProjects] = useState([]);

  const _handleButtonClick = (item, routePath) => {
    navigation.navigate(routePath, { item: item });
  };
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text onPress={() => navigation.goBack()}>Close</Text>
      ),
    });
    // Fetch projects for 'All' category
    handleCategoryPress('All');
  }, [navigation]);

  const handleCategoryPress = async (categoryId) => {
    let projectsForCategory = [];
    if (categoryId === 'All') {
      // Fetch all projects for 'All' category
      try {
        const response = await fetch('https://apis.devcorps.in/getAllProjects_sm', {
          method: 'GET',
          headers: {
            'api-key': '90bd6f5b-033f-42e7-8e92-2a443dfa42f8',
          },
        });
        const result = await response.json();
        if (result.success) {
          projectsForCategory = result?.projects;
        } else {
          console.error('Failed to fetch projects');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    } else {
      // Fetch projects for the selected category
      try {
        const response = await fetch('https://apis.devcorps.in/getAllProjects_sm', {
          method: 'GET',
          headers: {
            'api-key': '90bd6f5b-033f-42e7-8e92-2a443dfa42f8',
          },
        });
        const result = await response.json();
        if (result.success) {
          projectsForCategory = result?.projects.filter(project => project.category === categoryId);
        } else {
          console.error('Failed to fetch projects');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }

    setProjects(projectsForCategory);
    setSelectedCategory(categoryId);
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
          {[{ cid: 'All', ctg_name: 'All', ctg_photo: 'https://files.devcorps.in/95c5043c-56de-42e2-b861-87ff36454524-removebg-preview.png' }, ...categories].map((category) => (
            <TouchableOpacity
              key={category.cid}
              style={[styles.card, selectedCategory === category.cid && styles.selectedCard]}
              onPress={() => handleCategoryPress(category.cid)}
            >
              <Image source={{ uri: category.ctg_photo }} style={[styles.image, selectedCategory === category.cid && styles.selectedImage]} />
              <Text style={styles.categoryName}>{category.ctg_name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>




      {selectedCategory && (
        <ScrollView style={styles.projectsContainer} showsVerticalScrollIndicator={false}>
          {projects.map((project) => (
            <ProjectShowCaseCard key={project.pid} data={project}  onPress={() => _handleButtonClick(project, RoutePaths.ShowCaseDetails)} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  scrollContainer: {
    alignItems: 'center',
  },
  card: {
    marginTop: 10,
    marginRight: 18,
    alignItems: 'center',
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 60,
  },
  selectedImage: {
    borderColor: '#8FC743',
    borderWidth: 2,
    borderRadius: 28, // Adjusted to accommodate the border
  },
  categoryName: {
    marginTop: 5,
    color: '#000',
  },
  projectsContainer: {
    flex: 1,
    marginTop: 5,
    paddingHorizontal: 10,
  },
});

export default CategoryPage;
