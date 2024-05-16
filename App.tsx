// Import các thành phần cần thiết từ thư viện React và React Native
import React, { useState } from 'react';
import { View, Animated, PanResponder, FlatList, SafeAreaView, Text, StyleSheet } from 'react-native';

// Định nghĩa kiểu dữ liệu cho một mục trong danh sách
interface Item {
  id: string;
  title: string;
}

// Component chính của ứng dụng
const App = () => {
  // Khởi tạo state để lưu trữ danh sách các mục
  const [data, setData] = useState<Item[]>([
    { id: '1', title: 'Item 1' },
    { id: '2', title: 'Item 2' },
    { id: '3', title: 'Item 3' },
    { id: '4', title: 'Item 4' },
    { id: '5', title: 'Item 5' },
  ]);

  // Render mỗi mục trong danh sách
  const renderItem = ({ item, index }: { item: Item; index: number }) => {
    return <DraggableItem item={item} index={index} />;
  };

  // Component cho mỗi mục có thể kéo thả
  const DraggableItem = ({ item, index }: { item: Item; index: number }) => {
    // Khởi tạo giá trị state để theo dõi vị trí của mục khi kéo thả
    const pan = useState(new Animated.ValueXY())[0];

    // Tạo PanResponder để xử lý sự kiện kéo thả
    const panResponder = useState(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          pan.setOffset({
            x: pan.x._value,
            y: pan.y._value,
          });
          pan.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: (evt, gestureState) => {
          console.log("dy:", gestureState.dy);
          Animated.event(
            [null, { dx: pan.x, dy: pan.y }],
            { useNativeDriver: false }
          )(evt, gestureState);
        },

        onPanResponderRelease: (_, gestureState) => {
          // Tính toán vị trí mới cho mục khi kéo thả kết thúc
          const newPosition = calculateNewPosition(gestureState, index);
          // Nếu vị trí mới khác vị trí hiện tại, cập nhật danh sách dữ liệu
          if (newPosition !== index) {
            const newData = [...data]; // Tạo bản sao của mảng dữ liệu
            const tempItem = newData[index]; // Lưu trữ giá trị của phần tử tại index
            newData[index] = newData[newPosition]; // Thay đổi vị trí của phần tử tại index
            newData[newPosition] = tempItem; // Thay đổi vị trí của phần tử tại newPosition
            setData(newData); // Cập nhật state với mảng đã được cập nhật
          } else {
            // Nếu vị trí mới bằng với vị trí ban đầu, thực hiện hiệu ứng nhảy trở lại vị trí ban đầu
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

    // Trả về một Animated.View để hiển thị mục có thể kéo thả
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

  // Tính toán vị trí mới cho mục khi kéo thả
  const calculateNewPosition = (gestureState: any, index: number) => {
    console.log("dy:", gestureState.dy);
    console.log("index:", index);
    if (gestureState.dy > 0) {
      return Math.abs(Math.round(gestureState.dy / 100)) + index;
    } else {
      return Math.abs(Math.abs(Math.round(gestureState.dy / 100)) - index);
    }
  };

  // Render danh sách các mục trong một FlatList
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onScroll={() => {
            // Logic for dragging
          }}
          scrollEnabled={true}
          contentContainerStyle={{ paddingVertical: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

// Khai báo các kiểu dữ liệu và các styles cho ứng dụng
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

// Xuất App ra ngoài để sử dụng
export default App;
