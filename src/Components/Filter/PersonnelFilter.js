// Personnel Name Filter
export const Personnel_Name_Filter = (data, searchValue, type) => {
  if (type === "Contains") {
    const result = data.filter((item) => {
      return item.FirstName.includes(searchValue);
    });
    return result;
  }
  if (type === "is equal to") {
    const result = data.filter((item) => {
      return item.FirstName === searchValue;
    });
    return result;
  }
  if (type === "is not equal to") {
    const result = data.filter((item) => {
      return item.FirstName !== searchValue;
    });
    return result;
  }
  if (type === "End with") {
    const result = data.filter((item) =>
      String(item.FirstName).endsWith(searchValue)
    );
    return result;
  }
  if (type === "Starts With") {
    const result = data.filter((item) =>
      String(item.FirstName).startsWith(searchValue)
    );
    return result;
  }
};

// Personal Field Permision Filter
export const Personal_Field_Permistion_Filter = (data, searchValue) => {
  const result = data.filter((item) => {
    return item.Description === searchValue;
  });
  return result;
};
