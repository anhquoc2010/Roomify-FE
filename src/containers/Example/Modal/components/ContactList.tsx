/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useMemo, useCallback } from 'react';
import { StyleSheet, Platform, View, ViewStyle } from 'react-native';
import { Text } from '@components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  BottomSheetFlatList,
  BottomSheetScrollView,
  BottomSheetSectionList,
  BottomSheetVirtualizedList,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {
  createContactListMockData,
  createContactSectionsMockData,
} from '../utilities';
import ContactItem from './ContactItem';

export interface ContactListProps {
  type: 'FlatList' | 'SectionList' | 'ScrollView' | 'View' | 'VirtualizedList';
  count?: number;
  style?: ViewStyle;
  onItemPress?: () => void;
  onRefresh?: () => void;
}

const keyExtractor = (item: any, index: number) => `${item.name}.${index}`;
const handleGetItem = (data: any[], index: number) => data[index];
const handleGetCount = (data: any[]) => data.length;

const ContactList = ({
  type,
  count = 25,
  style,
  onRefresh,
  onItemPress,
  ...rest
}: ContactListProps) => {
  // hooks
  const { bottom: bottomSafeArea } = useSafeAreaInsets();

  // #region variables
  const sections = useMemo(() => createContactSectionsMockData(count), [count]);
  const data = useMemo(() => createContactListMockData(count), [count]);
  // #endregion

  // styles
  const contentContainerStyle = useMemo(
    () => ({
      ...styles.contentContainer,
      ...style,
      paddingBottom: bottomSafeArea,
    }),
    [style, bottomSafeArea]
  );

  // renders
  const renderFlatListItem = useCallback(
    ({ item, index }) => (
      <ContactItem
        key={`${type}.${item.name}.${index}`}
        title={`${index}: ${item.name}`}
        subTitle={item.jobTitle}
        onPress={onItemPress}
      />
    ),
    [type, onItemPress]
  );
  const renderSectionItem = useCallback(
    ({ item, index }) => (
      <ContactItem
        key={`${type}.${item.name}.${index}`}
        title={`${index}: ${item.name}`}
        subTitle={item.jobTitle}
        onPress={onItemPress}
      />
    ),
    [type, onItemPress]
  );
  const renderScrollViewItem = useCallback(
    (item, index) => (
      <ContactItem
        key={`${type}.${item.name}.${index}`}
        title={`${index}: ${item.name}`}
        subTitle={item.jobTitle}
        onPress={onItemPress}
      />
    ),
    [type, onItemPress]
  );
  const renderSectionHeader = useCallback(
    ({ section }) => (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderTitle}>{section.title}</Text>
      </View>
    ),
    []
  );

  if (type === 'FlatList') {
    return (
      <BottomSheetFlatList
        data={data}
        refreshing={false}
        onRefresh={onRefresh}
        keyExtractor={keyExtractor}
        initialNumToRender={5}
        bounces
        windowSize={10}
        maxToRenderPerBatch={5}
        renderItem={renderFlatListItem}
        style={styles.container}
        keyboardDismissMode="interactive"
        contentContainerStyle={contentContainerStyle}
        focusHook={useFocusEffect}
      />
    );
  } if (type === 'VirtualizedList') {
    return (
      <BottomSheetVirtualizedList
        data={data}
        keyExtractor={keyExtractor}
        initialNumToRender={5}
        getItem={handleGetItem}
        getItemCount={handleGetCount}
        bounces
        windowSize={10}
        maxToRenderPerBatch={5}
        renderItem={renderFlatListItem}
        style={styles.container}
        keyboardDismissMode="interactive"
        contentContainerStyle={contentContainerStyle}
        focusHook={useFocusEffect}
      />
    );
  } if (type === 'ScrollView') {
    return (
      <BottomSheetScrollView
        style={styles.container}
        contentContainerStyle={contentContainerStyle}
        bounces
        focusHook={useFocusEffect}
      >
        {data.map(renderScrollViewItem)}
      </BottomSheetScrollView>
    );
  } if (type === 'SectionList') {
    return (
      <BottomSheetSectionList
        style={styles.container}
        contentContainerStyle={contentContainerStyle}
        stickySectionHeadersEnabled
        initialNumToRender={5}
        windowSize={10}
        maxToRenderPerBatch={5}
        bounces
        sections={sections}
        keyExtractor={keyExtractor}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderSectionItem}
        focusHook={useFocusEffect}
        removeClippedSubviews={Platform.OS === 'android' && sections.length > 0}
      />
    );
  } if (type === 'View') {
    return (
      <BottomSheetView style={styles.contentContainer} {...rest}>
        {data.map(renderScrollViewItem)}
      </BottomSheetView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  sectionHeaderContainer: {
    padding: 10,
    backgroundColor: '#86939e',
    borderRadius: 10,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    textTransform: 'uppercase',
  },
  container: {
    overflow: 'visible',
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    overflow: 'visible',
  },
});

export default ContactList;
