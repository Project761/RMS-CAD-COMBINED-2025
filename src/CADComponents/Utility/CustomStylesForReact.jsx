export const customTableStyles = {
  cells: {
    style: {
      border: '1px solid #ddd',
      borderBottom: '0px',
      padding: '0px 10px',
      fontWight: '500',
    },
  },
  headCells: {
    style: {
      zIndex: '0',
      backgroundColor: '#F2F2F2',
      fontWight: '500',
      color: '#666666',
      border: '1px solid #ddd',
      borderBottom: '0px',
      padding: '0px 10px'
    },
  },
  rows: {
    style: {
      borderBottom: '1px solid #ddd', // Border for row cells
    },
  },
  table: {
    style: {
      borderCollapse: 'collapse', // Ensure borders collapse into a single border
    },
  },
};

export const coloredStyle_Select = {
  control: (styles) => ({
    ...styles, backgroundColor: "#fce9bf",
    height: 20,
    minHeight: 33,
    fontSize: 14,
    margintop: 2,
    boxShadow: 0,
  }),
  container: (provided) => ({
    ...provided,
    width: '100%',
  }),
};

export const colorLessStyle_Select = {
  control: (styles) => ({
    ...styles,
    height: 20,
    minHeight: 33,
    fontSize: 14,
    margintop: 2,
    boxShadow: 0,
  }),
  container: (provided) => ({
    ...provided,
    width: '100%',
  }),
};

export const coloredStyle_Select_Sort = {
  control: (styles) => ({
    ...styles, backgroundColor: "#001f3f", color: "white",
  }),
  container: (provided) => ({
    ...provided,
    width: '100%',
  }),
};

export const requiredFieldColourStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "#fce9bf",
    // height: 20,
    minHeight: 35,
    fontSize: 14,
    margintop: 2,
    boxShadow: 0,
  }),
};

export const fieldColourStyles = {
  control: (styles) => ({
    ...styles,
    // height: 20,
    minHeight: 35,
    fontSize: 14,
    margintop: 2,
    boxShadow: 0,
  }),
};

export const customStylesWithFixedHeight = {
  ...colorLessStyle_Select, // Include existing styles
  menu: (provided) => ({
    ...provided,
    maxHeight: "200px", // Set the maximum height of the dropdown
    overflowY: "auto",  // Add vertical scroll if content exceeds max height
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "200px", // Ensure the menu list also respects the height
    overflowY: "auto",  // Scroll only if needed
  }),
};

export const multiSelectcolourStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "#fce9bf",
    minHeight: 37,
    fontSize: 14,
    margintop: 2,
    boxShadow: 0,
  }),
  menu: (provided) => ({
    ...provided,
    maxHeight: "140px",
  }), menuList: (provided) => ({
    ...provided,
    maxHeight: "140px",
    overflowY: "auto",
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    transition: "all .2s ease",
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : null
  }),
};

export const customStylesWithOutColor = {
  control: (base) => ({
    ...base,
    height: 20,
    minHeight: 35,
    fontSize: 14,
    marginTop: 2,
    boxShadow: 0,
  }),
};

export const customStylesWithOutColorNew = {
  control: (base) => ({
    ...base,
    height: 20,
    minHeight: 37,
    fontSize: 14,
    marginTop: 2,
    boxShadow: 0,
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    transition: "all .2s ease",
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : null
  }),
};

export const customStylesWithOutColorDrop = {
  control: (base) => ({
    ...base,
    height: 20,
    minHeight: 35,
    fontSize: 14,
    marginTop: 2,
    boxShadow: 0,
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    transition: "all .2s ease",
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : null
  }),
};

export const customStylesWithOutColorArrow = {
  control: base => ({
    ...base,
    // height: 20,
    minHeight: 35,
    fontSize: 14,
    margintop: 2,
    boxShadow: 0,
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    transition: "all .2s ease",
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : null
  }),
  input: (provided) => ({
    ...provided,
    minWidth: '0px',
    maxWidth: '100%',
  }),
};

export const colourStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "#fce9bf",
    height: 20,
    minHeight: 37,
    fontSize: 14,
    margintop: 2,
    boxShadow: 0,
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    transition: "all .2s ease",
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : null
  }),
};

export const colourStylesNoReq = {
  control: (styles) => ({
    ...styles,
    // backgroundColor: "#fce9bf",
    height: 20,
    minHeight: 37,
    fontSize: 14,
    margintop: 2,
    boxShadow: 0,
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    transition: "all .2s ease",
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : null
  }),
};

export const colourStyles1 = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "#fce9bf",
    height: 20,
    minHeight: 37,
    fontSize: 14,
    margintop: 2,
    boxShadow: 0,
  }),
  menu: (provided) => ({
    ...provided,
    maxHeight: "140px",
  }), menuList: (provided) => ({
    ...provided,
    maxHeight: "140px",
    overflowY: "auto",
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    transition: "all .2s ease",
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : null
  }),
};
