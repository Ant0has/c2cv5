import { Select } from 'antd';
import { FC } from 'react';

interface IProps {
  placeholder: string;
  value?: string
  data?: string[]
  className?: string
  handleSearch: (value: string) => void,
  handleChange: (value: string) => void
}

const SearchInput: FC<IProps> = (props) => {
  const {
    className,
    placeholder,
    value,
    data,
    handleSearch,
    handleChange
  } = props

  return (
    <Select
      className={className}
      showSearch
      value={value}
      placeholder={placeholder}
      defaultActiveFirstOption={false}
      suffixIcon={null}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={null}
      options={(data || []).map((d) => ({
        value: d,
        label: d,
      }))}
    />
  );
};

export default SearchInput;