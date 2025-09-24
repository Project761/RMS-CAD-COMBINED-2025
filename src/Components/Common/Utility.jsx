import moment from 'moment'
import {
  Alignment, Autoformat, AutoImage, Autosave, BlockQuote, Bold, Bookmark, CloudServices, Code, CodeBlock, Essentials, FontBackgroundColor, FontColor, FontFamily, FontSize, Heading, Highlight, HorizontalLine, ImageBlock, ImageCaption, ImageEditing, ImageInline, ImageInsertViaUrl, ImageResize, ImageStyle, ImageToolbar, ImageUpload, ImageUtils, Indent, IndentBlock, Italic, Link, LinkImage, List, ListProperties, Paragraph, RemoveFormat, SpecialCharacters, SpecialCharactersArrows, SpecialCharactersCurrency, SpecialCharactersEssentials, SpecialCharactersLatin, SpecialCharactersMathematical, SpecialCharactersText, Strikethrough, Subscript, Superscript, TextTransformation, TodoList, Underline,
} from 'ckeditor5';

const CryptoJS = require("crypto-js");

let randomize = require('randomatic');

export const getUcrReportUrl = (domain, reportType) => {
  switch (domain) {
    case 'https://rmsdemo.newinblue.com': {
      switch (reportType) {
        case 'sexualAssault': {
          return 'C:\\inetpub\\wwwroot\\rmsdemoapi.newinblue.com\\Imagefolder\\UCR-7-SEXUALASSAULT.pdf';
        }
        case 'hateCrime': {
          return 'C:\\inetpub\\wwwroot\\rmsdemoapi.newinblue.com\\Imagefolder\\UCR-23-HATECRIME.pdf';
        }
        case 'FamilyViolence': {
          return 'C:\\inetpub\\wwwroot\\rmsdemoapi.newinblue.com\\Imagefolder\\UCR-10-FAMILYVIOLENCE.pdf';
        }
        default: return 'C:\\inetpub\\wwwroot\\rmsdemoapi.newinblue.com\\Imagefolder\\UCR-10-FAMILYVIOLENCE.pdf';
      }
    }
    case 'https://rmsdev.newinblue.com': {
      switch (reportType) {
        case 'sexualAssault': {
          return 'C:\\inetpub\\wwwroot\\rmsapidev.newinblue.com\\Imagefolder\\UCR-7-SEXUALASSAULT.pdf';
        }
        case 'hateCrime': {
          return 'C:\\inetpub\\wwwroot\\rmsapidev.newinblue.com\\Imagefolder\\UCR-23-HATECRIME.pdf';
        }
        case 'FamilyViolence': {
          return 'C:\\inetpub\\wwwroot\\rmsapidev.newinblue.com\\Imagefolder\\UCR-10-FAMILYVIOLENCE.pdf';
        }
        default:
          return 'C:\\inetpub\\wwwroot\\rmsapidev.newinblue.com\\Imagefolder\\UCR-10-FAMILYVIOLENCE.pdf';
      }
    }
    // C:\\inetpub\\wwwroot\\rmspreprodapi.newinblue.com
    case 'https://rmspreprod.newinblue.com': {
      switch (reportType) {
        case 'sexualAssault': {
          return 'C:\\inetpub\\wwwroot\\rmspreprodapi.newinblue.com\\Imagefolder\\UCR-7-SEXUALASSAULT.pdf';
        }
        case 'hateCrime': {
          return 'C:\\inetpub\\wwwroot\\rmspreprodapi.newinblue.com\\Imagefolder\\UCR-23-HATECRIME.pdf';
        }
        case 'FamilyViolence': {
          return 'C:\\inetpub\\wwwroot\\rmspreprodapi.newinblue.com\\Imagefolder\\UCR-10-FAMILYVIOLENCE.pdf';
        }
        default:
          return 'C:\\inetpub\\wwwroot\\rmspreprodapi.newinblue.com\\Imagefolder\\UCR-10-FAMILYVIOLENCE.pdf';
      }
    }
    case 'https://rmsgoldline.com': {
      switch (reportType) {
        case 'sexualAssault': {
          return 'C:\\HostingSpaces\\admin\\apigoldline.com\\wwwroot\\Imagefolder\\UCR-7-SEXUALASSAULT.pdf';
        }
        case 'hateCrime': {
          return 'C:\\HostingSpaces\\admin\\apigoldline.com\\wwwroot\\Imagefolder\\UCR-23-HATECRIME.pdf';
        }
        case 'FamilyViolence': {
          return 'C:\\HostingSpaces\\admin\\apigoldline.com\\wwwroot\\Imagefolder\\UCR-10-FAMILYVIOLENCE.pdf';
        }
        default:
          return 'C:\\HostingSpaces\\admin\\apigoldline.com\\wwwroot\\Imagefolder\\UCR-10-FAMILYVIOLENCE.pdf';
      }
    }
    case 'http://localhost:3000': {
      switch (reportType) {
        case 'sexualAssault': {
          return 'C:\\HostingSpaces\\admin\\apigoldline.com\\wwwroot\\Imagefolder\\UCR-7-SEXUALASSAULT.pdf';
        }
        case 'hateCrime': {
          return 'C:\\HostingSpaces\\admin\\apigoldline.com\\wwwroot\\Imagefolder\\UCR-23-HATECRIME.pdf';
        }
        case 'FamilyViolence': {
          return 'C:\\HostingSpaces\\admin\\apigoldline.com\\wwwroot\\Imagefolder\\UCR-10-FAMILYVIOLENCE.pdf';
        }
        default:
          return 'C:\\HostingSpaces\\admin\\apigoldline.com\\wwwroot\\Imagefolder\\UCR-10-FAMILYVIOLENCE.pdf';
      }
    }
    default:
      return null; // Added return for default case
  }
}

export const getLabelsString = (data) => {
  return data?.map(item => item.label).join(',');
}

export const getShowingDateText = (dateStr) => {
  return moment(dateStr)?.format("MM/DD/yyyy HH:mm")
}

export const getShowingYearMonthDate = (dateStr) => {
  return moment(dateStr).format("yyyy-MM-DD HH:mm:ss")
}

export const currentDate = () => {
  return moment(new Date()).format('YYYY-MM-DD');
}

export const currentDateNotes = () => {
  return moment(new Date()).format('YYYY-MM-DD  HH:mm:ss');
}

export const getShowingMonthDateYear = (dateStr) => {
  return moment(dateStr).format("MM/DD/YYYY HH:mm:ss")
}

export const getShowingMonthDateYearNibReport = (dateStr, type) => {
  const formattedDate = moment(dateStr);
  if (type === "to") {
    return formattedDate.set({ hour: 23, minute: 59, second: 59, millisecond: 0 }).format("MM/DD/YYYY HH:mm:ss");
  }
  return formattedDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format("MM/DD/YYYY HH:mm:ss");
}

export const getShowingWithOutTime = (dateStr) => {
  return moment(dateStr).format("MM/DD/YYYY")
}
export const getShowingWithOutTimeNew = (dateStr) => {
  return moment(dateStr).format("MM-DD-YYYY")
}
export const getShowingWithMonthOnly = (dateStr) => {
  return moment(dateStr).format("MM/YYYY")
}

export const getMonthWithOutDateTime = (dateStr) => {
  return moment(dateStr).month()
}

export const getYearWithOutDateTime = (dateStr) => {
  return moment(dateStr).year()
}

export const getShowingWithFixedTime = (dateStr) => {
  const date = moment(dateStr).set({ hour: 23, minute: 59 });
  return date.format("MM/DD/YYYY HH:mm:ss");
};

export const getShowingWithFixedTime01 = (dateStr) => {
  const date = moment(dateStr).set({ hour: 0, minute: 1 });
  return date.format("MM/DD/YYYY HH:mm");
};

export const getShowingWithFixedTime00 = (dateStr) => {
  const date = moment(dateStr).set({ hour: 0, minute: 0, second: 0 });
  return date.format("MM/DD/YYYY HH:mm:ss");
};

export const filterPassedTime = (time) => {
  const currentDate = new Date();
  const selectedDate = new Date(time);
  return currentDate.getTime() > selectedDate.getTime();
};

// ---- DS


export const filterPassedDateTimeZone = (time, val, reportDate, datezone) => {
  const currentDate = new Date(datezone);
  const selectedDate = new Date(time);
  const rpdt = new Date(reportDate).getTime();
  const dd = formatDate(new Date(rpdt));
  if (val && new Date(val)?.getDate() === new Date(reportDate)?.getDate() && new Date(currentDate)?.getDate() !== new Date(reportDate)?.getDate()) {
    return new Date(dd).getTime() <= selectedDate.getTime();
  } else if (new Date(currentDate)?.getDate() === new Date(reportDate)?.getDate()) {
    return new Date(dd).getTime() <= selectedDate.getTime() && currentDate.getTime() >= selectedDate.getTime();
  } else {
    return currentDate.getTime() >= selectedDate.getTime();
  }
};


export const filterPassedTimeZonesCurrent = (time, occuredFromDate, reportedDate) => {
  const selectedDate = new Date(time);
  const occuredFrom = new Date(occuredFromDate);
  const reported = new Date(reportedDate);
  if (selectedDate >= occuredFrom && selectedDate <= reported) {
    return true;
  }
  return false;
};

export const filterPassedTimeZonesProperty = (time, occuredFromDate, datezone) => {
  const selectedDate = new Date(time);
  const occuredFrom = new Date(occuredFromDate);
  const maxDate = new Date(datezone);
  if (selectedDate >= occuredFrom && selectedDate <= maxDate) {
    return true;
  }
  return false;
};


export const filterPassedTimeZone = (time, datezone) => {

  const currentDate = new Date();
  const selectedDate = new Date(time);
  const apiDate = new Date(datezone);
  return selectedDate.getTime() <= apiDate.getTime();
};


export const filterPassedTimeZoneException = (time, datezone, reportedDate) => {
  const selectedTime = new Date(time);
  const minAllowedTime = new Date(reportedDate);
  const maxAllowedTime = new Date(datezone);

  return selectedTime >= minAllowedTime && selectedTime <= maxAllowedTime;
};

export const filterPassedTimeZoneArrest = (time, extractIncidentDate, datezone, incidentReportedDate) => {
  const selectedTime = new Date(time);
  const minDateTime = extractIncidentDate
    ? new Date(extractIncidentDate)
    : incidentReportedDate
      ? new Date(incidentReportedDate)
      : null;

  const maxDateTime = new Date(datezone);

  if (minDateTime) {
    minDateTime.setMinutes(minDateTime.getMinutes() + 1);
  }

  return (!minDateTime || selectedTime >= minDateTime) && selectedTime <= maxDateTime;
};

// --- DS end

export const filterFutureTime = (time) => {
  const currentDate = new Date();
  const selectedDate = new Date(time);

  return selectedDate.getTime() <= currentDate.getTime();
};

export const formatDate = (date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  // Concatenate the parts to form a consistent string
  return `${year}-${month}-${day}T${hours}:${minutes}Z`;
}

export const filterPassedDateTime = (time, val, reportDate) => {
  const selectedDate = new Date(time);
  const currentDate = new Date();
  const rpdt = new Date(reportDate).getTime();
  const dd = formatDate(new Date(rpdt))
  if (val && new Date(val)?.getDate() === new Date(reportDate)?.getDate() && new Date(currentDate)?.getDate() != new Date(reportDate)?.getDate()) {
    return new Date(dd).getTime() <= selectedDate.getTime();
  } else if (new Date(currentDate)?.getDate() === new Date(reportDate)?.getDate()) {
    return new Date(dd).getTime() <= selectedDate.getTime() && currentDate.getTime() >= selectedDate.getTime();
  }
  else {
    return currentDate.getTime() >= selectedDate.getTime();
  }
};

export const filterPastDate = (time) => {
  const currentDate = new Date();
  const selectedDate = new Date(time);
  return currentDate.getTime() < selectedDate.getTime();
};

export const filterPassedTime1 = (time) => {
  const currentDate = new Date();
  const selectedDate = new Date(time);
  return currentDate.getTime() > selectedDate.getTime();
};

// Otp Component
export const get_OTP = () => {
  const OTP = randomize('0', 6);
  return OTP
}

//  Change Array
export const changeArrayFormat = (data, type) => {
  const result = data?.map((sponsor) =>
    ({ value: sponsor.GroupID, label: sponsor.GroupName, })
  )
  return result
}

export const changeArrayFormat_WithFilter = (data, type, id) => {
  if (type === 'group') {
    const result = data?.filter(function (option) { return option.GroupID === id }).map((sponsor) =>
      ({ value: sponsor.GroupID, label: sponsor.GroupName })
    )
    return result[0]
  }
}


export const Requiredcolour = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "#FFE2A8",
    height: 20, minHeight: 35, fontSize: 14, margintop: 2, boxShadow: 0,
  }),
};


export const LockFildscolour = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "#D9E4F2",
    height: 20, minHeight: 35, fontSize: 14, margintop: 2, boxShadow: 0,
  }),
};



export const nibrscolourStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "#F29A9A",
    height: 20,
    minHeight: 35,
    fontSize: 14,
    margintop: 2,
    boxShadow: 0,
  }),
};

export const nibrsErrorMultiSelectStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "#F29A9A",
    height: 55,
    fontSize: 14,
    margintop: 2,
    boxShadow: 0,
  }),
};

export const MultiSelectRequredColor = {
  control: base => ({
    ...base,
    backgroundColor: "#FFE2A8",
    minHeight: 58,
    fontSize: 14,
    margintop: 2,
    boxShadow: 0,
  }),
};

export const colourStylesRole = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "#FFE2A8",
    fontSize: 14,
    marginTop: 2,
    //-------------------added border color--------------------
    // boxShadow: "none",
    // border: "1px solid #A65E00",
    // color: "#A65E00",
  }),
};


export const colourStyles = {
  control: (styles) => ({
    ...styles,
    height: 20,
    minHeight: 35,
    fontSize: 14,
    margintop: 2,
    boxShadow: 0,
  }),
}
export const Nibrs_ErrorStyle = {
  control: base => ({
    ...base,
    backgroundColor: "#F29A9A",
    minHeight: 58,
    fontSize: 14,
    margintop: 2,
    boxShadow: 0,
  }),
};
export const customStylesWithOutColor = {
  control: base => ({
    ...base,
    height: 20,
    minHeight: 35,
    fontSize: 14,
    margintop: 2,
    boxShadow: 0,
  }),
};

// /-----------------------added border color---------------
// export const customStylesWithOutColor = {
//   control: (base) => ({
//     ...base,
//     height: 20,
//     minHeight: 35,
//     fontSize: 14,
//     marginTop: 2,
//     boxShadow: "none",
//     border: "1px solid #5B6776",
//   }),
// };

export const tableCustomStyles = {
  headRow: {
    style: {
      color: '#fff',
      backgroundColor: '#001f3f ',
      borderBottomColor: '#FFFFFF',
      outline: '1px solid #FFFFFF',
    },
  },
}

export const subTableCustomStyles = {
  headRow: {
    style: {
      color: '#fff',
      backgroundColor: '#121e26bf ',
      borderBottomColor: '#FFFFFF',
      outline: '1px solid #FFFFFF',
    },
  },
}

export const tableMinCustomStyles = {
  tableWrapper: {
    style: {
      minHeight: '150px',
    },
  },
  headRow: {
    style: {
      color: '#fff',
      backgroundColor: '#001f3f ',
      borderBottomColor: '#FFFFFF',
      outline: '1px solid #FFFFFF',
    },
  },
}


export const getListFunction = (ListName, DrpDataFunctions) => {
  if (DrpDataFunctions?.length > 0) {
    const reqObj = DrpDataFunctions.filter((item) => item.ListName == ListName)
    if (reqObj[0].ListName === ListName) {
      return reqObj[0].Myfunction
    }
  }
}

// --------------> Encryption // Decryption  <-------------------- //


// const AESEnyDecKey = "8UHjPgXZzXCGkhxV2QCnooyJexUzvJrO";
// const Iv = "zAvR2NI87bBx746n";

// Encrypted And Decrypted -> Key 
const Key = '9z$C&F)J@NcRfTjW'
const EncCode = 'QUJDREVGR0g='

// Function to convert a string to Base64
export function stringToBase64(str) {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str));
}

// Function to convert Base64 to a string
export function base64ToString(base64) {
  return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(base64));
}

export function decryptBase64(base64String) {
  const bytes = CryptoJS.AES.decrypt(base64String, '9z$C&F)J@NcRfTjW');
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
}

export const DecryptedList = (response) => {
  const key = CryptoJS?.enc?.Utf8?.parse(Key);
  const iv = CryptoJS?.enc?.Base64?.parse(EncCode);
  const bytes = CryptoJS?.TripleDES?.decrypt(response, key, {
    mode: CryptoJS?.mode?.CBC,
    iv: iv,
  });
  return bytes?.toString(CryptoJS?.enc?.Utf8);
}

// Encrypt Data 
export const EncryptedList = (text) => {
  const key = CryptoJS.enc.Utf8.parse(Key);
  const iv = CryptoJS.enc.Base64.parse(EncCode);
  const encoded = CryptoJS.enc.Utf8.parse(text);
  const bytes = CryptoJS.TripleDES.encrypt(encoded, key, {
    mode: CryptoJS.mode.CBC,
    iv: iv,
  });
  return bytes.toString();
}

// Decrypt ID And name 
export const Decrypt_Id_Name = (data, key) => {
  const result = JSON.parse(CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8))
  return result
}

export const Decrypt_Id = (data, key) => {
  const bytes = CryptoJS.AES.decrypt(data, key);
  const result = bytes.toString(CryptoJS.enc.Utf8);
  return result
}

export const Encrypted_Id_Name = (data, key) => {
  const result = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString()
  return result
}

export const Encrypted_Password = (data) => {
  const result = CryptoJS.AES.encrypt(JSON.stringify(data)).toString()
  return result
}

//WebSocket data encrypt and decrypt
export function encrypt(plain) {
  const aesKey = '0ca175b9c0f726a831d895e269332461';
  const key = CryptoJS.enc.Utf8.parse(aesKey);
  const encryptedData = CryptoJS.AES.encrypt(plain, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(encryptedData.ciphertext.toString()));
}

export function decrypt(secret) {
  const aesKey = '0ca175b9c0f726a831d895e269332461';
  const key = CryptoJS.enc.Utf8.parse(aesKey);
  const decryptedData = CryptoJS.AES.decrypt(secret, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decryptedData.toString(CryptoJS.enc.Utf8);
}

// Example usage
const AESEnyDecKey = CryptoJS.enc.Utf8.parse('8UHjPgXZzXCGkhxV2QCnooyJexUzvJrO'); // 16 bytes key
const iv = CryptoJS.enc.Utf8.parse('zAvR2NI87bBx746n'); // 16 bytes IV

export function encryptAndEncodeToBase64(stringToEncrypt) {
  const encrypted = CryptoJS.AES.encrypt(stringToEncrypt, AESEnyDecKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const encryptedBase64 = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  const encryptedBase64String = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encryptedBase64))
  // console.log("🚀 ~ Aes256EncryptAndConvertBase64 ~ encryptedBase64String:", encryptedBase64String)
  return encryptedBase64String;



  // const key = CryptoJS.enc.Utf8.parse(Key);
  // const iv = CryptoJS.enc.Base64.parse(EncCode);
  // const encoded = CryptoJS.enc.Utf8.parse(stringToEncrypt);

  // const bytes = CryptoJS.TripleDES.encrypt(encoded, key, {
  //   mode: CryptoJS.mode.CBC,
  //   iv: iv,
  // });

  // const encryptedString = bytes.toString();
  // const base64String = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encryptedString));
  // return base64String;
}


export const Aes256Base64DecryptString = (Base64ToDecrypt) => {
  const decrypted = CryptoJS.AES.decrypt(Base64ToDecrypt, AESEnyDecKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  console.log(decrypted.toString(CryptoJS?.enc?.Utf8))
  return decrypted.toString(CryptoJS?.enc?.Utf8);

};


export const Aes256EncryptAndConvertBase64 = (StringToEncrypt) => {
  const encrypted = CryptoJS.AES.encrypt(StringToEncrypt, AESEnyDecKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const encryptedBase64 = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  const encryptedBase64String = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encryptedBase64))
  return encryptedBase64String;
};


export const Aes256Encrypt = async (data) => {
  const encrypted = CryptoJS.AES.encrypt(data, AESEnyDecKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

export const Aes256Decrypt = async (encryptedData) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, AESEnyDecKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  // console.log(decrypted.toString(CryptoJS.enc.Utf8))
  return decrypted.toString(CryptoJS.enc.Utf8);
};

///  cad style 
export const CadDashboardTableCustomStyles = {
  headRow: {
    style: {
      color: '#000',
      backgroundColor: '#bebebe ',
      borderBottomColor: '#FFFFFF',
      outline: '1px solid #FFFFFF',
    },
  },
}

export const editorConfig = {
  toolbar: {
    items: [
      'undo',
      'redo',
      '|',
      'heading',
      '|',
      'fontSize',
      'fontFamily',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'bold',
      'italic',
      'underline',
      'strikethrough',

      'code',
      'removeFormat',
      '|',
      'specialCharacters',
      'horizontalLine',
      // 'link',
      'highlight',
      'blockQuote',
      // 'codeBlock',
      '|',
      'alignment',
      '|',
      'bulletedList',
      'numberedList',
      'todoList',
      'outdent',
      'indent'
    ],
    shouldNotGroupWhenFull: true
  },
  plugins: [
    Alignment,
    Autoformat,
    AutoImage,
    Autosave,
    BlockQuote,
    Bold,
    Bookmark,
    CloudServices,
    Code,
    CodeBlock,
    Essentials,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    Heading,
    Highlight,
    HorizontalLine,
    ImageBlock,
    ImageCaption,
    ImageEditing,
    ImageInline,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    ImageUtils,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    Paragraph,
    RemoveFormat,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Strikethrough,
    Subscript,
    Superscript,
    TextTransformation,
    TodoList,
    Underline,
  ],
  fontFamily: {
    supportAllValues: true
  },
  fontSize: {
    options: [10, 12, 14, 'default', 18, 20, 22],
    supportAllValues: true
  },
  heading: {
    options: [
      {
        model: 'paragraph',
        title: 'Paragraph',
        class: 'ck-heading_paragraph'
      },
      {
        model: 'heading1',
        view: 'h1',
        title: 'Heading 1',
        class: 'ck-heading_heading1'
      },
      {
        model: 'heading2',
        view: 'h2',
        title: 'Heading 2',
        class: 'ck-heading_heading2'
      },
      {
        model: 'heading3',
        view: 'h3',
        title: 'Heading 3',
        class: 'ck-heading_heading3'
      },
      {
        model: 'heading4',
        view: 'h4',
        title: 'Heading 4',
        class: 'ck-heading_heading4'
      },
      {
        model: 'heading5',
        view: 'h5',
        title: 'Heading 5',
        class: 'ck-heading_heading5'
      },
      {
        model: 'heading6',
        view: 'h6',
        title: 'Heading 6',
        class: 'ck-heading_heading6'
      }
    ]
  },

  initialData: '',
  licenseKey: 'GPL', // or <YOUR_LICENSE_KEY>.`,
  link: {
    addTargetToExternalLinks: true,
    defaultProtocol: 'https://',
    decorators: {
      toggleDownloadable: {
        mode: 'manual',
        label: 'Downloadable',
        attributes: {
          download: 'file'
        }
      }
    }
  },
  list: {
    properties: {
      styles: true,
      startIndex: true,
      reversed: true
    }
  },
  menuBar: {
    isVisible: false
  },
  placeholder: 'Message'
}