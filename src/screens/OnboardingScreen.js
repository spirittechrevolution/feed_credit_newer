import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import COLORS from '../utils/colors';
import ButtonPrimary from '../components/ButtonPrimary';

const slides = [
  {
    id: '1',
    emoji: '🛒',
    title: 'Achetez vos produits frais',
    description:
      'Accédez à des viandes, poissons et volailles frais directement auprès de producteurs locaux.',
  },
  {
    id: '2',
    emoji: '💳',
    title: 'Payez à crédit',
    description:
      'Plus besoin de payer tout d\'avance. Étalez vos paiements selon votre convenance.',
  },
  {
    id: '3',
    emoji: '👥',
    title: 'Achat groupé',
    description:
      'Rejoignez des groupes d\'achat pour bénéficier des meilleurs prix et de livraisons gratuites.',
  },
];

/**
 * OnboardingScreen — 3 slides horizontales avec pagination et bouton COMMENCER
 */
const OnboardingScreen = ({navigation}) => {
  const {width} = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const handleNext = () => {
    const nextIndex = activeIndex + 1;
    if (nextIndex < slides.length) {
      flatListRef.current?.scrollToOffset({
        offset: width * nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    } else {
      navigation.replace('Login');
    }
  };

  const renderSlide = ({item}) => (
    <View style={[styles.slide, {width}]}>
      <View style={styles.emojiCircle}>
        <Text style={styles.emoji}>{item.emoji}</Text>
      </View>
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      {/* Bouton Passer */}
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={() => navigation.replace('Login')}>
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
      />

      {/* Pagination dots */}
      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>

      {/* Bouton d'action */}
      <View style={styles.footer}>
        <ButtonPrimary
          title={activeIndex === slides.length - 1 ? 'COMMENCER' : 'SUIVANT'}
          onPress={handleNext}
          style={styles.btn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  skipBtn: {
    alignSelf: 'flex-end',
    padding: 16,
  },
  skipText: {
    color: COLORS.grey,
    fontSize: 14,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  emojiCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 64,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  slideDescription: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  btn: {
    width: '100%',
  },
});

export default OnboardingScreen;
