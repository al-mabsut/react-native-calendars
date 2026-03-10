import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import CalendarList from '../index';

let mockScrollToOffset;
let latestFlatListProps;

// Deterministic seam: mock the FlatList implementation itself (not the whole 'react-native' module).
// This avoids pulling in RN "actual" modules (TurboModules) while still capturing imperative scroll calls.
jest.mock('react-native/Libraries/Lists/FlatList', () => {
  const MockReact = require('react');

  mockScrollToOffset = jest.fn();

  const FlatList = MockReact.forwardRef((_props, ref) => {
    latestFlatListProps = _props;
    MockReact.useImperativeHandle(ref, () => ({
      scrollToOffset: mockScrollToOffset
    }));
    return null;
  });
  FlatList.displayName = 'FlatList';

  return FlatList;
});

describe('CalendarList offset math regression', () => {
  beforeEach(() => {
    // Ensure the FlatList module mock factory runs (it initializes `mockScrollToOffset`).
    if (!mockScrollToOffset) {
      require('react-native/Libraries/Lists/FlatList');
    }
    mockScrollToOffset.mockClear();
    latestFlatListProps = undefined;
  });

  it('mount: should scroll using full item length (calendarHeight + itemLayoutOffset)', async () => {
    render(
      <CalendarList
        testID="regression.calendarList"
        current="2025-12-01"
        pastScrollRange={48}
        futureScrollRange={0}
        calendarHeight={300}
        itemLayoutOffset={12}
      />
    );

    await waitFor(() => {
      expect(mockScrollToOffset).toHaveBeenCalledTimes(1);
    });

    // Expected correct behavior: use full item size from getItemLayout()
    // (this assertion is intentionally red until the production bug is fixed)
    expect(mockScrollToOffset).toHaveBeenCalledWith({offset: 48 * (300 + 12), animated: false});
  });

  it('update: should scroll using full item length when current changes', async () => {
    const {rerender} = render(
      <CalendarList
        testID="regression.calendarList"
        current="2025-12-01"
        pastScrollRange={48}
        futureScrollRange={0}
        calendarHeight={300}
        itemLayoutOffset={12}
      />
    );

    await waitFor(() => {
      expect(mockScrollToOffset).toHaveBeenCalledTimes(1);
    });

    rerender(
      <CalendarList
        testID="regression.calendarList"
        current="2026-03-01"
        pastScrollRange={48}
        futureScrollRange={0}
        calendarHeight={300}
        itemLayoutOffset={12}
      />
    );

    await waitFor(() => {
      expect(mockScrollToOffset).toHaveBeenCalledTimes(2);
    });

    // Expected correct behavior: month index is pastScrollRange + 3
    // (this assertion is intentionally red until the production bug is fixed)
    expect(mockScrollToOffset.mock.calls[1][0]).toEqual({offset: 51 * (300 + 12), animated: false});
  });

  it('control: with itemLayoutOffset=0, legacy month math matches calendarHeight', async () => {
    render(
      <CalendarList
        testID="regression.calendarList"
        current="2025-12-01"
        pastScrollRange={48}
        futureScrollRange={0}
        calendarHeight={300}
        itemLayoutOffset={0}
      />
    );

    await waitFor(() => {
      expect(mockScrollToOffset).toHaveBeenCalledTimes(1);
    });

    expect(mockScrollToOffset).toHaveBeenCalledWith({offset: 48 * 300, animated: false});
  });

  it('snapToInterval: uses full list item size (vertical)', () => {
    render(
      <CalendarList
        testID="regression.calendarList"
        current="2025-12-01"
        pastScrollRange={1}
        futureScrollRange={0}
        calendarHeight={300}
        itemLayoutOffset={12}
        numberOfItemsInSnapToInterval={2}
      />
    );

    expect(latestFlatListProps.snapToInterval).toBe((300 + 12) * 2);
  });

  it('snapToInterval: uses full list item size (horizontal)', () => {
    render(
      <CalendarList
        testID="regression.calendarList"
        horizontal
        current="2025-12-01"
        pastScrollRange={1}
        futureScrollRange={0}
        calendarWidth={400}
        calendarHeight={123} // irrelevant for horizontal sizing, but passed through
        itemLayoutOffset={10}
        numberOfItemsInSnapToInterval={3}
      />
    );

    expect(latestFlatListProps.snapToInterval).toBe((400 + 10) * 3);
  });

  it('renderItem closure: updates calendarHeight between renders', () => {
    const {rerender} = render(
      <CalendarList
        testID="regression.calendarList"
        current="2025-12-01"
        pastScrollRange={1}
        futureScrollRange={0}
        calendarHeight={300}
      />
    );

    const firstItemElement = latestFlatListProps.renderItem({item: latestFlatListProps.data[0]});
    expect(firstItemElement.props.calendarHeight).toBe(300);

    rerender(
      <CalendarList
        testID="regression.calendarList"
        current="2025-12-01"
        pastScrollRange={1}
        futureScrollRange={0}
        calendarHeight={320}
      />
    );

    const updatedFirstItemElement = latestFlatListProps.renderItem({item: latestFlatListProps.data[0]});
    expect(updatedFirstItemElement.props.calendarHeight).toBe(320);
  });
});
