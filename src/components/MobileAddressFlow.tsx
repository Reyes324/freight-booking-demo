"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { searchAddress } from "@/services/addressService";
import type { AddressSuggestion } from "@/services/addressService";
import type { AddressDetail } from "@/data/mockData";
import MapView from "./MapView";
import { useT } from "@/hooks/useT";

interface MobileAddressFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: AddressDetail) => void;
  addressType: "pickup" | "dropoff" | "waypoint";
  initialAddress?: AddressDetail | null;
}

type FlowStep = "search" | "details";

export default function MobileAddressFlow({
  isOpen,
  onClose,
  onConfirm,
  addressType,
  initialAddress,
}: MobileAddressFlowProps) {
  const [step, setStep] = useState<FlowStep>("search");
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Selected address from search
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [selectedCoords, setSelectedCoords] = useState<{
    lat?: number;
    lng?: number;
  }>({});

  // Detail form fields
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [unit, setUnit] = useState("");

  // For MapView display
  const [mapPickup, setMapPickup] = useState<AddressDetail | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>(undefined);
  const t = useT();

  const title =
    addressType === "pickup"
      ? t.address.selectPickup
      : addressType === "dropoff"
        ? t.address.selectDropoff
        : t.address.selectWaypoint;

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep("search");
      setSearchValue(initialAddress?.address || "");
      setSuggestions([]);
      setHasSearched(false);
      setSelectedAddress("");
      setSelectedCoords({});
      setContactName(initialAddress?.contactName || "");
      setPhone(initialAddress?.phone || "");
      setUnit(initialAddress?.unit || "");
      setMapPickup(null);

      // Focus input after animation
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen, initialAddress]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  // Search logic
  const doSearch = useCallback((query: string) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (query.length === 0) {
      setSuggestions([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchAddress(query);
        setSuggestions(results);
        setHasSearched(true);
      } catch {
        setSuggestions([]);
        setHasSearched(true);
      } finally {
        setIsLoading(false);
      }
    }, 200);
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    doSearch(value);
  };

  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    setSelectedAddress(suggestion.mainText);
    setSelectedCoords({
      lat: suggestion.latitude,
      lng: suggestion.longitude,
    });
    setSearchValue(suggestion.mainText);

    // Show on map
    if (suggestion.latitude && suggestion.longitude) {
      setMapPickup({
        address: suggestion.mainText,
        contactName: "",
        phone: "",
        lat: suggestion.latitude,
        lng: suggestion.longitude,
      });
    }

    // Transition to details step
    setStep("details");
  };

  const handleConfirm = () => {
    onConfirm({
      address: selectedAddress,
      contactName: contactName.trim(),
      phone: phone.trim(),
      unit: unit.trim() || undefined,
      lat: selectedCoords.lat,
      lng: selectedCoords.lng,
    });
  };

  const handleBack = () => {
    if (step === "details") {
      setStep("search");
      setMapPickup(null);
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-[200] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Top bar */}
      <div className="flex-shrink-0 flex items-center h-14 px-4 border-b border-gray-100">
        <button
          onClick={handleBack}
          className="w-9 h-9 flex items-center justify-center -ml-1 rounded-lg active:bg-gray-100"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-base font-semibold text-gray-900 pr-9">
          {title}
        </h1>
      </div>

      {step === "search" ? (
        <>
          {/* Map background — full screen */}
          <div className="absolute inset-x-0 top-14 bottom-0">
            <MapView pickupAddress={mapPickup} dropoffAddress={null} />
          </div>

          {/* Search input (floats on map) */}
          <div className="relative z-10 flex-shrink-0 px-4 py-3 bg-white border-b border-gray-100">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t.address.searchPlaceholder}
                className="w-full h-11 pl-9 pr-3.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400
                           focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:bg-white"
              />
              {searchValue && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-300 active:bg-gray-400"
                >
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
              {isLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                </div>
              )}
            </div>
          </div>

          {/* Results list — floats on map, below search input */}
          <div className="relative z-10 flex-1 overflow-y-auto bg-white">
            {isLoading ? (
              <div className="py-12 px-4 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-3">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-sm text-gray-600">{t.address.searching}</p>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="py-1">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="w-full px-4 py-3 text-left active:bg-gray-50 border-b border-gray-50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 leading-snug">
                          {suggestion.mainText}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {suggestion.secondaryText}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : hasSearched && searchValue.length >= 3 ? (
              <div className="py-12 px-4 text-center">
                <svg
                  className="w-10 h-10 mx-auto text-gray-300 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-sm text-gray-500">{t.address.noResults}</p>
                <p className="text-xs text-gray-400 mt-1">{t.address.tryOtherKeywords}</p>
              </div>
            ) : (
              <div className="py-12 px-4 text-center">
                <p className="text-sm text-gray-400">{t.address.typeToSearch}</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Details step */}
          {/* Map with selected location */}
          <div className="flex-shrink-0 h-[30vh] border-b border-gray-100">
            <MapView pickupAddress={mapPickup} dropoffAddress={null} />
          </div>

          {/* Detail form */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {/* Selected address */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                {t.address.selectedAddress}
              </label>
              <div className="px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-700 leading-snug">
                  {selectedAddress}
                </p>
              </div>
            </div>

            {/* Contact Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                {t.address.contactName}
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder={t.address.contactNamePlaceholder}
                className="w-full h-12 px-3.5 rounded-lg border border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400
                           focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                {t.address.contactPhone}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.address.contactPhonePlaceholder}
                className="w-full h-12 px-3.5 rounded-lg border border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400
                           focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                {t.address.addressNote}
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder={t.address.addressNotePlaceholder}
                className="w-full h-12 px-3.5 rounded-lg border border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400
                           focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex-shrink-0 flex gap-3 px-4 pt-4 pb-8 border-t border-gray-100 bg-white">
            <button
              onClick={handleBack}
              className="flex-1 h-12 rounded-lg border border-gray-200 text-base font-medium text-gray-700
                         active:bg-gray-100 transition-colors"
            >
              {t.address.cancel}
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 h-12 rounded-lg text-base font-semibold text-white bg-blue-600
                         active:bg-blue-700 transition-colors"
            >
              {t.address.confirm}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
