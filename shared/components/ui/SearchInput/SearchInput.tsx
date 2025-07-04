import { Input, Select } from "antd";
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
  const { data, value, className, placeholder, handleChange, handleSearch } =
    props;
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSelectChange = (val: string) => {
    setInputValue(val);
    handleChange(val);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    setInputValue(value ?? "");
  }, [value]);

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
            <div style={{
              display:'grid',
              gridTemplateColumns:'70% 30%',
              alignItems:'center'
            }}>
            <Input
              value={inputValue}
              onChange={handleInputChange}
              // onBlur={handleInputBlur}
              autoFocus
              onKeyDown={(e)=>{
                if(e.key==='Enter'){
                  handleChange(inputValue)
                }
              }}
              style={{ margin: "8px", width: "90%" }}
            />
            <div style={{cursor:'pointer'}} onClick={()=>{
              handleChange(inputValue)
              setIsEditing(false);
            }}>Сохранить</div>
            </div>
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
    </Select>
  );
};

export default SearchInput;
