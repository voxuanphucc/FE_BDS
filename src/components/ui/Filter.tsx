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
    city: null
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

  const priceRangeOptions = [
    { value: '0-500', label: 'Dưới 500 triệu', from: 0, to: 500000000 },
    { value: '500-1000', label: '500 triệu - 1 tỷ', from: 500000000, to: 1000000000 },
    { value: '1000-2000', label: '1 tỷ - 2 tỷ', from: 1000000000, to: 2000000000 },
    { value: '2000-5000', label: '2 tỷ - 5 tỷ', from: 2000000000, to: 5000000000 },
    { value: '5000+', label: 'Trên 5 tỷ', from: 5000000000, to: null } // null means no upper limit
  ];

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
    // Convert price range to actual values
    const selectedPriceRange = priceRangeOptions.find(option => option.value === filters.priceRange);
    const filterData: FilterData = {
      ...filters,
      priceFrom: selectedPriceRange?.from,
      priceTo: selectedPriceRange?.to
    };
    console.log('Applying filters:', filterData);
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
        return priceRangeOptions.find(opt => opt.value === value)?.label || value;
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
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors min-w-[100px]"
        >
          <span>{filters.priceRange ? getDisplayText('priceRange') : 'Giá bán'}</span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {dropdownStates.priceRange && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {priceRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  handleFilterChange('priceRange', option.value);
                  toggleDropdown('priceRange');
                }}
                className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-50"
              >
                <span>{option.label}</span>
                {filters.priceRange === option.value && <Check className="h-4 w-4 text-blue-600" />}
              </button>
            ))}
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
