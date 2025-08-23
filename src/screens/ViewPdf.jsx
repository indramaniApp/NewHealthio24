import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, StatusBar } from 'react-native';
import WebView from 'react-native-webview';
import Header from '../../components/Header';

const ViewPdf = ({ route, navigation }) => {
  const { pdfUrl } = route.params || {};  

  
  if (!pdfUrl) {
    return <Text style={styles.errorText}>No PDF found</Text>;
  }

  // Google Docs viewer URL to view the PDF
  const googleViewerUrl = `https://docs.google.com/gview?embedded=true&url=${pdfUrl}`;

  // Function to handle downloading the PDF
  const handleDownload = () => {
    Linking.openURL(pdfUrl);  
  };

  return (
    <>
    <Header title={'View Pdf'}
            onBackPress={() => navigation.goBack()}

    />
    <View style={styles.container}>  
     

      <StatusBar barStyle="light-content" hidden={true} />
      
      <WebView
        source={{ uri: googleViewerUrl }}  
        style={styles.webView}  
        startInLoadingState={true}  
        javaScriptEnabled={true}  
        domStorageEnabled={true}  
        originWhitelist={['*']}  
        />
    

      <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
        <Text style={styles.downloadText}>Download PDF</Text>
      </TouchableOpacity>
    </View>
        </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    backgroundColor: '#fff', 
  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#4a90e2', 
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 34,
    color: '#fff',
    fontWeight:'bold'
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  webView: {
    flex: 1,  
  },
  downloadBtn: {
    backgroundColor: '#4a90e2',  
    paddingVertical: 12,  
    alignItems: 'center',  
    position: 'absolute',  
    bottom: 20,  
    left: '50%',  
    transform: [{ translateX: -75 }],  
    width: 150,  
    borderRadius: 8,  
  },
  downloadText: {
    color: '#fff',  
    fontSize: 16,  
    fontWeight: '600',  
  },
  errorText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 18,
    color: '#ff0000',  
  },
});

export default ViewPdf;
