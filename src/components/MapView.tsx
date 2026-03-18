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
  const polylineRef = useRef<any>(null);

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
          size: new window.AMap.Size(36, 36),
          image: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="12" fill="#2563EB" stroke="white" stroke-width="3"/>
              <text x="18" y="18" text-anchor="middle" dominant-baseline="central" fill="white" font-size="14" font-weight="500" font-family="system-ui, -apple-system, sans-serif">1</text>
            </svg>
          `),
          imageSize: new window.AMap.Size(36, 36),
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

    // 清除旧连线
    if (polylineRef.current) {
      mapInstanceRef.current.remove(polylineRef.current);
      polylineRef.current = null;
    }

    // 如果有卸货地址且有经纬度，添加标记
    if (dropoffAddress?.lat && dropoffAddress?.lng) {
      const marker = new window.AMap.Marker({
        position: [dropoffAddress.lng, dropoffAddress.lat],
        title: '卸货点',
        icon: new window.AMap.Icon({
          size: new window.AMap.Size(36, 36),
          image: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="12" fill="white" stroke="#2563EB" stroke-width="3"/>
              <text x="18" y="18" text-anchor="middle" dominant-baseline="central" fill="#2563EB" font-size="14" font-weight="500" font-family="system-ui, -apple-system, sans-serif">2</text>
            </svg>
          `),
          imageSize: new window.AMap.Size(36, 36),
        }),
      });

      mapInstanceRef.current.add(marker);
      dropoffMarkerRef.current = marker;

      // 如果起点和终点都存在，画连线
      if (pickupAddress?.lat && pickupAddress?.lng) {
        const polyline = new window.AMap.Polyline({
          path: [
            [pickupAddress.lng, pickupAddress.lat],
            [dropoffAddress.lng, dropoffAddress.lat]
          ],
          strokeColor: '#D1D5DB',  // gray-300
          strokeWeight: 2,
          strokeStyle: 'dashed',
          strokeDasharray: [10, 10],
        });

        mapInstanceRef.current.add(polyline);
        polylineRef.current = polyline;
      }

      // 自动调整视野
      updateMapView();
    }
  }, [dropoffAddress, pickupAddress]);

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
