import React from 'react';
import {hp, viewportWidth, wp} from '@/utils/index';
import SnapCarousel, {
  ParallaxImage,
  AdditionalParallaxProps,
  Pagination,
} from 'react-native-snap-carousel';
import {StyleSheet, View} from 'react-native';
import {ICarousel} from '@/models/home';

const sliderWidth = viewportWidth;
const sidewidth = wp(90);
const sideHeight = hp(26);
const itemWidth = sidewidth + wp(2) * 2;

interface IProps {
  data: ICarousel[];
}

class Carousel extends React.Component<IProps> {
  state = {
    activeSlide: 0,
  };
  onSnapToItem = (index: number) => {
    this.setState({
      activeSlide: index,
    });
  };
  renderItem = (
    {item}: {item: ICarousel},
    parallaxProps?: AdditionalParallaxProps,
  ) => (
    <ParallaxImage
      source={{uri: item.image}}
      style={styles.image}
      containerStyle={styles.imageContainer}
      {...parallaxProps}
      parallaxFactor={0.8}
      spinnerColor="rgba(0,0,0,0.25)"
    />
  );

  get pagination() {
    const {data} = this.props;
    const {activeSlide} = this.state;
    return (
      <View style={styles.paginationWrapper}>
        <Pagination
          containerStyle={styles.paginationContainer}
          dotsLength={data.length}
          activeDotIndex={activeSlide}
          dotContainerStyle={styles.dotContainer}
          dotStyle={styles.dot}
          inactiveDotScale={0.7}
          inactiveDotOpacity={0.4}
        />
      </View>
    );
  }

  render() {
    const {data} = this.props;
    return (
      <View>
        <SnapCarousel
          data={data}
          renderItem={this.renderItem}
          itemWidth={itemWidth}
          sliderWidth={sliderWidth}
          hasParallaxImages
          loop
          autoplay
          onSnapToItem={this.onSnapToItem}
        />
        {this.pagination}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    width: itemWidth,
    height: sideHeight,
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  paginationWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    top: -20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 3,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dotContainer: {
    marginHorizontal: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
});

export default Carousel;
