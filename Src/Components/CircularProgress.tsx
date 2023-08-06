import React from 'react';
import { View, Text } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';

interface CircularProgressProps {
  totalWalk: number;
  maxValue: number;
  circleSize: number;
  strokeWidth: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  totalWalk,
  maxValue,
  circleSize,
  strokeWidth,
}) => {
  const progress = useSharedValue((totalWalk / maxValue) * 100);

  const radius = circleSize / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (progress.value / 100) * circumference,
  }));

  React.useEffect(() => {
    progress.value = withTiming((totalWalk / maxValue) * 100);
  }, [totalWalk, maxValue]);

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={circleSize} height={circleSize}>
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          fill="transparent"
          stroke="#e6e6e6"
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          fill="transparent"
          stroke="#ff6600"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={{ marginTop: 10 }}>
        {totalWalk} / {maxValue}
      </Text>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default CircularProgress;
