import React, { useState } from 'react';
import { View, Vibration, Animated, PanResponder, FlatList, SafeAreaView, Text, StyleSheet } from 'react-native';

interface Item {
  id: string;
  title: string;
}

const App = () => {
  const [data, setData] = useState<Item[]>([
    { id: '1', title: 'Item 1' },
    { id: '2', title: 'Item 2' },
    { id: '3', title: 'Item 3' },
    { id: '4', title: 'Item 4' },
    { id: '5', title: 'Item 5' },
  ]);
  const sizeHeight = 110;

  const renderItem = ({ item, index }: { item: Item; index: number }) => {
    return <DraggableItem item={item} index={index} />;
  };

  const DraggableItem = ({ item, index }: { item: Item; index: number }) => {
    const pan = useState<any>(new Animated.ValueXY())[0];
    const panResponder = useState(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          Vibration.vibrate([10, 10], false);
          pan.setOffset({
            x: pan.x._value,
            y: pan.y._value,
          });
          pan.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: (evt, gestureState) => {
          Animated.event(
            [null, { dx: pan.x, dy: pan.y }],
            { useNativeDriver: false }
          )(evt, gestureState);
        },

        onPanResponderRelease: (_, gestureState) => {
          const newPosition = calculateNewPosition(gestureState, index,sizeHeight);
          if (newPosition !== index && newPosition <= data.length) {
            const newData = [...data];
            const tempItem = newData[index];
            newData[index] = newData[newPosition];
            newData[newPosition] = tempItem;
            setData(newData);
          } else {
            Animated.spring(
              pan,
              {
                toValue: { x: 0, y: 0 },
                useNativeDriver: false
              }
            ).start();
          }
          pan.flattenOffset();
        },

      })
    )[0];

    return (
      <Animated.View
        style={[
          pan.getLayout(),
          styles.itemContainer,
        ]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.text}>{item.title}</Text>
      </Animated.View>
    );
  };

  const calculateNewPosition = (gestureState: any, index: number, sizeHeight: number) => {
    const dy = gestureState.dy;
    const sizeData = data.length;
    const dropAt = Math.round(dy / sizeHeight) + index;
    if (dropAt < 0 || dropAt > sizeData) {
      return index;
    }

    return dropAt;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 70 }}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
          contentContainerStyle={{ paddingVertical: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: 100,
    height: 100,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  text: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default App;
