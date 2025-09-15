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

const Onboarding3 = ({ navigation }) => {
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
                            source={images.doctor2}
                            resizeMode="contain"
                            style={Onboarding1Styles.illustration}
                        />
                        <Image
                            source={images.ornament}
                            resizeMode="contain"
                            style={Onboarding1Styles.ornament}
                        />
                        <View style={[Onboarding1Styles.buttonContainer, { paddingBottom: 30 }]}>
                            <View style={Onboarding1Styles.titleContainer}>
                                <Text style={[Onboarding1Styles.title, { color: colors.text }]}>Find and Book Your Ideal</Text>
                                <Text style={Onboarding1Styles.subTitle}>MEDICAL EXPERT</Text>
                            </View>

                            <Text style={[Onboarding1Styles.description, { color: colors.text }]}>
                                Find the best doctor near you with just one of the best apps.
                            </Text>

                            <View style={Onboarding1Styles.dotsContainer}>
                                {progress < 1 && <DotsView progress={progress} numDots={4} />}
                            </View>

                            <View style={styles.buttonWrapper}>
                                <Button
                                    title="Next"
                                    filled
                                    onPress={() => navigation.navigate('Onboarding4')}
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

const styles = StyleSheet.create({
    buttonWrapper: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
    },
});

export default Onboarding3;