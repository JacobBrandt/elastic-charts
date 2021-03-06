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

import { boolean } from '@storybook/addon-knobs';
import React from 'react';

import { Axis, BarSeries, Chart, RectAnnotation, ScaleType, Settings } from '../../../src';
import { Position } from '../../../src/utils/commons';
import { getChartRotationKnob } from '../../utils/knobs';

export const Example = () => {
  const debug = boolean('debug', false);
  const rotation = getChartRotationKnob();

  return (
    <Chart className="story-chart">
      <Settings debug={debug} rotation={rotation} />
      <RectAnnotation
        dataValues={[
          {
            coordinates: {
              x0: 'a',
              x1: 'c',
            },
            details: 'annotation on ordinal bar chart',
          },
        ]}
        id="rect"
        style={{ fill: 'red' }}
      />
      <Axis id="bottom" position={Position.Bottom} title="x-domain axis" />
      <Axis id="left" title="y-domain axis" position={Position.Left} />
      <BarSeries
        id="bars"
        xScaleType={ScaleType.Ordinal}
        yScaleType={ScaleType.Linear}
        xAccessor="x"
        yAccessors={['y']}
        data={[
          { x: 'a', y: 2 },
          { x: 'b', y: 3 },
          { x: 'c', y: 0 },
          { x: 'd', y: 6 },
        ]}
      />
    </Chart>
  );
};

Example.story = {
  parameters: {
    info: {
      text: `On Ordinal Bar charts, you can draw a rectangular annotation the same way it's done within a linear bar chart.
The annotation will cover fully the extent defined by the \`coordinate\` object, extending to the max/min domain values any
missing/out-of-range parameters.
      `,
    },
  },
};
