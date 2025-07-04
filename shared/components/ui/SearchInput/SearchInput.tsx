import { Input, Select } from "antd";
import { FC, useEffect, useState } from "react";

interface IProps {
  placeholder: string;
  value?: string;
  data?: string[];
  className?: string;
  handleSearch: (value: string) => void;
  handleChange: (value: string) => void;
}

const SearchInput: FC<IProps> = (props) => {

  return (
    <CustomSelect
    {...props}
    // className={className}
    // showSearch
    // value={value}
    // placeholder={placeholder}
    // defaultActiveFirstOption={false}
    // suffixIcon={null}
    // filterOption={false}
    // onSearch={handleSearch}
    // onChange={handleChange}
    // notFoundContent={null}
    // options={(data || []).map((d) => ({
    //   value: d,
    //   label: d,
    // }))}
    />
  );
};

export default SearchInput;

const CustomSelect: FC<IProps> = (props) => {
  const { className, placeholder, value, data, handleSearch, handleChange } =
    props;

  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSelectChange = (val:string) => {
    setInputValue(val);
    handleChange(val)
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    setInputValue(value ?? "");
  }, [value]);

  // className={className}
  // showSearch
  // value={value}
  // placeholder={placeholder}
  // defaultActiveFirstOption={false}
  // suffixIcon={null}
  // filterOption={false}
  // onSearch={handleSearch}
  // onChange={handleChange}
  // notFoundContent={null}
  // options={(data || []).map((d) => ({
  //   value: d,
  //   label: d,
  // }))}

  return (
    <Select
      className={className}
      showSearch
      value={value}
      onChange={handleSelectChange}
      placeholder={placeholder}
      defaultActiveFirstOption={false}
      suffixIcon={null}
      filterOption={false}
      onSearch={handleSearch}
      // onChange={handleChange}
      notFoundContent={null}
      dropdownRender={(menu) => (
        <div>
          {menu}
          {isEditing ? (
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              autoFocus
              style={{ margin: "8px", width: "90%" }}
            />
          ) : (
            <div
              style={{
                padding: "8px",
                cursor: "pointer",
                textAlign: "center",
                background: "#fafafa",
              }}
              onClick={handleEditClick}
            >
              Редактировать
            </div>
          )}
        </div>
      )}
      style={{ width: "100%" }}
          options={(data || []).map((d) => ({
      value: d,
      label: d,
    }))}
    >
      {/* <Option value="Длинное название маршрута 1">
        Длинное название маршрута 1
      </Option>
      <Option value="Длинное название маршрута 2">
        Длинное название маршрута 2
      </Option> */}
    </Select>
  );
};
