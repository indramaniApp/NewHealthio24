import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PageContainer from '../components/PageContainer';
import DotsView from '../components/DotsView';
import Button from '../components/Button';
import Onboarding1Styles from '../styles/OnboardingStyles';
import { COLORS, images } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
// 1. Import LinearGradient
import LinearGradient from 'react-native-linear-gradient';

const Onboarding4 = ({ navigation }) => {
    const [progress, setProgress] = useState(0);
    const { colors } = useTheme();

    useEffect(() => {
        const intervalId = setInterval(() => {
            setProgress(prevProgress => {
                if (prevProgress >= 1) {
                    clearInterval(intervalId);
                    return prevProgress;
                }
                return prevProgress + 0.5;
            });
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        // 2. Wrap the entire screen in the LinearGradient component
        <LinearGradient
            colors={['#00b4db', '#fff','#fff']} // Added gradient colors like in Home.js
            style={{ flex: 1 }}
        >
            {/* 3. Make the SafeAreaView background transparent */}
            <SafeAreaView style={[Onboarding1Styles.container, {
                backgroundColor: 'transparent'
            }]}>
                <PageContainer>
                    <View style={Onboarding1Styles.contentContainer}>
                        <Image
                            source={images.doctor3}
                            resizeMode="contain"
                            style={Onboarding1Styles.illustration}
                        />
                        <Image
                            source={images.ornament}
                            resizeMode="contain"
                            style={Onboarding1Styles.ornament}
                        />
                        {/* 4. Also make this container's background transparent */}
                        <View style={[Onboarding1Styles.buttonContainer, {
                            backgroundColor: 'transparent',
                        }]}>
                            <View style={Onboarding1Styles.titleContainer}>
                                <Text style={[Onboarding1Styles.title, { color: colors.text }]}>Ready to Start Your Health</Text>
                                <Text style={Onboarding1Styles.subTitle}>JOURNEY?</Text>
                            </View>

                            <Text style={[Onboarding1Styles.description, { color: colors.text }]}>
                                Sign up now to begin exploring the world of healthcare options, and take the first step towards a healthier you.
                            </Text>

                            <View style={Onboarding1Styles.dotsContainer}>
                                {progress < 1 && <DotsView progress={progress} numDots={4} />}
                            </View>
                            
                            <View style={styles.buttonWrapper}>
                                <Button
                                    title="Next"
                                    filled
                                    onPress={() => navigation.navigate('Login')}
                                    style={Onboarding1Styles.nextButton}
                                />
                                <Button
                                    title="Skip"
                                    onPress={() => navigation.navigate('Login')}
                                    textColor={COLORS.white}
                                    style={Onboarding1Styles.skipButton}
                                />
                            </View>
                        </View>
                    </View>
                </PageContainer>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default Onboarding4;

const styles = StyleSheet.create({
    buttonWrapper: {
        position: 'absolute',
        bottom: 10,
        // Assuming you want the buttons to span the width like in previous screens
        left: 20,
        right: 20,
    },
});