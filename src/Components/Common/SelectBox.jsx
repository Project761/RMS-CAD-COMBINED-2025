import PropTypes from "prop-types";
import { default as ReactSelect } from "react-select";

const SelectBox = props => {

  if (props.allowSelectAll) {
    return (
      <ReactSelect
        {...props}
        options={[props.allOption, ...props.options]}
        isDisabled={props?.isDisabled}
        onChange={selected => {
          if (selected !== null && selected.length > 0 && selected[selected.length - 1].value === props.allOption.value) {
            return props.onChange(props.options);
          }
          return props.onChange(selected);
        }}
      />
    );
  }

  return <ReactSelect {...props} />;
};

SelectBox.propTypes = {
  options: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
  allowSelectAll: PropTypes.bool,
  allOption: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.number
  }),
  isDisabled: PropTypes.bool
};

SelectBox.defaultProps = {
  allOption: {
    label: "Select all",
    value: "*"
  },
  isDisabled: false,
};

export default SelectBox;
