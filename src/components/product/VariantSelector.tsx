import React from 'react';
import { VariantOption } from '../../types/api';
import { VariantSelection } from '../../hooks/product/useProductVariants';

interface VariantSelectorProps {
  variantOptions: VariantOption[];
  selectedVariant: VariantSelection;
  onVariantChange: (optionName: string, value: string) => void;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  variantOptions,
  selectedVariant,
  onVariantChange,
}) => {
  if (!variantOptions || variantOptions.length === 0) {
    return null;
  }

  // Sort options by order
  const sortedOptions = [...variantOptions].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {sortedOptions.map((option) => {
        const sortedValues = [...option.variant_option_values].sort((a, b) => a.order_key - b.order_key);
        const selectedValue = selectedVariant[option.option_name];

        return (
          <div key={option.option_uid} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {option.option_name}
              </label>
              {selectedValue && (
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Selected: {selectedValue}
                </span>
              )}
            </div>

            {/* Render different UI based on option type */}
            {option.option_name.toLowerCase() === 'color' ? (
              // Color swatches
              <div className="flex flex-wrap gap-3">
                {sortedValues.map((value) => {
                  const isSelected = selectedValue === value.option_value;
                  return (
                    <button
                      key={value.option_value_uid}
                      onClick={() => onVariantChange(option.option_name, value.option_value)}
                      className={`group relative px-6 py-3 rounded-lg border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 shadow-md scale-105'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm'
                      }`}
                      title={value.option_value}
                    >
                      {/* Color indicator if option has color code */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium transition-colors ${
                            isSelected
                              ? 'text-blue-700 dark:text-blue-300'
                              : 'text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                          }`}
                        >
                          {value.option_value}
                        </span>
                        {isSelected && (
                          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : option.option_name.toLowerCase() === 'size' ? (
              // Size buttons
              <div className="flex flex-wrap gap-3">
                {sortedValues.map((value) => {
                  const isSelected = selectedValue === value.option_value;
                  return (
                    <button
                      key={value.option_value_uid}
                      onClick={() => onVariantChange(option.option_name, value.option_value)}
                      className={`group relative min-w-[60px] px-5 py-3 rounded-lg border-2 font-semibold text-sm transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white shadow-lg scale-105'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                      }`}
                    >
                      <span className="relative z-10">{value.option_value}</span>
                      {isSelected && (
                        <svg className="absolute top-1 right-1 w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              // Default dropdown for other types
              <select
                value={selectedValue || ''}
                onChange={(e) => onVariantChange(option.option_name, e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="">Select {option.option_name}</option>
                {sortedValues.map((value) => (
                  <option key={value.option_value_uid} value={value.option_value}>
                    {value.option_value}
                  </option>
                ))}
              </select>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default VariantSelector;

