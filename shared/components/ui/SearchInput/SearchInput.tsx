import { Input, AutoComplete } from "antd";
import { ChangeEvent, FC, useEffect, useState } from "react";

interface IProps {
  placeholder: string;
  value?: string;
  data?: string[];
  className?: string;
  handleSearch: (value: string) => void;
  handleChange: (value: string) => void;
}

const SearchInput: FC<IProps> = (props) => {
  const { data, value, className, placeholder, handleChange, handleSearch } = props;
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    handleSearch(val);
    setIsDropdownVisible(true);
  };

  const handleSelect = (val: string) => {
    setInputValue(val);
    handleChange(val);
    setIsDropdownVisible(false);
  };

  const handleInputBlur = () => {
    setIsDropdownVisible(false);
  };

  const handleInputFocus = () => {
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleChange(inputValue);
    }
  };

  useEffect(() => {
    setInputValue(value ?? "");
  }, [value]);

  useEffect(() => {
    // Преобразуем данные в формат для AutoComplete
    if (data && data.length > 0) {
      setOptions(data.map(item => ({ value: item })));
    } else {
      setOptions([]);
    }
  }, [data]);

  return (
    <AutoComplete
      className={className}
      value={inputValue}
      options={options}
      onChange={handleInputChange}
      onSelect={handleSelect}
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
      open={isDropdownVisible && options.length > 0}
      filterOption={false}
      style={{
        width: "100%",
        height:76,
      }}
    >
      <Input
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        style={{
          fontSize:20,
        }}
        allowClear
      />
    </AutoComplete>
  );
};

export default SearchInput;