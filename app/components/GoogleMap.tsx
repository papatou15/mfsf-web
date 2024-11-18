"use client"

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import React from 'react';

const containerStyle = {
  width: '500px',
  height: '500px',
};

const center = {
  lat: 45.66297421713217, // Default latitude
  lng: -73.57978371107636, // Default longitude
};

type MapProps = {
  apiKey: string;
  markers?: { lat: number; lng: number }[]; // Optional array of marker positions
};

const Map: React.FC<MapProps> = ({ apiKey, markers }) => {
  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={16}>
        {markers?.map((position, index) => (
          <Marker key={index} position={position} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
