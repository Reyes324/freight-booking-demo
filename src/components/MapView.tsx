"use client";

import { useEffect, useRef } from "react";
import type { AddressDetail } from "@/data/mockData";

// 高德地图 TypeScript 类型声明
declare global {
  interface Window {
    AMap: any;
    _AMapSecurityConfig: any;
  }
}

interface MapViewProps {
  pickupAddress: AddressDetail | null;
  dropoffAddress: AddressDetail | null;
}

const GAODE_KEY = '901cb477294958c0c8ae86f5f7536438';
// 高德地图安全密钥
const GAODE_SECURITY_KEY = 'd9745521ba8369dae7b32418f52c1c7d';

export default function MapView({ pickupAddress, dropoffAddress }: MapViewProps) {
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const pickupMarkerRef = useRef<any>(null);
  const dropoffMarkerRef = useRef<any>(null);

  useEffect(() => {
    // 设置安全密钥（如果有）
    if (GAODE_SECURITY_KEY) {
      window._AMapSecurityConfig = {
        securityJsCode: GAODE_SECURITY_KEY,
      };
    }

    // 加载高德地图 JS API
    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${GAODE_KEY}`;
    script.async = true;

    script.onload = () => {
      if (mapRef.current && window.AMap) {
        // 初始化地图，中心点设为香港
        mapInstanceRef.current = new window.AMap.Map(mapRef.current, {
          zoom: 11,
          center: [114.1694, 22.3193], // 香港中心坐标
          mapStyle: 'amap://styles/normal',
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      // 清理地图实例
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // 处理装货地址变化
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // 清除旧标记
    if (pickupMarkerRef.current) {
      mapInstanceRef.current.remove(pickupMarkerRef.current);
      pickupMarkerRef.current = null;
    }

    // 如果有装货地址且有经纬度，添加标记
    if (pickupAddress?.lat && pickupAddress?.lng) {
      const marker = new window.AMap.Marker({
        position: [pickupAddress.lng, pickupAddress.lat],
        title: '装货点',
        icon: new window.AMap.Icon({
          size: new window.AMap.Size(32, 32),
          image: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="10" fill="#2257D4" stroke="white" stroke-width="3"/>
            </svg>
          `),
          imageSize: new window.AMap.Size(32, 32),
        }),
      });

      mapInstanceRef.current.add(marker);
      pickupMarkerRef.current = marker;

      // 自动调整视野
      updateMapView();
    }
  }, [pickupAddress]);

  // 处理卸货地址变化
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // 清除旧标记
    if (dropoffMarkerRef.current) {
      mapInstanceRef.current.remove(dropoffMarkerRef.current);
      dropoffMarkerRef.current = null;
    }

    // 如果有卸货地址且有经纬度，添加标记
    if (dropoffAddress?.lat && dropoffAddress?.lng) {
      const marker = new window.AMap.Marker({
        position: [dropoffAddress.lng, dropoffAddress.lat],
        title: '卸货点',
        icon: new window.AMap.Icon({
          size: new window.AMap.Size(32, 32),
          image: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="10" fill="#F97316" stroke="white" stroke-width="3"/>
            </svg>
          `),
          imageSize: new window.AMap.Size(32, 32),
        }),
      });

      mapInstanceRef.current.add(marker);
      dropoffMarkerRef.current = marker;

      // 自动调整视野
      updateMapView();
    }
  }, [dropoffAddress]);

  // 自动调整地图视野
  const updateMapView = () => {
    if (!mapInstanceRef.current) return;

    const markers: any[] = [];
    if (pickupMarkerRef.current) markers.push(pickupMarkerRef.current);
    if (dropoffMarkerRef.current) markers.push(dropoffMarkerRef.current);

    if (markers.length === 0) {
      // 没有标记，显示香港全景
      mapInstanceRef.current.setZoomAndCenter(11, [114.1694, 22.3193]);
    } else if (markers.length === 1) {
      // 只有一个标记，定位到该点
      mapInstanceRef.current.setZoomAndCenter(14, markers[0].getPosition());
    } else {
      // 有两个标记，自动调整视野包含所有标记
      mapInstanceRef.current.setFitView(markers, true, [100, 100, 100, 100]);
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      {/* 高德地图容器 */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Region Label */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-sm px-3 py-1.5 text-sm font-medium text-gray-700 z-10">
        香港
      </div>
    </div>
  );
}
