// Test the clustering API
const testData = {
  data_points: [
    "I love hiking and outdoor adventures",
    "I enjoy reading books and quiet evenings",
    "Mountain climbing is my passion",
    "I prefer staying home with a good novel",
    "Rock climbing and camping are my hobbies",
    "Libraries and coffee shops are my favorite places",
    "I dream of climbing Everest someday",
    "Poetry and literature inspire me"
  ],
  num_clusters: 2
};

console.log('Testing clustering API...');
console.log('Input data:', JSON.stringify(testData, null, 2));
