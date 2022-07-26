import React, { useState } from "react";
import Select from "react-select";

const customStyles = {
    input: (base) => ({
      ...base,
      color: "inherit"
    }),
    option: (base, state) => ({
      ...base,
      color: state.isFocused ? "white": "black",
      backgroundColor: state.isFocused ? "#216ba5" : "white"
    }),
    control: (base, state) => ({
      ...base,
      background: "inherit",
      borderColor: state.isFocused ? "white" : "white",
      borderRadius: state.isFocused ? 0 : 0,
      boxShadow: state.isFocused ? null : null,
      "&:hover": {
        color: "white"
      }
    }),
    singleValue: (base) => ({
      ...base,
      color: "inherit"
    }),
    dropdownIndicator: (base) => ({
      ...base,
      "&:hover": {
        color: "white"
      }
    })
  };

const DropDownFilter = ({ options }) => {
    const [selectedProfile, setSelectedProfile] = useState(options[0]);

    return(
        <Select 
            options={options}
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target)}
            placeholder="Select a profile.."
            styles={customStyles}
        />
    )
}

export default DropDownFilter;