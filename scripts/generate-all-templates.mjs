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

// Output directory
const outputDir = path.resolve(process.cwd(), "public/templates");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, "car-parking-allotment.docx"), buildDocx(parkingDocXml));
fs.writeFileSync(path.join(outputDir, "builder-home-loan-noc.docx"), buildDocx(nocDocXml));
fs.writeFileSync(path.join(outputDir, "unit-cost-sheet.docx"), buildDocx(costSheetDocXml));

console.log("Successfully generated all 3 genuine .docx templates in public/templates/:");
console.log("  1. car-parking-allotment.docx");
console.log("  2. builder-home-loan-noc.docx");
console.log("  3. unit-cost-sheet.docx");
