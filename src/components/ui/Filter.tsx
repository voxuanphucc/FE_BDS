import React, { useState, useEffect, useRef } from 'react';
import { Filter as FilterIcon, ChevronDown, Check } from 'lucide-react';

interface FilterProps {
  onApply: (filters: FilterData) => void;
  loading?: boolean;
}

export interface FilterData {
  postType: string | null; // 'SALE' | 'RENT' | null
  realEstateType: string | null; // 'HOUSE' | 'APARTMENT' | 'LAND' | null
  priceRange: string;
  city: string | null; // 'hanoi' | 'hcm' | 'DaNang' | 'cantho' | null
  priceFrom?: number | null;
  priceTo?: number | null;
}

const Filter: React.FC<FilterProps> = ({ onApply, loading = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterData>({
    postType: null,
    realEstateType: null,
    priceRange: '',
    city: null,
    priceFrom: null,
    priceTo: null
  });

  const [dropdownStates, setDropdownStates] = useState({
    postType: false,
    realEstateType: false,
    priceRange: false,
    city: false
  });

  const filterRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setDropdownStates({
          postType: false,
          realEstateType: false,
          priceRange: false,
          city: false
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const postTypeOptions = [
    { value: 'SALE', label: '🏠 Bán' },
    { value: 'RENT', label: '🏘️ Cho thuê' }
  ];

  const realEstateTypeOptions = [
    { value: 'HOUSE', label: '🏡 Nhà ở' },
    { value: 'APARTMENT', label: '🏢 Chung cư' },
    { value: 'LAND', label: '🌳 Đất nền' }
  ];

  // UI range (in billion VND)
  const MIN_BILLION = 0;
  const MAX_BILLION = 200; // 200+
  const [minBillion, setMinBillion] = useState<number>(MIN_BILLION);
  const [maxBillion, setMaxBillion] = useState<number>(MAX_BILLION);
  const [selectedPreset, setSelectedPreset] = useState<string>(''); // Track which preset is selected

  const cityOptions = [
    { value: 'hanoi', label: 'Hà Nội' },
    { value: 'hcm', label: 'TP. Hồ Chí Minh' },
    { value: 'DaNang', label: 'Đà Nẵng' },
    { value: 'cantho', label: 'Cần Thơ' }
  ];

  const toggleDropdown = (dropdown: keyof typeof dropdownStates) => {
    setDropdownStates(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const handleFilterChange = (key: keyof FilterData, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    // Convert billion unit to VND with correct logic
    let priceFromVnd: number | null = null;
    let priceToVnd: number | null = null;
    
    // ONLY use preset values when a preset is selected, ignore slider values
    if (selectedPreset === 'under-1') {
      // Dưới 1 tỷ: 0 ≤ giá < 1 tỷ
      priceFromVnd = 0;
      priceToVnd = 999_999_999; // 999,999,999 VND (dưới 1 tỷ)
    } else if (selectedPreset === '1-3') {
      // 1-3 tỷ: 1 tỷ ≤ giá ≤ 3 tỷ
      priceFromVnd = 1_000_000_000;
      priceToVnd = 3_000_000_000;
    } else if (selectedPreset === '3-5') {
      // 3-5 tỷ: 3 tỷ ≤ giá ≤ 5 tỷ
      priceFromVnd = 3_000_000_000;
      priceToVnd = 5_000_000_000;
    } else if (selectedPreset === '5-10') {
      // 5-10 tỷ: 5 tỷ ≤ giá ≤ 10 tỷ
      priceFromVnd = 5_000_000_000;
      priceToVnd = 10_000_000_000;
    } else if (selectedPreset === '10-20') {
      // 10-20 tỷ: 10 tỷ ≤ giá ≤ 20 tỷ
      priceFromVnd = 10_000_000_000;
      priceToVnd = 20_000_000_000;
    } else if (selectedPreset === 'over-20') {
      // Trên 20 tỷ: giá > 20 tỷ
      priceFromVnd = 20_000_001_000; // 20 tỷ + 1 triệu
      priceToVnd = null;
         } else {
       // No preset selected, use custom slider values
       if (minBillion > MIN_BILLION) {
         priceFromVnd = minBillion * 1_000_000_000;
       }
       if (maxBillion < MAX_BILLION) {
         priceToVnd = maxBillion * 1_000_000_000;
       }
       // If both are at extremes, don't filter by price
       if (minBillion === MIN_BILLION && maxBillion === MAX_BILLION) {
         priceFromVnd = null;
         priceToVnd = null;
       }
       // If no custom range is set, don't filter by price
       if (priceFromVnd === null && priceToVnd === null) {
         priceFromVnd = null;
         priceToVnd = null;
       }
     }
    
    const filterData: FilterData = {
      ...filters,
      priceFrom: priceFromVnd,
      priceTo: priceToVnd
    };
    console.log('=== PRICE FILTER DEBUG ===');
    console.log('Selected preset:', selectedPreset);
    console.log('Slider values:', { minBillion, maxBillion });
    console.log('Final VND values:', { priceFromVnd, priceToVnd });
    console.log('Filter data being sent:', filterData);
    console.log('==========================');
    
    onApply(filterData);
    setIsOpen(false);
  };

  const getDisplayText = (key: keyof FilterData) => {
    const value = filters[key];
    if (!value) return '';

    switch (key) {
      case 'postType':
        return postTypeOptions.find(opt => opt.value === value)?.label || value;
      case 'realEstateType':
        return realEstateTypeOptions.find(opt => opt.value === value)?.label || value;
      case 'priceRange':
        // Build label from current slider values
        if (minBillion === MIN_BILLION && maxBillion === MAX_BILLION) return 'Giá bán';
        if (minBillion === MIN_BILLION) return `Dưới ${maxBillion} tỷ`;
        if (maxBillion === MAX_BILLION) return `Trên ${minBillion} tỷ`;
        return `${minBillion} - ${maxBillion} tỷ`;
      case 'city':
        return cityOptions.find(opt => opt.value === value)?.label || value;
      default:
        return value;
    }
  };

  return (
    <div ref={filterRef} className="flex items-center space-x-3">
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        <FilterIcon className="h-4 w-4" />
        <span>Lọc</span>
      </button>

      {/* Post Type Dropdown */}
      <div className="relative">
        <button
          onClick={() => toggleDropdown('postType')}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors min-w-[120px]"
        >
          <span>{filters.postType ? getDisplayText('postType') : 'Mua bán'}</span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {dropdownStates.postType && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {postTypeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  handleFilterChange('postType', option.value);
                  toggleDropdown('postType');
                }}
                className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-50"
              >
                <span>{option.label}</span>
                {filters.postType === option.value && <Check className="h-4 w-4 text-blue-600" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Real Estate Type Dropdown */}
      <div className="relative">
        <button
          onClick={() => toggleDropdown('realEstateType')}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors min-w-[140px]"
        >
          <span>{filters.realEstateType ? getDisplayText('realEstateType') : 'Loại hình BĐS'}</span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {dropdownStates.realEstateType && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {realEstateTypeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  handleFilterChange('realEstateType', option.value);
                  toggleDropdown('realEstateType');
                }}
                className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-50"
              >
                <span>{option.label}</span>
                {filters.realEstateType === option.value && <Check className="h-4 w-4 text-blue-600" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Dropdown */}
      <div className="relative">
        <button
          onClick={() => toggleDropdown('priceRange')}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors min-w-[120px]"
        >
          <span>{getDisplayText('priceRange') || 'Giá bán'}</span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {dropdownStates.priceRange && (
          <div className="absolute top-full left-0 mt-1 w-[380px] bg-white border border-gray-200 rounded-xl shadow-xl z-10 p-4">
            <div className="mb-3 text-sm font-medium text-gray-800">Khoảng giá (mỗi nấc 100 triệu)</div>
            {/* Slider */}
            <div className="px-2">
              <div className="relative h-6">
                {/* Track background */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-gray-200" />
                {/* Selected range */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full bg-gray-600"
                  style={{
                    left: `${(minBillion - MIN_BILLION) / (MAX_BILLION - MIN_BILLION) * 100}%`,
                    right: `${100 - (maxBillion - MIN_BILLION) / (MAX_BILLION - MIN_BILLION) * 100}%`
                  }}
                />
                {/* Min thumb */}
                                 <input
                   type="range"
                   min={MIN_BILLION}
                   max={MAX_BILLION}
                   step={1}
                   value={minBillion}
                   onChange={(e) => {
                     const v = Math.min(Number(e.target.value), maxBillion);
                     setMinBillion(v);
                     setSelectedPreset(''); // Clear preset when manually adjusting
                   }}
                   className="absolute pointer-events-auto w-full h-6 appearance-none bg-transparent accent-gray-600"
                 />
                 {/* Max thumb */}
                 <input
                   type="range"
                   min={MIN_BILLION}
                   max={MAX_BILLION}
                   step={1}
                   value={maxBillion}
                   onChange={(e) => {
                     const v = Math.max(Number(e.target.value), minBillion);
                     setMaxBillion(v);
                     setSelectedPreset(''); // Clear preset when manually adjusting
                   }}
                   className="absolute pointer-events-auto w-full h-6 appearance-none bg-transparent accent-gray-600"
                 />
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>0</span>
                <span>200+ tỷ</span>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <div className="text-xs text-gray-600 mb-1">Từ (tỷ)</div>
                                 <input
                   type="number"
                   min={MIN_BILLION}
                   max={MAX_BILLION}
                   step={1}
                   value={minBillion}
                   onChange={(e) => {
                     setMinBillion(Math.min(Number(e.target.value), maxBillion));
                     setSelectedPreset(''); // Clear preset when manually typing
                   }}
                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                 />
               </div>
               <div>
                 <div className="text-xs text-gray-600 mb-1">Đến (tỷ)</div>
                 <input
                   type="number"
                   min={MIN_BILLION}
                   max={MAX_BILLION}
                   step={1}
                   value={maxBillion}
                   onChange={(e) => {
                     setMaxBillion(Math.max(Number(e.target.value), minBillion));
                     setSelectedPreset(''); // Clear preset when manually typing
                   }}
                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                 />
              </div>
            </div>

            {/* Quick selections */}
            <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
                             <button 
                 onClick={() => { 
                   setMinBillion(0); 
                   setMaxBillion(1); 
                   setSelectedPreset('under-1');
                   console.log('Selected preset: under-1, slider values:', { min: 0, max: 1 });
                 }} 
                 className={`px-3 py-2 rounded-md border transition-colors ${
                   selectedPreset === 'under-1' 
                     ? 'bg-gray-300 border-gray-400 text-gray-800' 
                     : 'hover:bg-gray-50'
                 }`}
               >
                 Dưới 1 tỷ
               </button>
               <button 
                 onClick={() => { 
                   setMinBillion(1); 
                   setMaxBillion(3); 
                   setSelectedPreset('1-3');
                   console.log('Selected preset: 1-3, slider values:', { min: 1, max: 3 });
                 }} 
                 className={`px-3 py-2 rounded-md border transition-colors ${
                   selectedPreset === '1-3' 
                     ? 'bg-gray-300 border-gray-400 text-gray-800' 
                     : 'hover:bg-gray-50'
                 }`}
               >
                 1-3 tỷ
               </button>
               <button 
                 onClick={() => { 
                   setMinBillion(3); 
                   setMaxBillion(5); 
                   setSelectedPreset('3-5');
                   console.log('Selected preset: 3-5, slider values:', { min: 3, max: 5 });
                 }} 
                 className={`px-3 py-2 rounded-md border transition-colors ${
                   selectedPreset === '3-5' 
                     ? 'bg-gray-300 border-gray-400 text-gray-800' 
                     : 'hover:bg-gray-50'
                 }`}
               >
                 3-5 tỷ
               </button>
               <button 
                 onClick={() => { 
                   setMinBillion(5); 
                   setMaxBillion(10); 
                   setSelectedPreset('5-10');
                   console.log('Selected preset: 5-10, slider values:', { min: 5, max: 10 });
                 }} 
                 className={`px-3 py-2 rounded-md border transition-colors ${
                   selectedPreset === '5-10' 
                     ? 'bg-gray-300 border-gray-400 text-gray-800' 
                     : 'hover:bg-gray-50'
                 }`}
               >
                 5-10 tỷ
               </button>
               <button 
                 onClick={() => { 
                   setMinBillion(10); 
                   setMaxBillion(20); 
                   setSelectedPreset('10-20');
                   console.log('Selected preset: 10-20, slider values:', { min: 10, max: 20 });
                 }} 
                 className={`px-3 py-2 rounded-md border transition-colors ${
                   selectedPreset === '10-20' 
                     ? 'bg-gray-300 border-gray-400 text-gray-800' 
                     : 'hover:bg-gray-50'
                 }`}
               >
                 10-20 tỷ
               </button>
               <button 
                 onClick={() => { 
                   setMinBillion(20); 
                   setMaxBillion(MAX_BILLION); 
                   setSelectedPreset('over-20');
                   console.log('Selected preset: over-20, slider values:', { min: 20, max: MAX_BILLION });
                 }} 
                 className={`px-3 py-2 rounded-md border transition-colors ${
                   selectedPreset === 'over-20' 
                     ? 'bg-gray-300 border-gray-400 text-gray-800' 
                     : 'hover:bg-gray-50'
                 }`}
               >
                 Trên 20 tỷ
               </button>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { 
                  setMinBillion(MIN_BILLION); 
                  setMaxBillion(MAX_BILLION); 
                  setSelectedPreset('');
                }}
                className="flex-1 bg-gray-100 text-gray-700 font-medium py-2 rounded-md hover:bg-gray-200"
              >
                Đặt lại
              </button>
              <button
                onClick={() => toggleDropdown('priceRange')}
                className="flex-1 bg-gray-600 text-white font-medium py-2 rounded-md hover:bg-gray-700"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>

      {/* city Dropdown */}
      <div className="relative">
        <button
          onClick={() => toggleDropdown('city')}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors min-w-[100px]"
        >
          <span>{filters.city ? getDisplayText('city') : 'Dự án'}</span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {dropdownStates.city && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {cityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  handleFilterChange('city', option.value);
                  toggleDropdown('city');
                }}
                className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-50"
              >
                <span>{option.label}</span>
                {filters.city === option.value && <Check className="h-4 w-4 text-blue-600" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApply}
        disabled={loading}
        className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Đang áp dụng...' : 'Áp dụng'}
      </button>
    </div>
  );
};

export default Filter;
