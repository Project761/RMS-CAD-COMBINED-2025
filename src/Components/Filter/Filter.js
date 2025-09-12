import moment from 'moment';
import Isequal from '../../img/Isequal.png'
import Isnotequal from '../../img/Isnotequal.png'
import Contains from '../../img/Contains.png'


export const Filter = (data, searchValue1, searchValue2, type, firstFieldValue, secondfirstFieldValue) => {
  if (type === "Contains") {
    if (searchValue1 === "" && searchValue2 === "") {
      return data;
    } else {
      const result = data.filter((item) => {
        if (item[firstFieldValue] && item[secondfirstFieldValue]) {
          if (searchValue1 && searchValue2 === '') {
            return item[firstFieldValue]?.toLowerCase().includes(searchValue1.toLowerCase())
          } else if (searchValue2 && searchValue1 === '') {
            return item[secondfirstFieldValue]?.toLowerCase().includes(searchValue2.toLowerCase())
          } else if (searchValue1 && searchValue2) {
            return item[firstFieldValue]?.toLowerCase().includes(searchValue1.toLowerCase()) && item[secondfirstFieldValue]?.toLowerCase().includes(searchValue2.toLowerCase());
          }
        }
      });
      return result;
    }
  }
  if (type === "is equal to") {
    if (searchValue1 === "" && searchValue2 === "") {
      return data;
    } else {
      const result = data.filter((item) => {
        if (item[firstFieldValue] && item[secondfirstFieldValue]) {
          if (searchValue1) {
            return item[firstFieldValue]?.toLowerCase() === searchValue1.toLowerCase()
          } else if (searchValue2) {
            return item[secondfirstFieldValue]?.toLowerCase() === searchValue2.toLowerCase()
          }
        }
        if (searchValue1 && searchValue2) {
          return item[firstFieldValue]?.toLowerCase() === searchValue1.toLowerCase() && item[secondfirstFieldValue]?.toLowerCase() === searchValue2.toLowerCase()
        }
      });
      return result;
    }
  }
  if (type === "is not equal to") {
    if (searchValue1 === "" && searchValue2 === "") {
      return data;
    } else {
      const result = data.filter((item) => {
        if (item[firstFieldValue] && item[secondfirstFieldValue]) {
          if (searchValue1) {
            return item[firstFieldValue]?.toLowerCase() !== searchValue1.toLowerCase()
          } else if (searchValue2) {
            return item[secondfirstFieldValue]?.toLowerCase() !== searchValue2.toLowerCase()
          }
          if (searchValue1 && searchValue2) {
            return item[firstFieldValue]?.toLowerCase() !== searchValue1.toLowerCase() && item[secondfirstFieldValue]?.toLowerCase() !== searchValue2.toLowerCase()
          }
        }
      });
      return result;
    }
  }
  if (type === "Starts With") {
    if (searchValue1 === "" && searchValue2 === "") {
      return data;
    } else {
      const result = data.filter((item) => {
        if (item[firstFieldValue] && item[secondfirstFieldValue]) {
          if (searchValue1) {
            return String(item[firstFieldValue]?.toLowerCase()).startsWith(searchValue1.toLowerCase())
          } else if (searchValue2) {
            return String(item[secondfirstFieldValue]?.toLowerCase()).startsWith(searchValue2.toLowerCase())
          }
        }
        if (searchValue1 && searchValue2) {
          return String(item[firstFieldValue]?.toLowerCase()).startsWith(
            searchValue1.toLowerCase()) && String(item[secondfirstFieldValue]?.toLowerCase()).startsWith(
              searchValue2.toLowerCase()
            );
        }
      });
      return result;
    }
  }
  if (type === "End with") {
    if (searchValue1 === "" && searchValue2 === "") {
      return data;
    } else {
      const result = data.filter((item) => {
        if (item[firstFieldValue] && item[secondfirstFieldValue]) {
          if (searchValue1) {
            return String(item[firstFieldValue]?.toLowerCase()).endsWith(searchValue1.toLowerCase())
          } else if (searchValue2) {
            return String(item[secondfirstFieldValue]?.toLowerCase()).endsWith(searchValue2.toLowerCase())
          }
          if (searchValue1 && searchValue2) {
            return String(item[firstFieldValue]?.toLowerCase()).endsWith(
              searchValue1.toLowerCase()) && String(item[secondfirstFieldValue]?.toLowerCase()).endsWith(
                searchValue2.toLowerCase())
          }
        }
      });
      return result;
    }
  }
};

export const Three_Search_Filter = (data, searchValue1, searchValue2, searchValue3, type, firstFieldValue, secondfirstFieldValue, thrdFieldValue) => {
  if (type === "Contains") {
    if (searchValue1 === "" && searchValue2 === "" && searchValue3 === "") {
      return data;
    } else {
      const result = data.filter((item) => {
        if (item[firstFieldValue] || item[secondfirstFieldValue] || item[thrdFieldValue]) {
          if (searchValue1 && searchValue2 === '' && searchValue3 === '') {
            return item[firstFieldValue]?.toLowerCase().includes(searchValue1.toLowerCase())
          }
          else if (searchValue2 && searchValue1 === '' && searchValue3 === '') {
            return item[secondfirstFieldValue]?.toLowerCase().includes(searchValue2.toLowerCase())
          }
          else if (searchValue3 && searchValue1 === '' && searchValue2 === '') {
            return item[thrdFieldValue]?.toLowerCase().includes(searchValue3.toLowerCase())
          }
          else if (searchValue1 && searchValue2) {
            return item[firstFieldValue]?.toLowerCase().includes(searchValue1.toLowerCase()) && item[secondfirstFieldValue]?.toLowerCase().includes(searchValue2.toLowerCase());
          }
          else if (searchValue1 && searchValue3) {
            return item[firstFieldValue]?.toLowerCase().includes(searchValue1.toLowerCase()) && item[thrdFieldValue]?.toLowerCase().includes(searchValue3.toLowerCase());
          }
          else if (searchValue2 && searchValue3) {
            return item[secondfirstFieldValue]?.toLowerCase().includes(searchValue2.toLowerCase()) && item[thrdFieldValue]?.toLowerCase().includes(searchValue3.toLowerCase());
          }
          else if (searchValue1 && searchValue2 && searchValue3) {
            return item[firstFieldValue]?.toLowerCase().includes(searchValue1.toLowerCase()) && item[secondfirstFieldValue]?.toLowerCase().includes(searchValue2.toLowerCase()) && item[thrdFieldValue]?.toLowerCase().includes(searchValue3.toLowerCase());
          }
        }
      });
      return result;
    }
  }
  if (type === "is equal to") {
    if (searchValue1 === "" && searchValue2 === "") {
      return data;
    } else {
      const result = data.filter((item) => {
        if (item[firstFieldValue] && item[secondfirstFieldValue]) {
          if (searchValue1) {
            return item[firstFieldValue]?.toLowerCase() === searchValue1.toLowerCase()
          } else if (searchValue2) {
            return item[secondfirstFieldValue]?.toLowerCase() === searchValue2.toLowerCase()
          }
          if (searchValue1 && searchValue2) {
            return item[firstFieldValue]?.toLowerCase() === searchValue1.toLowerCase() && item[secondfirstFieldValue]?.toLowerCase() === searchValue2.toLowerCase()
          }
        }
      });
      return result;
    }
  }
  if (type === "is not equal to") {
    const result = data.filter((item) => {
      if (item[firstFieldValue] && item[secondfirstFieldValue]) {
        if (searchValue1) {
          return item[firstFieldValue]?.toLowerCase() !== searchValue1.toLowerCase()
        } else if (searchValue2) {
          return item[secondfirstFieldValue]?.toLowerCase() !== searchValue2.toLowerCase()
        }
        if (searchValue1 && searchValue2) {
          return item[firstFieldValue]?.toLowerCase() !== searchValue1.toLowerCase() && item[secondfirstFieldValue]?.toLowerCase() !== searchValue2.toLowerCase()
        }
      }
    });
    return result;
  }
  if (type === "Starts With") {
    const result = data.filter((item) => {
      if (item[firstFieldValue] && item[secondfirstFieldValue]) {
        if (searchValue1) {
          return String(item[firstFieldValue]?.toLowerCase()).startsWith(searchValue1.toLowerCase())
        } else if (searchValue2) {
          return String(item[secondfirstFieldValue]?.toLowerCase()).startsWith(searchValue2.toLowerCase())
        }
        if (searchValue1 && searchValue2) {
          return String(item[firstFieldValue]?.toLowerCase()).startsWith(
            searchValue1.toLowerCase()) && String(item[secondfirstFieldValue]?.toLowerCase()).startsWith(
              searchValue2.toLowerCase()
            );
        }
      }
    });
    return result;
  }
  if (type === "End with") {
    const result = data.filter((item) => {
      if (item[firstFieldValue] && item[secondfirstFieldValue]) {
        if (searchValue1) {
          return String(item[firstFieldValue]?.toLowerCase()).endsWith(searchValue1.toLowerCase())
        } else if (searchValue2) {
          return String(item[secondfirstFieldValue]?.toLowerCase()).endsWith(searchValue2.toLowerCase())
        }
        if (searchValue1 && searchValue2) {
          return String(item[firstFieldValue]?.toLowerCase()).endsWith(
            searchValue1.toLowerCase()) && String(item[secondfirstFieldValue]?.toLowerCase()).endsWith(
              searchValue2.toLowerCase())
        }
      }
    });
    return result;
  }
};

export const One_Search_Filter = (data, searchValue, type, firstFieldValue, secondfirstFieldValue) => {
  if (type === "Contains") {
    if (searchValue === "") {
      return data;
    } else {
      const result = data.filter((item) => {
        if (item[firstFieldValue] && item[secondfirstFieldValue]) {
          return item[firstFieldValue]?.toLowerCase().includes(searchValue.toLowerCase()) || item[secondfirstFieldValue]?.toLowerCase().includes(searchValue.toLowerCase());
        }
      });
      return result;
    }
  }
  if (type === "is equal to") {
    if (searchValue === "") {
      return data;
    } else {
      const result = data.filter((item) => {
        if (item[firstFieldValue] && item[secondfirstFieldValue]) {
          return item[firstFieldValue]?.toLowerCase() === searchValue.toLowerCase() || item[secondfirstFieldValue]?.toLowerCase() === searchValue.toLowerCase()
        }
      });
      return result;
    }
  }
  if (type === "is not equal to") {
    const result = data.filter((item) => {
      if (item[firstFieldValue] && item[secondfirstFieldValue]) {
        return item[firstFieldValue]?.toLowerCase() !== searchValue.toLowerCase()
      }
    });
    return result;
  }
  if (type === "Starts With") {
    const result = data.filter((item) => {
      if (item[firstFieldValue] && item[secondfirstFieldValue]) {
        return String(item[firstFieldValue]?.toLowerCase()).startsWith(
          searchValue.toLowerCase()) || String(item[secondfirstFieldValue]?.toLowerCase()).startsWith(
            searchValue.toLowerCase()
          );
      }
    });
    return result;
  }
  if (type === "End with") {
    const result = data.filter((item) => {
      if (item[firstFieldValue] && item[secondfirstFieldValue]) {
        return String(item[firstFieldValue]?.toLowerCase()).endsWith(
          searchValue.toLowerCase()) || String(item[secondfirstFieldValue]?.toLowerCase()).endsWith(
            searchValue.toLowerCase())
      }
    });
    return result;
  }
};

export const One_Search_Filter_OneValue = (data, searchValue, type, firstFieldValue) => {
  if (type === "Contains") {
    if (searchValue === "") {
      return data;
    } else {
      const result = data.filter((item) => {
        if (item[firstFieldValue])
          return item[firstFieldValue]?.toLowerCase().includes(searchValue.toLowerCase())
      });
      return result;
    }
  }
};

export const One_Value_Search_Filter = (data, searchValue, type, firstFieldValue) => {
  if (type === "Contains") {
    if (searchValue === "") {
      return data;
    } else {
      const result = data?.filter((item) => {
        if (item[firstFieldValue]) {
          return item[firstFieldValue]?.toLowerCase().includes(searchValue.toLowerCase())
        }
      });
      return result;
    }
  }
  if (type === "is equal to") {
    if (searchValue === "") {
      return data;
    } else {
      const result = data.filter((item) => {
        if (item[firstFieldValue]) {
          return item[firstFieldValue]?.toLowerCase() === searchValue.toLowerCase()
        }
      });
      return result;
    }
  }
  if (type === "is not equal to") {
    const result = data.filter((item) => {
      if (item[firstFieldValue]) {
        return item[firstFieldValue]?.toLowerCase() !== searchValue.toLowerCase()
      }
    });
    return result;
  }
  if (type === "Starts With") {
    const result = data.filter((item) => {
      if (item[firstFieldValue]) {
        return String(item[firstFieldValue]?.toLowerCase()).startsWith(
          searchValue.toLowerCase())
      }
    });
    return result;
  }
  if (type === "End with") {
    const result = data.filter((item) => {
      if (item[firstFieldValue]) {
        return String(item[firstFieldValue]?.toLowerCase()).endsWith(
          searchValue.toLowerCase())
      }
    });
    return result;
  }
};

export const Three_Search_FilterWith_Date = (data, searchValue1, searchValue2, searchValue3, type1, type2, type3, firstFieldValue, secondfirstFieldValue, thrdFieldValue) => {

  if (type1 === "Contains" && type2 === "Contains" && type3 === "Contains") {
    if (!searchValue1 && !searchValue2 && !searchValue3) {
      return data;
    }
    else {
      const result = data.filter((item) => {
        if (item[firstFieldValue] && item[secondfirstFieldValue] && item[thrdFieldValue]) {
          if (searchValue1 && searchValue2 === '' && searchValue3 === '') {
            return item[firstFieldValue]?.includes(searchValue1)
          }
          else if (searchValue2 && searchValue1 === '' && searchValue3 === '') {
            return item[secondfirstFieldValue]?.toLowerCase().includes(searchValue2.toLowerCase())
          }
          else if (searchValue3 && searchValue1 === '' && searchValue2 === '') {
            return new Date(item[thrdFieldValue]).includes(searchValue3);
          }
          else if (searchValue1 && searchValue2 && searchValue3 === "" || searchValue3 === null) {
            return item[firstFieldValue]?.toLowerCase().includes(searchValue1.toLowerCase()) && item[secondfirstFieldValue]?.toLowerCase().includes(searchValue2.toLowerCase());
          }
          else if (searchValue1 && searchValue3 && searchValue2 === '') {
            return item[firstFieldValue]?.toLowerCase().includes(searchValue1.toLowerCase()) && item[thrdFieldValue]?.toLowerCase().includes(searchValue3.toLowerCase());
          }
          else if (searchValue2 && searchValue3 && searchValue1 === '') {
            return item[secondfirstFieldValue]?.toLowerCase().includes(searchValue2.toLowerCase()) && item[thrdFieldValue]?.toLowerCase().includes(searchValue3.toLowerCase());
          }
          else if (searchValue1 && searchValue2 && searchValue3) {
            return item[firstFieldValue]?.toLowerCase().includes(searchValue1.toLowerCase()) && item[secondfirstFieldValue]?.toLowerCase().includes(searchValue2.toLowerCase()) && moment(item[thrdFieldValue]).format("MM/DD/YYYY") === moment(searchValue3).format("MM/DD/YYYY")
          }
        }
      });
      return result;
    }
  }

  if (type1 === "Contains" && type2 === "is equal to" && type3 === "Contains") {
    if (!searchValue1 && !searchValue2 && !searchValue3) {
      return data;
    } else {
      const result = data.filter((item) => {
        if (item[firstFieldValue] && item[secondfirstFieldValue] && item[thrdFieldValue]) {
          if (searchValue1 && searchValue2 === '' && searchValue3 === '') {
            return item[firstFieldValue]?.includes(searchValue1)
          }
          else if (searchValue2 && searchValue1 === '' && searchValue3 === '') {
            return item[secondfirstFieldValue]?.toLowerCase() === searchValue2.toLowerCase()
          }
          else if (searchValue3 && searchValue1 === '' && searchValue2 === '') {
            return new Date(item[thrdFieldValue]).includes(searchValue3)
          }
          else if (searchValue1 && searchValue2 && searchValue3 === "" || searchValue3 === null) {
            return item[firstFieldValue]?.toLowerCase().includes(searchValue1.toLowerCase()) && item[secondfirstFieldValue]?.toLowerCase() === searchValue2.toLowerCase()
          }
          else if (searchValue1 && searchValue3 && searchValue2 === '') {
            return item[firstFieldValue]?.toLowerCase().includes(searchValue1.toLowerCase()) && item[thrdFieldValue]?.toLowerCase().includes(searchValue3.toLowerCase());
          }
          else if (searchValue2 && searchValue3 && searchValue1 === '') {
            return item[secondfirstFieldValue]?.toLowerCase() === searchValue2.toLowerCase() && item[thrdFieldValue]?.toLowerCase().includes(searchValue3.toLowerCase());
          }
          else if (searchValue1 && searchValue2 && searchValue3) {
            return item[firstFieldValue]?.toLowerCase().includes(searchValue1.toLowerCase()) && item[secondfirstFieldValue]?.toLowerCase() === searchValue2.toLowerCase() && moment(item[thrdFieldValue]).format("MM/DD/YYYY") === moment(searchValue3).format("MM/DD/YYYY")
          }
        }
      });
      return result;
    }
  }
};

// Retrun Icon
export const SendIcon = (name) => {
  const filterIcon = { 'Contains': Contains, 'is equal to': Isequal, 'is not equal to': Isnotequal, 'Starts With': Contains, 'End with': Contains }
  return filterIcon[name]
}
