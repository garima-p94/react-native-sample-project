import React, { useEffect, useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import {
  VictoryChart,
  VictoryLine,
  VictoryContainer,
  VictoryAxis,
} from 'victory-native';
import moment from 'moment';
import { isExist, isArray, numberFormatting } from '@helpers';
import { CustomText, Line } from '../UIComponents';
import { ObjectType } from '@types';
import { colors, wp } from '@styles';

const intervalArr: Array<ObjectType> = [
  // { label: '1D', type: 'daily', interval: '1' },
  {
    label: '1W',
    type: 'weekly',
    interval: '7',
  },
  {
    label: '1M',
    type: 'monthly',
    interval: '30',
  },
  {
    label: '3M',
    type: '3months',
  },
];

const axisStyle = {
  axis: { stroke: 'none' },
  tickLabels: { fill: colors.mediumGray, fontSize: 13.5 },
};
const chartPadding = {
  left: 50,
  right: 20,
  bottom: 50,
  top: 5,
};

export const CryptoChart = ({
  chartObj,
  tokenList,
  isPortfolio,
}: ObjectType) => {
  const [dataPoints, setDataPoints] = useState([]);
  const [domainValues, setDomainValues] = useState({});
  const [selectedInterval, setSelectedInterval] = useState<ObjectType>({});
  const [xTickValues, setXTickValues] = useState([]);
  const [intervalList, setIntervalList] = useState<Array<ObjectType>>([]);

  const filterGraphData = useCallback(
    (list, type) => {
      let values = [];
      if (isArray(list)) {
        if (isArray(tokenList)) {
          /* temp price override condtion */
          const totalTokensValue = tokenList.reduce((a, b) => {
            const tokens = isExist(b.user_number_of_tokens)
              ? parseFloat(b.user_number_of_tokens)
              : 0;
            const rate = isExist(b.exchange_rate)
              ? parseFloat(b.exchange_rate)
              : 0;
            const newValue = tokens * rate;
            return a + newValue;
          }, 0);

          values = list.map((item, index) => {
            let price = item.price ? parseFloat(item.price) : null;
            if (list.length - 1 === index) {
              price = totalTokensValue;
            }
            return { x: new Date(item.created_at), y: price };
          });
          /** ***** */
        } else {
          values = list.map((item) => ({
            x: new Date(item.created_at),
            y: item.price ? parseFloat(item.price) : null,
          }));
        }

        const result = values.reduce((a, b) => (a.y > b.y ? a : b), {});
        isExist(result.y) && setDomainValues({ y: [0, result.y * 2] });
        setDataPoints(values);
        let xValues = isArray(values) ? values.map((d) => d.x) : [];
        let divValue: number | null = null;
        if (type === 'monthly') {
          divValue = 7;
        } else if (type === 'weekly') {
          divValue = 2;
        } else if (type === '3months') {
          divValue = 22;
        } else if (type === 'daily') {
          divValue = 10;
        }
        xValues = xValues.filter((i: number) => {
          return divValue && i % divValue === 0;
        });
        setXTickValues(xValues);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tokenList, chartObj],
  );

  useEffect(() => {
    if (isExist(chartObj)) {
      let list = [...intervalArr];
      const defaultInterval = list.find((d) => d.type === 'monthly');
      if (defaultInterval) {
        setSelectedInterval(defaultInterval);
        filterGraphData(chartObj.monthly, defaultInterval.type);
      }
      if (isPortfolio) {
        list = list.filter((d) => d.type !== '3months' && d.type !== 'daily');
      }
      setIntervalList(list);
    }
  }, [chartObj, filterGraphData, isPortfolio]);

  const handleInterval = (item: ObjectType) => {
    setSelectedInterval(item);
    if (item.type === 'monthly') {
      filterGraphData(chartObj.monthly, item.type);
    } else if (item.type === 'weekly') {
      filterGraphData(chartObj.weekly, item.type);
    } else if (item.type === '3months') {
      filterGraphData(chartObj['3months'], item.type);
    } else if (item.type === 'daily') {
      filterGraphData(chartObj.today, item.type);
    }
  };

  const renderAxisLabel = (date: Date) => {
    if (isExist(date)) {
      return moment(date).format('MMM D');
    }
    return '';
  };

  if (isArray(dataPoints)) {
    return (
      <View>
        <View style={styles.intervals}>
          {intervalList.map((d) => (
            <TouchableOpacity
              onPress={() => handleInterval(d)}
              style={{ marginRight: 20 }}>
              <CustomText
                text={d.label}
                extraStyles={
                  selectedInterval.type === d.type && { color: colors.appBlue }
                }
              />
            </TouchableOpacity>
          ))}
        </View>
        <VictoryChart
          containerComponent={<VictoryContainer disableContainerEvents />}
          domain={domainValues}
          domainPadding={{ x: 15 }}
          width={wp(95)}
          padding={chartPadding}
          scale={{ x: 'time' }}>
          <VictoryAxis
            dependentAxis
            style={axisStyle}
            tickFormat={(t) => `$${numberFormatting(t)}`}
          />

          <VictoryLine
            style={{ data: { stroke: colors.appBlue } }}
            data={dataPoints}
          />
          <VictoryAxis
            tickValues={xTickValues}
            tickFormat={renderAxisLabel}
            style={axisStyle}
          />
        </VictoryChart>
        <Line />
      </View>
    );
  }
  return <View />;
};

CryptoChart.defaultProps = {
  chartObj: {},
  tokenList: [],
};

const styles = StyleSheet.create({
  intervals: {
    alignSelf: 'flex-end',
    marginTop: 20,
    flexDirection: 'row',
  },
});
