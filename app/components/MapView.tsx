import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { findNodeHandle, requireNativeComponent, UIManager } from 'react-native';
import PropTypes from 'prop-types';

const MapView = forwardRef((props: any, ref: any) => {
  const mapRef = useRef(null);

	// 부모 component에서 접근하는 method 구현
  useImperativeHandle(ref, () => ({
    setPosition: (region: any) => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(mapRef.current),
        UIManager.RNTMap.Commands.setPosition,
        [region.latitude, region.longitude],
      );
    },
  }));

  return <RNTMap ref={mapRef} {...props} />;
});

MapView.propTypes = {
  zoomLevel: PropTypes.number,
};

const RNTMap = requireNativeComponent('RNTMap', MapView);

export default MapView;
