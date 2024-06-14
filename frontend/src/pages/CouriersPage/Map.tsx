import { YMapEntity } from '@yandex/ymaps3-types';
import { YMap as YMapType } from '@yandex/ymaps3-types/imperative/YMap';
import ControlsModule from '@yandex/ymaps3-types/packages/controls/react';
import { YMapDefaultMarkerProps } from '@yandex/ymaps3-types/packages/markers';
import MarkersModule from '@yandex/ymaps3-types/packages/markers/react';
import MainModule from '@yandex/ymaps3-types/react';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';

type YMapAPIType = typeof MainModule & typeof ControlsModule & typeof MarkersModule;

const Map = () => {
  const mapRef = useRef<YMapType>(null);
  const markersRefs = useRef<Array<YMapEntity<YMapDefaultMarkerProps> | null>>([]);

  const [YMapAPI, setYMapAPI] = useState<YMapAPIType | null>(null);

  // const couriersData = useSelector(couriersOnMapSelector);

  useEffect(() => {
    (async () => {
      const [ymaps3Reactify, ymaps3Controls, ymaps3Markers] = await Promise.all([
        ymaps3.import('@yandex/ymaps3-reactify'),
        ymaps3.import('@yandex/ymaps3-controls@0.0.1'),
        ymaps3.import('@yandex/ymaps3-markers@0.0.1'),
        ymaps3.ready,
      ]);
      const reactify = ymaps3Reactify.reactify.bindTo(React, ReactDOM);

      setYMapAPI({
        reactify,
        ...reactify.module(ymaps3),
        ...reactify.module(ymaps3Controls),
        ...reactify.module(ymaps3Markers),
      });
    })();

    setTimeout(() => markersRefs.current?.[2]?.update({ coordinates: [37.617633, 55.9] }), 5000);
  }, []);

  if (!YMapAPI) {
    return <></>;
  }

  const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls, YMapZoomControl, YMapDefaultMarker } =
    YMapAPI;

  return (
    <YMap ref={mapRef} location={{ center: [37.617633, 55.75582], zoom: 10.5 }} mode="vector" showScaleInCopyrights>
      <YMapDefaultSchemeLayer />
      <YMapDefaultFeaturesLayer />

      <YMapControls position="right">
        <YMapZoomControl />
      </YMapControls>

      {/* {couriersData.map((data, i) => (
        <YMapDefaultMarker
          key={i}
          ref={ref => (markersRefs.current[i] = ref)}
          coordinates={data.coordinates}
          title={data.name}
        />
      ))} */}
    </YMap>
  );
};

export default Map;
