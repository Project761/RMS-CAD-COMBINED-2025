export function matchIncidentWords({
  commentsDoc = "",
  vehicleData = [],
  categoryData = [],
  chargesData = [],
  locationData = [],
}) {



  const stripHtml = (html = "") => html.replace(/<[^>]*>/g, "");

  const toMDY = (iso) => {
    if (!iso) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    if (!m) return null;
    const [, y, mo, d] = m;
    return `${mo}/${d}/${y}`;
  };
  const toDMY = (iso) => {
    if (!iso) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    if (!m) return null;
    const [, y, mo, d] = m;
    return `${d}/${mo}/${y}`;
  };

  const toYMD = (iso) => {
    if (!iso) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    if (!m) return null;
    const [, y, mo, d] = m;
    return `${y}-${mo}-${d}`;
  };

  const detected = new Set();

  // Try to extract JSON if CommentsDoc has HTML + embedded JSON
  let commentsObj = null;
  try {
    const withoutHtml = stripHtml(commentsDoc || "");
    const start = withoutHtml.indexOf("{");
    const end = withoutHtml.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      const jsonText = withoutHtml.slice(start, end + 1);
      commentsObj = JSON.parse(jsonText);
    }
  } catch (_) { }

  // Build haystack (case-insensitive, and version ignoring whitespace)
  const rawHaystack = commentsObj
    ? JSON.stringify(commentsObj)
    : stripHtml(commentsDoc || "");

  const hayLower = rawHaystack.toLowerCase();
  const hayNoWs = hayLower.replace(/\s+/g, ""); // remove ALL whitespace

  // helper to check needle against haystack, ignoring case and internal spaces
  const checkAndAdd = (val) => {
    const original = String(val ?? "").trim();
    if (!original) return;

    
    const needleLower = original.toLowerCase();
    const needleNoWs = needleLower.replace(/\s+/g, "");

    // 1) direct case-insensitive check
    if (hayLower.includes(needleLower)) {
      detected.add(original);
      return;
    }

    // 2) whitespace-insensitive check (e.g., "Sanket" vs "Sanke t")
    if (needleNoWs && hayNoWs.includes(needleNoWs)) {
      detected.add(original);
    }
  };

  // Location
  (locationData || []).forEach(({ CrimeLocation }) => checkAndAdd(CrimeLocation));

  // Vehicle
  (vehicleData || []).forEach(({ VehicleNo, VIN }) => {
    checkAndAdd(VehicleNo);
    if (VIN !== null && VIN !== undefined) checkAndAdd(VIN);
  });

  // Charges
  (chargesData || []).forEach(({ ChargeCode, ChargeDescription }) => {
    checkAndAdd(ChargeCode);
    checkAndAdd(ChargeDescription);
  });

  // Category (people)
  (categoryData || []).forEach(

    ({ FullName, FirstName, LastName, MiddleName, Address, SSN, Contact, DateOfBirth, DLNumber, AgeFrom, OwnerPhoneNumber, Category }) => {

      [FullName, FirstName, LastName, MiddleName, Address, SSN, Contact, DLNumber, OwnerPhoneNumber].forEach(checkAndAdd);

      // if (Category === "Juveniles") {
        checkAndAdd(`(Age: ${AgeFrom})`)
      // }

      const fullname1 = `${FirstName} ${LastName} ${MiddleName}`
      const fullname2 = `${FirstName} ${MiddleName} ${LastName}`
      const fullname3 = `${LastName} ${FirstName} ${MiddleName}`
      const fullname4 = `${LastName} ${MiddleName} ${FirstName}`
      const fullname5 = `${MiddleName} ${FirstName} ${LastName}`
      const fullname6 = `${MiddleName} ${LastName} ${FirstName}`
      checkAndAdd(fullname1);
      checkAndAdd(fullname2);
      checkAndAdd(fullname3);
      checkAndAdd(fullname4);
      checkAndAdd(fullname5);
      checkAndAdd(fullname6);

      if (DateOfBirth) {
        checkAndAdd(DateOfBirth);         // ISO
        const mdy = toMDY(DateOfBirth);   // 08/30/2004
        const ymd = toYMD(DateOfBirth);   // 2004-08-30
        const dmy = toDMY(DateOfBirth)    // 30/08/2004
      
        if (mdy) checkAndAdd(mdy);
        if (ymd) checkAndAdd(ymd);
        if (dmy) checkAndAdd(dmy);
      }
    }
  );

  return Array.from(detected);
}
