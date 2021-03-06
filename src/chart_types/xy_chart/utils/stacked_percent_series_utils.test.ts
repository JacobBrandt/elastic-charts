/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { MockRawDataSeries } from '../../../mocks';
import { ScaleType } from '../../../scales/constants';
import { formatStackedDataSeriesValues } from './stacked_series_utils';

describe('Stacked Series Utils', () => {
  const STANDARD_DATA_SET = MockRawDataSeries.fromData([[{ x: 0, y1: 10 }], [{ x: 0, y1: 20 }], [{ x: 0, y1: 70 }]], {
    yAccessor: 'y1',
    splitAccessors: new Map(),
    seriesKeys: [],
  });
  const WITH_NULL_DATASET = MockRawDataSeries.fromData([[{ x: 0, y1: 10 }], [{ x: 0, y1: null }], [{ x: 0, y1: 30 }]], {
    yAccessor: 'y1',
    seriesKeys: [],
  });
  const STANDARD_DATA_SET_WY0 = MockRawDataSeries.fromData(
    [[{ x: 0, y0: 2, y1: 10 }], [{ x: 0, y0: 4, y1: 20 }], [{ x: 0, y0: 6, y1: 70 }]],
    {
      yAccessor: 'y1',
      seriesKeys: [],
    },
  );
  const WITH_NULL_DATASET_WY0 = MockRawDataSeries.fromData(
    [[{ x: 0, y0: 2, y1: 10 }], [{ x: 0, y1: null }], [{ x: 0, y0: 6, y1: 90, mark: null }]],
    {
      yAccessor: 'y1',
      seriesKeys: [],
    },
  );
  const DATA_SET_WITH_NULL_2 = MockRawDataSeries.defaults(
    [
      {
        seriesKeys: ['a'],
        key: 'a',
        data: [
          { x: 1, y1: 10 },
          { x: 2, y1: 20 },
          { x: 4, y1: 40 },
        ],
      },
      {
        seriesKeys: ['b'],
        key: 'b',
        data: [
          { x: 1, y1: 90 },
          { x: 3, y1: 30 },
        ],
      },
    ],
    {
      specId: 'spec1',
      yAccessor: 'y1',
    },
  );
  const xValues = new Set([0]);
  const with2NullsXValues = new Set([1, 2, 3, 4]);

  describe('Format stacked dataset', () => {
    test('format data without nulls', () => {
      const formattedData = formatStackedDataSeriesValues(STANDARD_DATA_SET, false, true, xValues, ScaleType.Linear);
      const data0 = formattedData[0].data[0];
      expect(data0.initialY1).toBe(0.1);
      expect(data0.y0).toBeNull();
      expect(data0.y1).toBe(0.1);

      const data1 = formattedData[1].data[0];
      expect(data1.initialY1).toBe(0.2);
      expect(data1.y0).toBe(0.1);
      expect(data1.y1).toBeCloseTo(0.3);

      const data2 = formattedData[2].data[0];
      expect(data2.initialY1).toBe(0.7);
      expect(data2.y0).toBe(0.3);
      expect(data2.y1).toBe(1);
    });
    test('format data with nulls', () => {
      const formattedData = formatStackedDataSeriesValues(WITH_NULL_DATASET, false, true, xValues, ScaleType.Linear);
      const data0 = formattedData[0].data[0];
      expect(data0.initialY1).toBe(0.25);
      expect(data0.y0).toBeNull();
      expect(data0.y1).toBe(0.25);

      expect(formattedData[1].data[0]).toMatchObject({
        initialY0: null,
        initialY1: null,
        x: 0,
        y1: null,
        y0: 0.25,
        mark: null,
      });

      const data2 = formattedData[2].data[0];
      expect(data2.initialY1).toBe(0.75);
      expect(data2.y0).toBe(0.25);
      expect(data2.y1).toBe(1);
    });
    test('format data without nulls with y0 values', () => {
      const formattedData = formatStackedDataSeriesValues(
        STANDARD_DATA_SET_WY0,
        false,
        true,
        xValues,
        ScaleType.Linear,
      );
      const data0 = formattedData[0].data[0];
      expect(data0.initialY0).toBe(0.02);
      expect(data0.initialY1).toBe(0.1);
      expect(data0.y0).toBe(0.02);
      expect(data0.y1).toBe(0.1);

      const data1 = formattedData[1].data[0];
      expect(data1.initialY0).toBe(0.04);
      expect(data1.initialY1).toBe(0.2);
      expect(data1.y0).toBe(0.14);
      expect(data1.y1).toBeCloseTo(0.3, 5);

      const data2 = formattedData[2].data[0];
      expect(data2.initialY0).toBe(0.06);
      expect(data2.initialY1).toBe(0.7);
      expect(data2.y0).toBe(0.36);
      expect(data2.y1).toBe(1);
    });
    test('format data with nulls - missing points', () => {
      const formattedData = formatStackedDataSeriesValues(
        WITH_NULL_DATASET_WY0,
        false,
        true,
        xValues,
        ScaleType.Linear,
      );
      const data0 = formattedData[0].data[0];
      expect(data0.initialY0).toBe(0.02);
      expect(data0.initialY1).toBe(0.1);
      expect(data0.y0).toBe(0.02);
      expect(data0.y1).toBe(0.1);

      const data1 = formattedData[1].data[0];
      expect(data1.initialY0).toBe(null);
      expect(data1.initialY1).toBe(null);
      expect(data1.y0).toBe(0.1);
      expect(data1.y1).toBe(null);

      const data2 = formattedData[2].data[0];
      expect(data2.initialY0).toBe(0.06);
      expect(data2.initialY1).toBe(0.9);
      expect(data2.y0).toBe(0.16);
      expect(data2.y1).toBe(1);
    });
    test('format data without nulls on second series', () => {
      const formattedData = formatStackedDataSeriesValues(
        DATA_SET_WITH_NULL_2,
        false,
        true,
        with2NullsXValues,
        ScaleType.Linear,
      );
      expect(formattedData.length).toBe(2);
      expect(formattedData[0].data.length).toBe(4);
      expect(formattedData[1].data.length).toBe(4);
      expect(formattedData[0].data[0]).toMatchObject({
        initialY0: null,
        initialY1: 0.1,
        x: 1,
        y0: null,
        y1: 0.1,
        mark: null,
      });
      expect(formattedData[0].data[1]).toMatchObject({
        initialY0: null,
        initialY1: 1,
        x: 2,
        y0: null,
        y1: 1,
        mark: null,
      });
      expect(formattedData[0].data[3]).toMatchObject({
        initialY0: null,
        initialY1: 1,
        x: 4,
        y0: null,
        y1: 1,
        mark: null,
      });
      expect(formattedData[1].data[0]).toMatchObject({
        initialY0: null,
        initialY1: 0.9,
        x: 1,
        y0: 0.1,
        y1: 1,
        mark: null,
      });
      expect(formattedData[1].data[1]).toMatchObject({
        initialY0: null,
        initialY1: 0,
        x: 2,
        y0: 1,
        y1: 1,
        mark: null,
        filled: {
          x: 2,
          y1: 0,
        },
      });
      expect(formattedData[1].data[2]).toMatchObject({
        initialY0: null,
        initialY1: 1,
        x: 3,
        y0: 0,
        y1: 1,
        mark: null,
      });
    });
  });
});
