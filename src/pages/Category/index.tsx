import {ICategory} from '@/models/category';
import {RootState} from '@/models/index';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import _, {isElement} from 'lodash';
import {ScrollView} from 'react-native-gesture-handler';
import Item, {itemHeight, itemWidth, margin, parentWidth} from './Item';
import {RootStackNavigation} from '@/navigator/index';
import HeaderRightBtn from './HeaderRightBtn';
import Touchable from '@/components/Touchable';
import {DragSortableView} from 'react-native-drag-sort';

const mapStateToProps = ({category}: RootState) => {
  return {
    myCategorys: category.myCategorys,
    categorys: category.categorys,
    isEdit: category.isEdit,
  };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {
  navigation: RootStackNavigation;
}

interface IState {
  myCategorys: ICategory[];
}

const fixedItems = [0, 1];

class Category extends React.Component<IProps, IState> {
  state = {
    myCategorys: this.props.myCategorys,
  };
  constructor(props: IProps) {
    super(props);
    props.navigation.setOptions({
      headerRight: () => <HeaderRightBtn onSubmit={this.onSubmit} />,
    });
  }
  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'category/setState',
      payload: {
        isEdit: false,
      },
    });
  }
  onSubmit = () => {
    const {dispatch, navigation, isEdit} = this.props;
    const {myCategorys} = this.state;
    dispatch({
      type: 'category/toggle',
      payload: {
        myCategorys,
      },
    });
    if (isEdit) {
      navigation.goBack();
    }
  };
  // 长按事件
  onLongPress = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'category/setState',
      payload: {
        isEdit: true,
      },
    });
  };
  onPress = (item: ICategory, index: number, selected: boolean) => {
    const {isEdit} = this.props;
    const {myCategorys} = this.state;
    const disabled = fixedItems.indexOf(index) > -1;

    if (isEdit) {
      if (selected) {
        if (disabled) {
          return;
        }
        this.setState({
          myCategorys: myCategorys.filter(
            (selectedItem) => selectedItem.id !== item.id,
          ),
        });
      } else {
        this.setState({
          myCategorys: myCategorys.concat([item]),
        });
      }
    }
  };
  renderItem = (item: ICategory, index: number) => {
    const {isEdit} = this.props;
    const disabled = fixedItems.indexOf(index) > -1;
    return <Item data={item} isEdit={isEdit} selected disabled={disabled} />;
  };
  renderUnSelectedItem = (item: ICategory, index: number) => {
    const {isEdit} = this.props;
    return (
      <Touchable
        key={item.id}
        onLongPress={this.onLongPress}
        onPress={() => this.onPress(item, index, false)}>
        <Item data={item} isEdit={isEdit} selected={false} />
      </Touchable>
    );
  };
  // 拖拽回调
  onDataChange = (data: ICategory[]) => {
    this.setState({
      myCategorys: data,
    });
  };
  onClickItem = (data: ICategory[], item: ICategory) => {
    this.onPress(item, data.indexOf(item), true);
  };
  render() {
    const {categorys, isEdit} = this.props;
    const {myCategorys} = this.state;
    const classifyGroup = _.groupBy(categorys, (item) => item.classify);
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.classifyName}>我的分类</Text>
        <View style={styles.classifyView}>
          <DragSortableView
            dataSource={myCategorys}
            renderItem={this.renderItem}
            sortable={isEdit}
            fixedItems={fixedItems}
            keyExtractor={(item) => item.id}
            onDataChange={this.onDataChange}
            parentWidth={parentWidth}
            childrenWidth={itemWidth}
            childrenHeight={itemHeight}
            marginChildrenTop={margin}
            onClickItem={this.onClickItem}
          />
        </View>
        <View>
          {Object.keys(classifyGroup).map((classify) => {
            return (
              <View key={classify}>
                <Text style={styles.classifyName}>{classify}</Text>
                <View style={styles.classifyView}>
                  {classifyGroup[classify].map((item, index) => {
                    if (
                      myCategorys.find(
                        (selectedItem) => item.id === selectedItem.id,
                      )
                    ) {
                      return null;
                    }
                    return this.renderUnSelectedItem(item, index);
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6f6',
  },
  classifyName: {
    fontSize: 16,
    marginTop: 14,
    marginBottom: 8,
    marginLeft: 10,
  },
  classifyView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
  },
});

export default connector(Category);
