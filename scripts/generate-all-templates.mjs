import fs from "fs";
import path from "path";
import zlib from "zlib";

// Minimal, zero-dependency ZIP archive writer for generating valid .docx files
function createZip(files) {
  const fileEntries = [];
  let offset = 0;

  const parts = [];

  for (const file of files) {
    const nameBuf = Buffer.from(file.name, "utf-8");
    const dataBuf = Buffer.from(file.content, "utf-8");
    const compressed = zlib.deflateRawSync(dataBuf);

    // CRC32 calculation
    const crc = crc32(dataBuf);

    // Local file header
    const localHeader = Buffer.alloc(30 + nameBuf.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // signature
    localHeader.writeUInt16LE(20, 4); // version needed
    localHeader.writeUInt16LE(0, 6); // flags
    localHeader.writeUInt16LE(8, 8); // compression: deflate
    localHeader.writeUInt16LE(0, 10); // mod time
    localHeader.writeUInt16LE(0, 12); // mod date
    localHeader.writeUInt32LE(crc, 14); // crc-32
    localHeader.writeUInt32LE(compressed.length, 18); // compressed size
    localHeader.writeUInt32LE(dataBuf.length, 22); // uncompressed size
    localHeader.writeUInt16LE(nameBuf.length, 26); // file name length
    localHeader.writeUInt16LE(0, 28); // extra field length
    nameBuf.copy(localHeader, 30);

    parts.push(localHeader);
    parts.push(compressed);

    fileEntries.push({
      nameBuf,
      crc,
      compressedSize: compressed.length,
      uncompressedSize: dataBuf.length,
      offset,
    });

    offset += localHeader.length + compressed.length;
  }

  const centralDirStart = offset;
  let centralDirSize = 0;

  for (const entry of fileEntries) {
    const cdHeader = Buffer.alloc(46 + entry.nameBuf.length);
    cdHeader.writeUInt32LE(0x02014b50, 0); // central dir signature
    cdHeader.writeUInt16LE(20, 4); // version made by
    cdHeader.writeUInt16LE(20, 6); // version needed
    cdHeader.writeUInt16LE(0, 8); // flags
    cdHeader.writeUInt16LE(8, 10); // compression
    cdHeader.writeUInt16LE(0, 12); // mod time
    cdHeader.writeUInt16LE(0, 14); // mod date
    cdHeader.writeUInt32LE(entry.crc, 16);
    cdHeader.writeUInt32LE(entry.compressedSize, 20);
    cdHeader.writeUInt32LE(entry.uncompressedSize, 24);
    cdHeader.writeUInt16LE(entry.nameBuf.length, 28);
    cdHeader.writeUInt16LE(0, 30); // extra len
    cdHeader.writeUInt16LE(0, 32); // comment len
    cdHeader.writeUInt16LE(0, 34); // disk start
    cdHeader.writeUInt16LE(0, 36); // internal attr
    cdHeader.writeUInt32LE(0, 38); // external attr
    cdHeader.writeUInt32LE(entry.offset, 42); // local header offset
    entry.nameBuf.copy(cdHeader, 46);

    parts.push(cdHeader);
    centralDirSize += cdHeader.length;
  }

  // End of central directory record
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4); // disk number
  eocd.writeUInt16LE(0, 6); // start disk
  eocd.writeUInt16LE(fileEntries.length, 8); // records on disk
  eocd.writeUInt16LE(fileEntries.length, 10); // total records
  eocd.writeUInt32LE(centralDirSize, 12); // size of central dir
  eocd.writeUInt32LE(centralDirStart, 16); // offset of central dir
  eocd.writeUInt16LE(0, 20); // comment length

  parts.push(eocd);

  return Buffer.concat(parts);
}

// Table-based CRC32 implementation
function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = new Int32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    crc32.table = table;
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function buildDocx(documentXmlContent) {
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const docRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
        <w:sz w:val="22"/>
        <w:color w:val="1E293B"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>
</w:styles>`;

  return createZip([
    { name: "[Content_Types].xml", content: contentTypesXml },
    { name: "_rels/.rels", content: relsXml },
    { name: "word/_rels/document.xml.rels", content: docRelsXml },
    { name: "word/styles.xml", content: stylesXml },
    { name: "word/document.xml", content: documentXmlContent },
  ]);
}

// 1. CAR PARKING ALLOTMENT LETTER TEMPLATE
const parkingDocXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="32"/><w:color w:val="0F172A"/></w:rPr><w:t>{company_name}</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:sz w:val="18"/><w:color w:val="64748B"/></w:rPr><w:t>CIN: {company_cin} | RERA No: {project_rera_no}</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/><w:u w:val="single"/><w:sz w:val="26"/><w:color w:val="1E3A8A"/></w:rPr><w:t>ALLOTMENT LETTER FOR CAR PARKING SPACE</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Date: {date_dd_mm_yyyy}</w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Ref No: DF/PARK/{flat_no}/{date_year}</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:t>To,</w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>{buyer_name}</w:t></w:r></w:p>
    <w:p><w:r><w:t>PAN: {buyer_pan} | ID Ref: {buyer_aadhaar_masked}</w:t></w:r></w:p>
    <w:p><w:r><w:t>{buyer_address}</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Sub: Exclusive Right to Use Dedicated Car Parking Bay No. {parking_slot_no} at Project '{project_name}'.</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:r><w:t>Dear {salutation} {buyer_name},</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>With reference to your Agreement for Sale dated {agreement_date} in respect of Apartment/Flat No. </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>{flat_no}</w:t></w:r>
      <w:r><w:t>, situated on the {floor_ordinal} Floor, {tower_name}, having a Super Built-Up Area of </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>{sba_sqft} sq.ft</w:t></w:r>
      <w:r><w:t> and Undivided Share (UDS) of </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>{uds_sqft} sq.ft</w:t></w:r>
      <w:r><w:t> in our project known as '{project_name}'.</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:r><w:t>We are pleased to confirm that on receipt of agreed consideration of </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>{parking_fee_formatted} ({parking_fee_words})</w:t></w:r>
      <w:r><w:t>, we have allotted to you the exclusive, perpetual, and non-severable right to park your motor vehicle in dedicated </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>{parking_type} Car Parking Bay No. {parking_slot_no}</w:t></w:r>
      <w:r><w:t> located in </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>{parking_level}</w:t></w:r>
      <w:r><w:t> of the apartment complex.</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:r><w:t>This allotment is appurtenant to and shall run concurrently with the ownership of Flat No. {flat_no} and cannot be transferred, leased, or assigned independently to any non-resident or third party.</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:t>Thanking you,</w:t></w:r></w:p>
    <w:p><w:r><w:t>Yours faithfully,</w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>For {company_name}</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Authorized Signatory</w:t></w:r></w:p>
  </w:body>
</w:document>`;

// 2. BUILDER HOME LOAN TRIPARTITE NOC TEMPLATE
const nocDocXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="30"/><w:color w:val="0F172A"/></w:rPr><w:t>{company_name}</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/><w:u w:val="single"/><w:sz w:val="24"/><w:color w:val="1E3A8A"/></w:rPr><w:t>NO OBJECTION CERTIFICATE / PERMISSION TO MORTGAGE</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>To,</w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>The Branch Manager,</w:t></w:r></w:p>
    <w:p><w:r><w:t>{bank_name}, {bank_branch_address}</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Date: {date_dd_mm_yyyy}</w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Sub: NOC for Home Loan sanction &amp; mortgage in favor of {buyer_name} for Flat No. {flat_no}, {project_name}.</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:r><w:t>1. We confirm that we have sold/allotted Flat No. </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>{flat_no}</w:t></w:r>
      <w:r><w:t>, {floor_ordinal} Floor, {tower_name}, having Super Built-Up Area of {sba_sqft} sq.ft along with dedicated Car Parking Slot No. </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>{parking_slot_no}</w:t></w:r>
      <w:r><w:t> to {buyer_name} for total sale consideration of </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>{total_sale_price_formatted} ({total_sale_price_words})</w:t></w:r>
      <w:r><w:t>.</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>2. We confirm that the total amount received from the buyer till date is {amount_received_formatted} ({amount_received_words}), leaving a balance of {balance_amount_formatted} ({balance_amount_words}).</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>3. We confirm that we have NO OBJECTION to the buyer mortgaging their right, title, and interest in the said flat in favor of {bank_name} as security for the home loan.</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>4. We undertake to remit all disbursement cheques directly to our RERA Designated Bank Account No: {rera_bank_account_no}, IFSC: {rera_bank_ifsc}, Bank: {rera_bank_name}.</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:t>Yours faithfully,</w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>For {company_name}</w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Authorized Signatory</w:t></w:r></w:p>
  </w:body>
</w:document>`;

// 3. UNIT COST & MILESTONE PAYMENT SCHEDULE TEMPLATE
const costSheetDocXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="30"/><w:color w:val="0F172A"/></w:rPr><w:t>{company_name}</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/><w:u w:val="single"/><w:sz w:val="24"/><w:color w:val="1E3A8A"/></w:rPr><w:t>OFFICIAL UNIT COST SHEET &amp; PAYMENT SCHEDULE</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Buyer: {buyer_name} | Unit: {flat_no} | Project: {project_name}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Carpet Area: {carpet_sqft} sq.ft | Super Built-up: {sba_sqft} sq.ft | Allocated Bay: {parking_slot_no}</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Cost Breakdown:</w:t></w:r></w:p>
    <w:p><w:r><w:t>1. Basic Unit Consideration: {base_price_formatted}</w:t></w:r></w:p>
    <w:p><w:r><w:t>2. Dedicated Covered Car Parking Space: {parking_fee_formatted}</w:t></w:r></w:p>
    <w:p><w:r><w:t>3. Infrastructure &amp; Amenities Charges (BESCOM/BWSSB): {infra_charges_formatted}</w:t></w:r></w:p>
    <w:p><w:r><w:t>4. Applicable GST (5% Under-Construction): {gst_amount_formatted}</w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>TOTAL AGREED CONSIDERATION: {total_sale_price_formatted}</w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:i/></w:rPr><w:t>({total_sale_price_words})</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Milestone Payment Schedule (RERA Construction-Linked):</w:t></w:r></w:p>
    <w:p><w:r><w:t>• On Booking / Token Advance (10%): {token_amount_formatted}</w:t></w:r></w:p>
    <w:p><w:r><w:t>• On Execution of Agreement for Sale (10%): {agreement_milestone_formatted}</w:t></w:r></w:p>
    <w:p><w:r><w:t>• On Completion of Foundation / Plinth (15%): {plinth_milestone_formatted}</w:t></w:r></w:p>
    <w:p><w:r><w:t>• On Completion of Respective Floor Slab (25%): {slab_milestone_formatted}</w:t></w:r></w:p>
    <w:p><w:r><w:t>• On Completion of Flooring &amp; Plastering (35%): {finishing_milestone_formatted}</w:t></w:r></w:p>
    <w:p><w:r><w:t>• On Intimation of Possession / Handover (5%): {possession_milestone_formatted}</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>For {company_name}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Authorized Signatory</w:t></w:r></w:p>
  </w:body>
</w:document>`;

// 4. KARNATAKA RERA FORM N MODEL AGREEMENT FOR SALE
const reraAtsDocXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:sz w:val="18"/><w:color w:val="64748B"/></w:rPr><w:t>KARNATAKA REAL ESTATE REGULATORY AUTHORITY (RERA)</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="30"/><w:color w:val="0F172A"/></w:rPr><w:t>AGREEMENT FOR SALE (FORM 'N')</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:sz w:val="18"/><w:color w:val="64748B"/></w:rPr><w:t>Under Section 13(2) of Real Estate (Regulation and Development) Act, 2016</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:r><w:t>This Agreement for Sale is executed at Bengaluru on this </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>{date_dd_mm_yyyy}</w:t></w:r>
      <w:r><w:t> BY AND BETWEEN:</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:r><w:rPr><w:b/></w:rPr><w:t>1. {company_name}</w:t></w:r>
      <w:r><w:t>, a company incorporated under the Companies Act, CIN: {company_cin}, having its Registered Office at Bengaluru, represented by its Authorized Signatory (hereinafter referred to as the "PROMOTER/DEVELOPER").</w:t></w:r>
    </w:p>
    <w:p><w:r><w:jc w:val="center"/><w:rPr><w:b/><w:sz w:val="20"/></w:rPr><w:t>AND</w:t></w:r></w:p>
    <w:p>
      <w:r><w:rPr><w:b/></w:rPr><w:t>2. {buyer_name}</w:t></w:r>
      <w:r><w:t>, PAN: {buyer_pan}, Aadhaar Ref: {buyer_aadhaar_masked}, residing at {buyer_address} (hereinafter referred to as the "{allottee_noun}").</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t>{legal_representation}</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:u w:val="single"/><w:color w:val="1E3A8A"/></w:rPr><w:t>CLAUSE 1: PARTICULARS OF THE APARTMENT &amp; CAR PARKING</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>The Promoter hereby agrees to sell and the Allottee agrees to purchase Apartment/Flat No. </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>{flat_no}</w:t></w:r>
      <w:r><w:t> on the {floor_ordinal} Floor, {tower_name}, in the project '{project_name}' (Karnataka RERA Reg No: {project_rera_no}) with Carpet Area of </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>{carpet_sqft} sq.ft</w:t></w:r>
      <w:r><w:t>, Super Built-up Area of {sba_sqft} sq.ft, along with undivided share of land (UDS) measuring </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>{uds_sqft} sq.ft</w:t></w:r>
      <w:r><w:t>, and dedicated {parking_type} Car Parking Bay No. </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>{parking_slot_no}</w:t></w:r>
      <w:r><w:t> in {parking_level}.</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:u w:val="single"/><w:color w:val="1E3A8A"/></w:rPr><w:t>CLAUSE 2: TOTAL SALE CONSIDERATION &amp; PAYMENT SCHEDULE</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>The total agreed sale consideration for the Apartment and appurtenant parking space is </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>{total_sale_price_formatted} ({total_sale_price_words})</w:t></w:r>
      <w:r><w:t> payable as per the construction-linked milestone schedule below:</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t>1. On Booking / Token Advance (10%): {token_amount_formatted}</w:t></w:r></w:p>
    <w:p><w:r><w:t>2. On Execution of this Agreement (10%): {agreement_milestone_formatted}</w:t></w:r></w:p>
    <w:p><w:r><w:t>3. On Completion of Plinth / Foundation (15%): {plinth_milestone_formatted}</w:t></w:r></w:p>
    <w:p><w:r><w:t>4. On Completion of Respective Floor Slab (25%): {slab_milestone_formatted}</w:t></w:r></w:p>
    <w:p><w:r><w:t>5. On Completion of Flooring &amp; Plastering (35%): {finishing_milestone_formatted}</w:t></w:r></w:p>
    <w:p><w:r><w:t>6. On Intimation of Possession / Handover (5%): {possession_milestone_formatted}</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:u w:val="single"/><w:color w:val="1E3A8A"/></w:rPr><w:t>CLAUSE 3: STATUTORY COVENANTS &amp; POSSESSION</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>The Promoter undertakes to deliver possession of the Apartment with Occupancy Certificate on or before {possession_date}, subject to force majeure. In accordance with Section 14(3) of RERA Act, 2016, the Promoter shall rectify any structural or workmanship defect within 30 days of notice for a period of 5 years from possession date.</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>IN WITNESS WHEREOF the parties have set their hands on the day, month, and year first above written.</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>For {company_name} (Promoter)               {buyer_name} (Allottee)</w:t></w:r></w:p>
    <w:p><w:r><w:t>Authorized Signatory                             Signature of Allottee</w:t></w:r></w:p>
  </w:body>
</w:document>`;

// 5. KAVERİ 2.0 SUB-REGISTRAR ABSOLUTE SALE DEED DOSSIER (SCHEDULES A, B, C, D)
const saleDeedDocXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:sz w:val="18"/><w:color w:val="64748B"/></w:rPr><w:t>GOVERNMENT OF KARNATAKA — DEPARTMENT OF STAMPS &amp; REGISTRATION (KAVERI 2.0)</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="32"/><w:color w:val="0F172A"/></w:rPr><w:t>DEED OF ABSOLUTE SALE</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="18"/><w:color w:val="821A2A"/></w:rPr><w:t>e-Stamp Certificate No: {e_stamp_certificate_no} | Date: {date_dd_mm_yyyy}</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:r><w:t>This DEED OF ABSOLUTE SALE is made on this </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>{date_dd_mm_yyyy}</w:t></w:r>
      <w:r><w:t> between {company_name} (hereinafter referred to as the "VENDOR") and {buyer_name}, PAN: {buyer_pan}, Aadhaar Ref: {buyer_aadhaar_masked}, residing at {buyer_address} (hereinafter referred to as the "PURCHASER").</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:r><w:t>The VENDOR acknowledges receipt of full and final sale consideration of </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>{total_sale_price_formatted} ({total_sale_price_words})</w:t></w:r>
      <w:r><w:t> and hereby conveys, transfers, and assigns unto the PURCHASER the Schedule property described below.</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:u w:val="single"/><w:color w:val="821A2A"/></w:rPr><w:t>SCHEDULE 'A' (MASTER PROPERTY)</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>All that piece and parcel of immovable residential converted land bearing {survey_numbers}, situated at {location}, {taluk}, {district}, and bounded as follows:</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t>• North by: {master_north}</w:t></w:r></w:p>
    <w:p><w:r><w:t>• South by: {master_south}</w:t></w:r></w:p>
    <w:p><w:r><w:t>• East by: {master_east}</w:t></w:r></w:p>
    <w:p><w:r><w:t>• West by: {master_west}</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:u w:val="single"/><w:color w:val="821A2A"/></w:rPr><w:t>SCHEDULE 'B' (MULTISTORIED BUILDING)</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>The entire multistoried residential complex known as '{project_name}', constructed on Schedule 'A' property comprising Basement, Ground, and Upper Floors sanctioned under Plan No: {sanction_plan_no}.</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:u w:val="single"/><w:color w:val="821A2A"/></w:rPr><w:t>SCHEDULE 'C' (THE APARTMENT CONVEYED)</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>Residential Apartment/Flat No. </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>{flat_no}</w:t></w:r>
      <w:r><w:t>, situated on the {floor_ordinal} Floor, {tower_name}, having a Carpet Area of {carpet_sqft} sq.ft, Super Built-Up Area of {sba_sqft} sq.ft, and bounded internally as follows:</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t>• North by: {unit_north}</w:t></w:r></w:p>
    <w:p><w:r><w:t>• South by: {unit_south}</w:t></w:r></w:p>
    <w:p><w:r><w:t>• East by: {unit_east}</w:t></w:r></w:p>
    <w:p><w:r><w:t>• West by: {unit_west}</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:u w:val="single"/><w:color w:val="821A2A"/></w:rPr><w:t>SCHEDULE 'D' (UNDIVIDED SHARE &amp; CAR PARKING)</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>1. An Undivided Share of Land (UDS) equivalent to </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>{uds_sqft} sq.ft</w:t></w:r>
      <w:r><w:t> in the Schedule 'A' Property.</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>2. Exclusive perpetual right to park motor vehicle in dedicated {parking_type} Car Parking Bay No. </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>{parking_slot_no}</w:t></w:r>
      <w:r><w:t> situated in </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>{parking_level}</w:t></w:r>
      <w:r><w:t> of Schedule 'B' property.</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>IN WITNESS WHEREOF, the VENDOR and the PURCHASER have executed this Absolute Sale Deed on the date first mentioned above.</w:t></w:r></w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>VENDOR: For {company_name}                       PURCHASER: {buyer_name}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Authorized Signatory                             Purchaser / Allottee</w:t></w:r></w:p>
  </w:body>
</w:document>`;

// Output directory
const outputDir = path.resolve(process.cwd(), "public/templates");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, "car-parking-allotment.docx"), buildDocx(parkingDocXml));
fs.writeFileSync(path.join(outputDir, "builder-home-loan-noc.docx"), buildDocx(nocDocXml));
fs.writeFileSync(path.join(outputDir, "unit-cost-sheet.docx"), buildDocx(costSheetDocXml));
fs.writeFileSync(path.join(outputDir, "karnataka-rera-sale-agreement.docx"), buildDocx(reraAtsDocXml));
fs.writeFileSync(path.join(outputDir, "kaveri-sale-deed-dossier.docx"), buildDocx(saleDeedDocXml));

console.log("Successfully generated all 5 genuine .docx templates in public/templates/:");
console.log("  1. car-parking-allotment.docx");
console.log("  2. builder-home-loan-noc.docx");
console.log("  3. unit-cost-sheet.docx");
console.log("  4. karnataka-rera-sale-agreement.docx");
console.log("  5. kaveri-sale-deed-dossier.docx");
