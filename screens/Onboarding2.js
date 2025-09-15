import React, { useState, useEffect } from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PageContainer from '../components/PageContainer';
import DotsView from '../components/DotsView';
import Button from '../components/Button';
import Onboarding1Styles from '../styles/OnboardingStyles';
import { COLORS, images } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
// 1. Import LinearGradient
import LinearGradient from 'react-native-linear-gradient';

const Onboarding2 = ({ navigation }) => {
    const [progress, setProgress] = useState(0);
    const { colors } = useTheme();
    const scale = new Animated.Value(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 1) {
                    clearInterval(intervalId);
                    return prevProgress;
                }
                return prevProgress + 0.5;
            });
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        Animated.timing(scale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        // 2. Wrap the entire screen in the LinearGradient component
        <LinearGradient
            colors={['#00b4db', '#fff','#fff']} // Added gradient colors like in Home.js
            style={{ flex: 1 }}
        >
            {/* 3. Make the SafeAreaView background transparent so the gradient shows through */}
            <SafeAreaView style={[Onboarding1Styles.container, { backgroundColor: 'transparent' }]}>
                <PageContainer>
                    <View style={Onboarding1Styles.contentContainer}>
                        <Image
                            source={images.doctor1}
                            resizeMode="contain"
                            style={Onboarding1Styles.illustration}
                        />
                        <Image
                            source={images.ornament}
                            resizeMode="contain"
                            style={Onboarding1Styles.ornament}
                        />
                        <View style={[Onboarding1Styles.buttonContainer, { marginBottom: 10 }]}>
                            <View style={Onboarding1Styles.titleContainer}>
                                <Text style={[Onboarding1Styles.title, { color: colors.text }]}>Find Your Perfect</Text>
                                <Text style={Onboarding1Styles.subTitle}>MEDICAL CARE</Text>
                            </View>

                            <Text style={[Onboarding1Styles.description, { color: colors.text }]}>
                                We simplify the process of finding the ideal medical care or specialist in the healthcare industry.
                            </Text>

                            <View style={Onboarding1Styles.dotsContainer}>
                                {progress < 1 && <DotsView progress={progress} numDots={4} />}
                            </View>
                            
                            <Animated.View style={{ transform: [{ scale }] }}>
                                <Button
                                    title="Next"
                                    filled
                                    onPress={() => navigation.navigate('Onboarding3')}
                                    style={Onboarding1Styles.nextButton}
                                />
                                <Button
                                    title="Skip"
                                    onPress={() => navigation.navigate('Login')}
                                    textColor={COLORS.white}
                                    style={[Onboarding1Styles.skipButton, { marginTop: 10 }]}
                                />
                            </Animated.View>
                        </View>
                    </View>
                </PageContainer>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default Onboarding2;