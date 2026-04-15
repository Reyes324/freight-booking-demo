"use client";

import { useState, useRef, useEffect } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { AddressDetail } from "@/data/mockData";
import AddressSearchInput from "./AddressSearchInput";
import AddressDetailsPopover from "./AddressDetailsPopover";
import MobileAddressFlow from "./MobileAddressFlow";

interface RouteSectionProps {
  pickupAddress: AddressDetail | null;
  dropoffAddress: AddressDetail | null;
  onPickupChange: (address: AddressDetail) => void;
  onDropoffChange: (address: AddressDetail) => void;
}

export default function RouteSection({
  pickupAddress,
  dropoffAddress,
  onPickupChange,
  onDropoffChange,
}: RouteSectionProps) {
  // Dynamic address list (minimum 2: pickup + dropoff)
  const [addresses, setAddresses] = useState<(AddressDetail | null)[]>([
    pickupAddress,
    dropoffAddress,
  ]);

  // Sync with parent props
  useEffect(() => {
    setAddresses(prev => {
      const updated = [...prev];
      updated[0] = pickupAddress;
      updated[updated.length - 1] = dropoffAddress;
      return updated;
    });
  }, [pickupAddress, dropoffAddress]);

  const [searchValues, setSearchValues] = useState<string[]>(["", ""]);
  const [showPopovers, setShowPopovers] = useState<boolean[]>([false, false]);
  const [isEditingStates, setIsEditingStates] = useState<boolean[]>([false, false]);
  const [selectedAddressText, setSelectedAddressText] = useState("");
  const [selectedCoords, setSelectedCoords] = useState<{ lat?: number; lng?: number }>({});
  const [currentEditIndex, setCurrentEditIndex] = useState<number>(-1);

  // Mobile full-screen address flow
  const [mobileFlowOpen, setMobileFlowOpen] = useState(false);
  const [mobileFlowIndex, setMobileFlowIndex] = useState<number>(0);

  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [listParent] = useAutoAnimate();

  const isMobile = () => typeof window !== "undefined" && window.innerWidth < 1024;

  const getMobileAddressType = (index: number): "pickup" | "dropoff" | "waypoint" => {
    if (index === 0) return "pickup";
    if (index === addresses.length - 1) return "dropoff";
    return "waypoint";
  };

  const handleMobileConfirm = (details: AddressDetail) => {
    updateAddress(mobileFlowIndex, details);
    setMobileFlowOpen(false);
  };

  const openMobileFlow = (index: number) => {
    setMobileFlowIndex(index);
    setMobileFlowOpen(true);
  };

  // Helper functions
  const getPlaceholder = (index: number) => {
    if (index === 0) return "装货地址";
    if (index === addresses.length - 1) return "卸货地址";
    return "途经地址";
  };

  const updateAddress = (index: number, address: AddressDetail) => {
    const updated = [...addresses];
    updated[index] = address;
    setAddresses(updated);

    // Sync with parent
    if (index === 0) onPickupChange(address);
    if (index === addresses.length - 1) onDropoffChange(address);
  };

  const handleAddressSelect = (index: number) => (suggestion: { mainText: string; latitude?: number; longitude?: number }) => {
    setSelectedAddressText(suggestion.mainText);
    setSelectedCoords({ lat: suggestion.latitude, lng: suggestion.longitude });
    setCurrentEditIndex(index);

    const updated = [...isEditingStates];
    updated[index] = false;
    setIsEditingStates(updated);

    // 立即创建地址对象并保存，不需要等待详情确认
    const newAddress: AddressDetail = {
      address: suggestion.mainText,
      lat: suggestion.latitude,
      lng: suggestion.longitude,
      contactName: "",
      phone: "",
      unit: "",
    };
    updateAddress(index, newAddress);

    // 打开详情弹窗供用户选填
    const updatedPopovers = [...showPopovers];
    updatedPopovers[index] = true;
    setShowPopovers(updatedPopovers);
  };

  const handleConfirm = (index: number) => (details: AddressDetail) => {

    const existing = addresses[index];
    const mergedDetails = existing ? { ...existing, ...details } : details;
    updateAddress(index, mergedDetails);

    const updated = [...showPopovers];
    updated[index] = false;
    setShowPopovers(updated);

    const updatedSearch = [...searchValues];
    updatedSearch[index] = "";
    setSearchValues(updatedSearch);
  };

  const handleCancel = (index: number) => () => {

    const updated = [...isEditingStates];
    updated[index] = false;
    setIsEditingStates(updated);

    const updatedSearch = [...searchValues];
    updatedSearch[index] = "";
    setSearchValues(updatedSearch);
  };

  const addAddress = () => {
    // Keep animation enabled for add/remove
    setAddresses([...addresses, null]);
    setSearchValues([...searchValues, ""]);
    setShowPopovers([...showPopovers, false]);
    setIsEditingStates([...isEditingStates, false]);
  };

  const removeAddress = (index: number) => {
    if (addresses.length <= 2) return;

    setAddresses(addresses.filter((_, i) => i !== index));
    setSearchValues(searchValues.filter((_, i) => i !== index));
    setShowPopovers(showPopovers.filter((_, i) => i !== index));
    setIsEditingStates(isEditingStates.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-900 mb-3">
        装卸点
      </h2>

      <div className="border border-gray-200/60 rounded-xl p-4 bg-white">
        {/* Each row: circle + input on the same line */}
        <div ref={listParent}>
          {addresses.map((address, index) => (
            <div key={index}>
              {/* Row: marker + input */}
              <div
                className="flex gap-3"
                ref={(el) => { containerRefs.current[index] = el; }}
              >
                {/* Left: marker column - stretches full row height */}
                <div className="flex flex-col items-center flex-shrink-0" style={{ width: '18px' }}>
                  {/* Top segment: line from row top to circle (non-first rows) */}
                  <div className="flex-1">
                    {index > 0 && (
                      <div className="w-px h-full mx-auto border-l border-dashed border-gray-300" />
                    )}
                  </div>
                  {/* Circle */}
                  <div
                    className={`w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 ${
                      index === 0
                        ? 'bg-blue-600'
                        : 'border-[1.5px] border-blue-600 bg-white'
                    }`}
                  >
                    <span className={`text-[10px] font-medium leading-none ${
                      index === 0 ? 'text-white' : 'text-blue-600'
                    }`}>
                      {index + 1}
                    </span>
                  </div>
                  {/* Bottom segment: line from circle to row bottom (non-last rows) */}
                  <div className="flex-1">
                    {index < addresses.length - 1 && (
                      <div className="w-px h-full mx-auto border-l border-dashed border-gray-300" />
                    )}
                  </div>
                </div>

                {/* Input content */}
                <div className="flex-1 min-w-0 relative">
                  {address && !isEditingStates[index] ? (
                    <div className="flex items-center gap-2">
                      {/* Filled address display */}
                      <div
                        className="flex-1 min-h-[44px] px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white
                                   hover:border-gray-300 transition-colors duration-200 ease-out cursor-pointer
                                   flex items-center"
                        onClick={() => {
                          if (isMobile()) {
                            openMobileFlow(index);
                            return;
                          }
                          const updated = [...isEditingStates];
                          updated[index] = true;
                          setIsEditingStates(updated);

                          const updatedSearch = [...searchValues];
                          updatedSearch[index] = address.address;
                          setSearchValues(updatedSearch);
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 leading-snug">
                            {address.address}
                          </p>
                          {(address.contactName || address.phone || address.unit) && (
                            <div
                              className="flex items-center gap-1.5 mt-1.5 group cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAddressText(address.address);
                                setSelectedCoords({ lat: address.lat, lng: address.lng });
                                setCurrentEditIndex(index);
                                const updated = [...showPopovers];
                                updated[index] = true;
                                setShowPopovers(updated);
                              }}
                            >
                              <p className="text-xs text-gray-500 group-hover:text-gray-700 leading-snug transition-colors">
                                {address.contactName} · {address.phone}
                                {address.unit && ` · ${address.unit}`}
                              </p>
                              <svg
                                className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Delete button */}
                      {addresses.length > 2 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAddress(index);
                          }}
                          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
                          title="删除"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        {/* Mobile: tap opens full-screen flow */}
                        <div
                          className="lg:hidden"
                          onClick={() => openMobileFlow(index)}
                        >
                          <div className="w-full h-11 px-3.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-400 flex items-center cursor-pointer hover:border-gray-300 transition-colors">
                            {getPlaceholder(index)}
                          </div>
                        </div>
                        {/* Desktop: inline search */}
                        <div className="hidden lg:block">
                          <AddressSearchInput
                            value={searchValues[index]}
                            onChange={(value) => {
                              const updated = [...searchValues];
                              updated[index] = value;
                              setSearchValues(updated);
                            }}
                            onSelectAddress={handleAddressSelect(index)}
                            onCancel={handleCancel(index)}
                            placeholder={getPlaceholder(index)}
                          />
                        </div>
                      </div>
                      {/* Delete button */}
                      {addresses.length > 2 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAddress(index);
                          }}
                          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
                          title="删除"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Address Details Popover */}
                  <AddressDetailsPopover
                    isOpen={showPopovers[index]}
                    onClose={() => {
                      const updated = [...showPopovers];
                      updated[index] = false;
                      setShowPopovers(updated);
                    }}
                    onConfirm={handleConfirm(index)}
                    addressText={selectedAddressText}
                    initialData={addresses[index] || undefined}
                    coordinates={selectedCoords}
                    anchorRef={containerRefs.current[index] ? { current: containerRefs.current[index] } : undefined}
                  />
                </div>
              </div>

              {/* Connecting line through the gap between rows */}
              {index < addresses.length - 1 && (
                <div className="h-3" style={{ width: '18px' }}>
                  <div className="w-px h-full mx-auto border-l border-dashed border-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Destination Button */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={addAddress}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors duration-150"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            添加卸货地
          </button>
        </div>
      </div>

      {/* Mobile full-screen address flow */}
      <MobileAddressFlow
        isOpen={mobileFlowOpen}
        onClose={() => setMobileFlowOpen(false)}
        onConfirm={handleMobileConfirm}
        addressType={getMobileAddressType(mobileFlowIndex)}
        initialAddress={addresses[mobileFlowIndex]}
      />
    </div>
  );
}
