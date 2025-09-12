/* eslint-disable react/forbid-elements */
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

function ChipInput({ tagState, setTagState, isError, geoLocationID }) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTags(inputValue);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    addTags(pastedText);
  };

  const addTags = (value) => {
    const trimmedValue = value.trim();
    if (trimmedValue !== "") {
      const chipsToAdd = trimmedValue.split(",").map((chip) => chip.trim());
      setTagState([...tagState, ...chipsToAdd]);
      setInputValue("");
    }
  };

  const handleChipDelete = (chipIndex) => {
    setTagState(tagState.filter((_, index) => index !== chipIndex));
  };

  //   const nonEmptyTags = tagState.filter((tag) => tag?.trim() === "");

  return (
    <div
      className="d-flex align-items-center w-100"
      style={{
        backgroundColor: "#fff",
        fontSize: "12px",
        border: "1px solid #E8E9E9",
      }}
    >
      <div className="d-flex flex-wrap w-100 remove-input-border">
        {tagState.map((chip, index) => (
          <div
            key={index}
            style={{ backgroundColor: "#E8E9E9", fontSize: "12px" }}
            className="rounded-pill px-1 m-1 d-flex align-items-center"
          >
            {chip}
            <div
              style={{ marginLeft: "4px" }}
              onClick={() => handleChipDelete(index)}
            >
              {/* &times; */}
              <FontAwesomeIcon
                icon={faClose}
                style={{ cursor: "pointer", fontSize: "12px" }}
              />
            </div>
          </div>
        ))}
        <input
          value={inputValue}
          type="number"
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onPaste={handlePaste}
          disabled={!geoLocationID}
          maxLength={10}
          style={{ width: "auto" }}
          className={`form-control-remove-border form-control py-1 new-input requiredColor ${tagState.length > 0 ? "w-25 " : "w-100 "
            }`}
        />
      </div>
      <div
        style={{ fontSize: "12px", marginLeft: "-12px", marginTop: "4px" }}
        onClick={() => {
          setTagState([]);
          setInputValue("");
        }}
      >
        {/* &times; */}
        <FontAwesomeIcon icon={faClose} style={{ cursor: "pointer" }} />
      </div>
    </div>
  );
}
export default ChipInput;

// PropTypes definition
ChipInput.propTypes = {
  tagState: PropTypes.array.isRequired,
  setTagState: PropTypes.func.isRequired,
  isError: PropTypes.bool,
  geoLocationID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

// Default props
ChipInput.defaultProps = {
  isError: false,
  geoLocationID: null
};
