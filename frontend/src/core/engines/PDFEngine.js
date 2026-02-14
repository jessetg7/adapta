// src/core/engines/PDFEngine.js
import { v4 as uuidv4 } from 'uuid';

/**
 * ADAPTA PDF Engine
 * Generates printable prescriptions and forms from templates
 * All layouts are JSON-configurable
 */
class PDFEngine {
  constructor() {
    this.templates = new Map();
  }

  // Register a PDF template
  registerTemplate(template) {
    this.templates.set(template.id, template);
  }

  // Generate prescription data structure for PDF
  generatePrescriptionData(prescription, patient, doctor, clinicInfo) {
    return {
      ...prescription, // Spread original data to keep dynamic fields (like fertility tables)
      id: prescription.id || uuidv4(),
      generatedAt: new Date().toISOString(),

      // Clinic/Hospital Info
      clinic: {
        name: clinicInfo?.name || 'Medical Center',
        logo: clinicInfo?.logo || null,
        address: clinicInfo?.address || '',
        phone: clinicInfo?.phone || '',
        email: clinicInfo?.email || '',
        website: clinicInfo?.website || '',
        registrationNumber: clinicInfo?.registrationNumber || '',
      },

      // Doctor Info
      doctor: {
        name: doctor?.name || 'Dr. Unknown',
        qualification: doctor?.qualification || '',
        specialization: doctor?.specialization || '',
        registrationNo: doctor?.registrationNo || '',
        signature: doctor?.signature || null,
      },

      // Patient Info
      patient: {
        name: `${patient?.firstName || ''} ${patient?.lastName || ''}`.trim(),
        age: this.calculateAge(patient?.dateOfBirth),
        gender: patient?.gender || '',
        phone: patient?.phone || '',
        address: patient?.address?.street || '',
        patientId: patient?.id || '',
      },

      // Visit Info
      visit: {
        date: prescription.date || new Date().toISOString(),
        type: prescription.visitType || 'Consultation',
        chiefComplaint: prescription.chiefComplaint || '',
      },

      // Clinical Data
      vitals: prescription.vitals || {},
      diagnosis: prescription.diagnosis || [],
      medications: prescription.medications || [],
      investigations: prescription.investigations || [],
      advice: prescription.advice || [],
      followUp: prescription.followUpDate || null,
      notes: prescription.notes || '',
    };
  }

  // Calculate age from date of birth
  calculateAge(dateOfBirth) {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  // Format medication for display
  formatMedication(med, index) {
    const parts = [];
    parts.push(`${index + 1}. ${med.name || 'Unknown'}`);

    if (med.dose) parts.push(med.dose);
    if (med.route) parts.push(`(${med.route})`);
    if (med.frequency) parts.push(`- ${med.frequency}`);
    if (med.duration) parts.push(`for ${med.duration}`);
    if (med.instructions) parts.push(`[${med.instructions}]`);

    return parts.join(' ');
  }

  // Format vitals for display
  formatVitals(vitals) {
    const formatted = [];

    if (vitals.temperature) {
      formatted.push(`Temp: ${vitals.temperature}°C`);
    }
    if (vitals.bloodPressureSystolic && vitals.bloodPressureDiastolic) {
      formatted.push(`BP: ${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic} mmHg`);
    }
    if (vitals.heartRate) {
      formatted.push(`HR: ${vitals.heartRate} bpm`);
    }
    if (vitals.respiratoryRate) {
      formatted.push(`RR: ${vitals.respiratoryRate}/min`);
    }
    if (vitals.oxygenSaturation) {
      formatted.push(`SpO2: ${vitals.oxygenSaturation}%`);
    }
    if (vitals.weight) {
      formatted.push(`Weight: ${vitals.weight} kg`);
    }
    if (vitals.height) {
      formatted.push(`Height: ${vitals.height} cm`);
    }

    return formatted;
  }

  // Generate HTML for printing
  generatePrintHTML(data, template = null) {
    const styles = template?.styling || this.getDefaultStyles();

    // Helper to render any extra sections found in 'data' that aren't standard
    // We assume 'data' contains the raw form keys from our new template
    const extraSections = this.generateDynamicSections(data);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Report - ${data.patient.name}</title>
        <style>
          ${this.generateCSS(styles)}
        </style>
      </head>
      <body>
        <div class="prescription">
          ${this.generateHeader(data)}
          ${this.generatePatientInfo(data)}
          
          <!-- Standard Vitals -->
          ${this.generateVitals(data)}

          ${this.generateDiagnosis(data)}
          ${this.generateMedications(data)}
          ${this.generateInvestigations(data)}
          ${this.generateAdvice(data)}
          ${this.generateFollowUp(data)}
          ${this.generateFooter(data)}
        </div>
      </body>
      </html>
    `;
  }

  // NEW METHOD: Renders unknown array/object data as tables/lists
  generateDynamicSections(data) {
    const ignoredKeys = [
      'id', 'generatedAt', 'clinic', 'doctor', 'patient', 'visit',
      'vitals', 'diagnosis', 'medications', 'investigations', 'advice',
      'followUp', 'notes'
    ];

    const simpleFields = [];
    const tables = [];

    Object.keys(data).forEach(key => {
      if (ignoredKeys.includes(key)) return;
      const value = data[key];
      if (value === null || value === undefined || value === '') return;

      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

      if (Array.isArray(value)) {
        if (value.length > 0) tables.push({ title: label, rows: value });
      } else if (typeof value === 'object') {
        // Convert object to table rows
        const subRows = Object.entries(value).map(([k, v]) => ({
          Feature: k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
          Result: typeof v === 'object' ? (v?.label || v?.value || '-') : v
        }));
        if (subRows.length > 0) tables.push({ title: label, rows: subRows });
      } else {
        simpleFields.push({ label, value });
      }
    });

    let html = '';

    // 1. Render Consolidated Simple Fields Table
    if (simpleFields.length > 0) {
      html += `
        <div class="section">
          <div class="section-title">Clinical Summary</div>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #cbd5e0; margin-bottom: 20px; font-size: 10pt;">
            <tbody>
              ${simpleFields.map((field, index) => `
                 <tr style="border-bottom: 1px solid #cbd5e0; background-color: ${index % 2 === 0 ? '#fff' : '#f7fafc'}">
                   <td style="padding: 8px 12px; width: 35%; font-weight: 700; color: #2d3748; border-right: 1px solid #cbd5e0; background-color: #edf2f7;">
                     ${field.label}
                   </td>
                   <td style="padding: 8px 12px; color: #2d3748; font-weight: 500;">
                     ${field.value}
                   </td>
                 </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    // 2. Render Complex Tables
    tables.forEach(t => {
      html += this.renderTableSection(t.title, t.rows);
    });

    return html;
  }

  renderTableSection(title, rows) {
    if (!rows || rows.length === 0) return '';

    // Get headers from first row
    if (!rows[0]) return '';
    const headers = Object.keys(rows[0]).filter(k => k !== 'id');

    return `
      <div class="section">
        <div class="section-title">${title}</div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 10pt; border: 1px solid #e2e8f0;">
          <thead>
            <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
              ${headers.map(h => `
                <th style="padding: 10px; text-align: left; font-weight: 700; color: #2d3748; text-transform: capitalize; border-right: 1px solid #cbd5e1;">
                  ${h.replace(/([A-Z])/g, ' $1')}
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr style="border-bottom: 1px solid #e2e8f0;">
                ${headers.map(h => `
                  <td style="padding: 8px 10px; color: #1a202c; border-right: 1px solid #e2e8f0;">
                    ${typeof row[h] === 'object'
        ? (row[h]?.label || row[h]?.value || '-') // Handle dropdown objects
        : (row[h] || '-')
      }
                  </td>
                `).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  generateCSS(styles) {
    return `
      @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Roboto:wght@300;400;500;700&display=swap');
      
      :root {
        --primary-color: #008080; /* Teal/Hospital Green-Blue */
        --secondary-color: #2c3e50; /* Dark Slate Blue */
        --accent-color: #f0fdfa; /* Minty White */
        --text-color: #333333;
        --border-color: #d1d5db;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Roboto', Helvetica, Arial, sans-serif;
        font-size: 9.5pt;
        line-height: 1.4;
        color: var(--text-color);
        background: white;
      }
      
      .prescription {
        max-width: 100%;
        margin: 0 auto;
        padding: 15px 25px; /* Reduced padding */
        position: relative;
        /* min-height removed to allow natural flow */
      }

      /* Watermark */
      .prescription::before {
        content: 'CONFIDENTIAL';
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 60pt;
        color: rgba(0, 128, 128, 0.04);
        z-index: -1;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 5px;
        pointer-events: none;
      }
      
      /* Header - Compact & Elegant */
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center; /* Center align items */
        padding-bottom: 10px;
        margin-bottom: 15px;
        border-bottom: 3px solid var(--primary-color);
      }
      
      .clinic-info {
        max-width: 65%;
      }

      .clinic-info h1 {
        color: var(--primary-color);
        font-family: 'Lora', serif;
        font-size: 22pt;
        font-weight: 700;
        margin-bottom: 2px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .clinic-info p {
        font-size: 8.5pt;
        color: #555;
        line-height: 1.3;
      }
      
      .doctor-info {
        text-align: right;
        min-width: 30%;
      }
      
      .doctor-info h2 {
        color: var(--secondary-color);
        font-family: 'Lora', serif;
        font-size: 14pt;
        font-weight: 700;
        margin-bottom: 0px;
      }

      .doctor-info p {
        font-size: 8.5pt;
        color: #555;
      }
      
      /* Patient Info - Very Compact Strip */
      .patient-info {
        background-color: var(--accent-color);
        border: 1px solid var(--primary-color);
        border-radius: 4px;
        padding: 8px 12px;
        margin-bottom: 15px; /* Reduced margin */
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 10px;
      }
      
      .patient-info div {
        display: flex;
        align-items: center;
      }

      .patient-info p {
        margin: 0;
        font-size: 9.5pt;
        color: #333;
      }
      
      .patient-info strong {
        font-weight: 700;
        color: var(--secondary-color);
        text-transform: uppercase;
        font-size: 8pt;
        margin-right: 6px;
      }
      
      .section {
        margin-bottom: 15px;
        page-break-inside: auto; /* Allow breaking inside sections if needed */
      }

      .section-title {
        font-family: 'Lora', serif;
        font-weight: 700;
        color: var(--primary-color);
        border-bottom: 2px solid var(--primary-color);
        background: transparent;
        font-size: 12pt;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 2px 0;
        margin-bottom: 8px;
        width: 100%;
        display: block;
      }
      
      /* Vitals Grid */
      .vitals-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 10px 20px;
        background: white;
        padding: 5px 0;
        border: none;
      }
      
      .vital-item {
        font-size: 9.5pt;
        border: 1px solid #eee;
        padding: 4px 8px;
        border-radius: 4px;
        background: #f9fafb;
      }
      .vital-label { font-weight: 700; color: #555; font-size: 8pt; margin-right: 5px; }
      .vital-value { font-weight: 700; color: var(--primary-color); font-size: 9.5pt; }
      
      /* Lists and Tables */
      ul { padding-left: 20px; }
      li { margin-bottom: 2px; }
      
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 9pt;
        margin-top: 5px;
        background: white;
      }
      
      th {
        text-align: left;
        font-weight: 700;
        color: var(--primary-color);
        background-color: #e0f2f1; /* Light Teal Background */
        border: 1px solid var(--primary-color);
        padding: 6px 8px;
        font-size: 8.5pt;
        text-transform: uppercase;
      }
      
      td {
        padding: 6px 8px;
        border: 1px solid #e2e8f0;
        vertical-align: top;
        color: #333;
      }
      
      tr:nth-child(even) { background-color: #f8fafc; }

      .bordered-table th { border: 1px solid var(--primary-color); }
      .bordered-table td { border: 1px solid #e2e8f0; }

      tr:last-child td { border-bottom: 1px solid #e2e8f0; }
      
      .footer {
        margin-top: 20px;
        padding-top: 10px;
        border-top: 1px solid #ccc;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }

      .signature-line {
        border-top: 1px solid #333;
        padding-top: 5px;
        font-weight: 600;
        font-size: 9pt;
        text-align: center;
        min-width: 150px;
        color: #333;
      }
      
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .prescription { padding: 0.1in 0.25in; }
      }
    `;
  }

  generateHeader(data) {
    // Default Caduceus Logo (Base64 placeholder)
    const defaultLogo = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDA4MDgwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDJMMiA3bDEwIDUgMTAtNS0xMC01ek0yIDE3bDEwIDUgMTAtNU0yIDEybDEwIDUgMTAtNSIvPjwvc3ZnPg=='; // Simple geometric shape as placeholder
    const logoSrc = data.clinic.logo || "https://cdn-icons-png.flaticon.com/512/3063/3063176.png"; // Use a public medical icon if no logo

    return `
      <div class="header">
        <div class="logo" style="margin-right: 15px;">
           <img src="${logoSrc}" alt="Logo" style="height: 60px; width: auto;">
        </div>
        <div class="clinic-info" style="flex-grow: 1;">
          <h1>${data.clinic.name}</h1>
          <p>${data.clinic.address}</p>
          <p><strong>Phone:</strong> ${data.clinic.phone} ${data.clinic.email ? `| <strong>Email:</strong> ${data.clinic.email}` : ''}</p>
        </div>
        <div class="doctor-info">
          <h2>${data.doctor.name}</h2>
          <p>${data.doctor.qualification}</p>
          <p style="color: var(--primary-color); font-weight: 600;">${data.doctor.specialization}</p>
          <p>Reg: ${data.doctor.registrationNo}</p>
        </div>
      </div>
  `;
  }

  generatePatientInfo(data) {
    return `
      <div class="patient-info">
        <p><strong>Patient:</strong> ${data.patient.name}</p>
        <p><strong>Age/Sex:</strong> ${data.patient.age || 'N/A'} / ${data.patient.gender}</p>
        <p><strong>Date:</strong> ${new Date(data.visit.date).toLocaleDateString()}</p>
        <p><strong>Patient ID:</strong> ${data.patient.patientId}</p>
      </div>
  `;
  }

  generateVitals(data) {
    const vitals = this.formatVitals(data.vitals);
    if (vitals.length === 0) return '';

    return `
      <div class="section">
        <div class="section-title">Vitals</div>
        <div class="vitals-grid">
          ${vitals.map(v => `<div class="vital-item">${v}</div>`).join('')}
        </div>
      </div>
  `;
  }

  generateDiagnosis(data) {
    if (!data.diagnosis || data.diagnosis.length === 0) return '';

    const diagnosisArray = Array.isArray(data.diagnosis) ? data.diagnosis : [data.diagnosis];

    return `
      <div class="section">
        <div class="section-title">Diagnosis</div>
        <p>${diagnosisArray.join(', ')}</p>
      </div>
  `;
  }

  generateMedications(data) {
    if (!data.medications || (Array.isArray(data.medications) && data.medications.length === 0)) return '';

    const meds = Array.isArray(data.medications) ? data.medications : [data.medications];

    return `
      <div class="section">
        <div class="section-title"><span class="rx-symbol">℞</span> Medications</div>
        <ul class="medications-list">
          ${meds.map((med, i) => `
            <li class="medication-item">${this.formatMedication(med, i)}</li>
          `).join('')}
        </ul>
      </div>
  `;
  }

  generateInvestigations(data) {
    if (!data.investigations || (Array.isArray(data.investigations) && data.investigations.length === 0)) return '';

    const invs = Array.isArray(data.investigations) ? data.investigations : [data.investigations];

    return `
      <div class="section">
        <div class="section-title">Investigations</div>
        <ul class="investigation-list">
          ${invs.map(inv => {
      let val = inv;
      if (typeof inv === 'object' && inv !== null) {
        val = inv.name || inv.label || inv.value || inv.testName || JSON.stringify(inv);
      }
      return `<li>${val}</li>`;
    }).join('')}
        </ul>
      </div>
    `;
  }

  // NEW: Generate Medical Report HTML (Case Sheet style)
  generateReportHTML(data, template = null) {
    if (template?.id === 'template-semen-analysis') {
      return this.generateSemenAnalysisReportHTML(data, template);
    }

    const styles = template?.styling || this.getDefaultStyles();
    const dynamicSections = template && template.sections
      ? this.generateTemplateSections(data, template)
      : this.generateDynamicSections(data);

    return `
<!DOCTYPE html>
<html>
      <head>
        <meta charset="UTF-8">
          <title>Medical Report - ${data.patient.name}</title>
          <style>
            ${this.generateCSS(styles)}
            .rx-symbol {display: none; }
            .prescription::before {content: 'REPORT'; }
            .section-title {border-bottom: 2px solid #2d3748; padding-bottom: 5px; margin-bottom: 10px; }
          </style>
      </head>
      <body>
        <div class="prescription">
          ${this.generateHeader(data)}

          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="text-transform: uppercase; letter-spacing: 1px; color: #2d3748;">Medical Consultation Report</h2>
          </div>

          ${this.generatePatientInfo(data)}

          <!-- All Dynamic Tables & History -->
          ${dynamicSections}

          <!-- Standard Clinical Data -->
          ${this.generateVitals(data)}
          ${this.generateDiagnosis(data)}
          ${this.generateMedications(data)}
          ${this.generateInvestigations(data)}
          ${this.generateAdvice(data)}
          ${this.generateFollowUp(data)}

          ${this.generateFooter(data)}
        </div>
      </body>
    </html>
`;
  }

  // --- TEMPLATE BASED RENDERER ---
  generateTemplateSections(data, template) {
    if (!template || !template.sections) return '';

    let html = '';

    template.sections.forEach(section => {
      // Check if section has any data to show
      const hasData = section.fields && section.fields.some(field => {
        const value = data[field.id];
        return value !== undefined && value !== null && value !== '' && (Array.isArray(value) ? value.length > 0 : true);
      });

      if (!hasData) return '';

      html += `<div class="section">
        <div class="section-title">${section.title}</div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
          <tbody>`;

      section.fields.forEach((field, index) => {
        if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) return;

        // Smart Value Processing
        let processedValue = value;
        let isTableData = false;

        if (Array.isArray(value) && value.length > 0) {
          // Attempt to parse if strings (e.g. from JSON field)
          if (typeof value[0] === 'string' && value[0].trim().startsWith('{')) {
            try {
              processedValue = value.map(v => JSON.parse(v));
              isTableData = true;
            } catch (e) {
              // Fallback: just strings
            }
          } else if (typeof value[0] === 'object' && value[0] !== null) {
            isTableData = true;
          }
        }

        // Check if it's an array of objects (Table Data)
        if (isTableData && processedValue.length > 0) {
          // Render as a Table
          // Clean headers: remove 'id' or empty keys
          const headers = Object.keys(processedValue[0]).filter(k => k !== 'id' && k !== 'undefined');

          html += `
            <tr>
              <td colspan="2" style="padding: 10px 0;">
                <div style="font-weight: 700; color: var(--secondary-color); margin-bottom: 5px; font-size: 9.5pt; text-transform: uppercase;">${field.label}</div>
                <table class="bordered-table" style="width: 100%; border-collapse: collapse; font-size: 9pt;">
                  <thead>
                    <tr>
                      ${headers.map(h => `<th style="text-transform: capitalize;">${h.replace(/([A-Z])/g, ' $1').trim()}</th>`).join('')}
                    </tr>
                  </thead>
                  <tbody>
                    ${processedValue.map((row, i) => `
                      <tr>
                        ${headers.map(h => {
            let cellVal = row[h];
            if (typeof cellVal === 'boolean') cellVal = cellVal ? 'Yes' : 'No';
            return `<td>${cellVal || '-'}</td>`;
          }).join('')}
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </td>
            </tr>
          `;
        } else {
          // Render as Key-Value
          let displayValue = value;

          if (Array.isArray(value)) {
            displayValue = value.join(', ');
          } else if (typeof value === 'boolean') {
            displayValue = value ? 'Yes' : 'No';
          } else if (typeof value === 'object' && value !== null) {
            displayValue = value.label || value.value || Object.values(value).join(', ');
          }

          html += `
            <tr style="border-bottom: 1px solid #e2e8f0; background-color: ${index % 2 === 0 ? '#fff' : '#fcfcfc'}">
              <td style="width: 35%; padding: 5px 7px; font-weight: 600; color: #555;">${field.label}</td>
              <td style="padding: 5px 7px; color: #222;">${displayValue}</td>
            </tr>
          `;
        }
      });

      html += `</tbody></table></div>`;
    });

    return html;
  }

  // --- SPECIALIZED SEMEN ANALYSIS RENDERER ---
  generateSemenAnalysisReportHTML(data, template) {
    const styles = this.getDefaultStyles();

    // Helper helper to render a 2-column group
    const renderGroup = (title, fields) => {
      const rows = [];
      const keys = Object.keys(fields);
      for (let i = 0; i < keys.length; i += 2) {
        rows.push([
          { k: keys[i], v: fields[keys[i]] },
          keys[i + 1] ? { k: keys[i + 1], v: fields[keys[i + 1]] } : null
        ]);
      }

      return `
        <div class="section" style="border: 1px solid var(--border-color); margin-bottom: 15px; border-radius: 4px; overflow: hidden;">
          <div class="section-title" style="background: var(--secondary-color); color: white; padding: 6px 10px; margin: 0; border-bottom: 1px solid var(--secondary-color); font-size: 10pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
            ${title}
          </div>
          <table class="bordered-table" style="width: 100%; border-collapse: collapse; font-size: 9.5pt;">
            <tbody>
              ${rows.map(row => `
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="width: 25%; padding: 8px 10px; font-weight: 700; color: var(--secondary-color); background: var(--accent-color);">${row[0].k}</td>
                  <td style="width: 25%; padding: 8px 10px; border-right: 1px solid var(--border-color);">: ${data[row[0].v] || '-'}</td>
                  
                  <td style="width: 25%; padding: 8px 10px; font-weight: 700; color: var(--secondary-color); background: var(--accent-color);">${row[1] ? row[1].k : ''}</td>
                  <td style="width: 25%; padding: 8px 10px;">${row[1] ? ': ' + (data[row[1].v] || '-') : ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    };

    return `
<!DOCTYPE html>
<html>
      <head>
        <meta charset="UTF-8">
          <title>Semen Analysis - ${data.patient.name}</title>
          <style>
            ${this.generateCSS(styles)}
            .prescription {max-width: 900px; padding: 30px; }
            .prescription::before {content: 'ANALYSIS'; opacity: 0.05; }
          </style>
      </head>
      <body>
        <div class="prescription">
          ${this.generateHeader(data)}

          <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px solid #000; padding-bottom: 10px;">
            <h2 style="text-transform: uppercase; font-size: 16pt; letter-spacing: 2px;">Semen Analysis</h2>
          </div>

          <!-- Partner Info -->
          <div class="section" style="margin-bottom: 20px;">
            <table style="width: 100%; font-size: 10pt; font-weight: 600;">
              <tr>
                <td style="padding: 2px;">Patient ID: ${data.malePartnerID || data.patient.patientId || '-'}</td>
                <td style="padding: 2px;">Partner ID: ${data.femalePartnerID || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 2px;">Male Name: ${data.malePartnerName || data.patient.name}</td>
                <td style="padding: 2px;">Female Name: ${data.femalePartnerName || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 2px;">Age: ${data.malePartnerAge || data.patient.age || '-'}</td>
                <td style="padding: 2px;">Age: ${data.femalePartnerAge || '-'}</td>
              </tr>
            </table>
          </div>

          <!-- General Info -->
          ${renderGroup('General Information', {
      'Sample Collection Type': 'collectionType', 'Time of Examination': 'examTime',
      'Mode of Collection': 'modeOfCollection', 'Abstinence Period': 'abstinencePeriod',
      'Time of Collection': 'collectionTime', 'Complete Collection': 'completeCollection'
    })}

          <!-- Macroscopic -->
          ${renderGroup('Macroscopic Examination', {
      'Volume': 'volume', 'pH': 'ph',
      'Appearance': 'appearance', 'Time of Liquefaction': 'liquefactionTime',
      'Viscosity': 'viscosity'
    })}

          <!-- Microscopic -->
          ${renderGroup('Microscopic Examination', {
      'Sperm Concentration': 'spermConcentration', 'TMSC': 'totalMotile',
      'Total Sperm Number': 'totalSpermCount', 'Vitality': 'vitality',
      'Rapid Prog. Motility': 'rapidMotility', 'Agglutination': 'agglutination',
      'Slow Prog. Motility': 'slowMotility', 'Round Cells / HPF': 'roundCells',
      'Non-Prog. Motility': 'nonProgressive', 'Other Cells': 'otherCells',
      'Immotile Sperm': 'immotileSperm'
    })}

          <!-- Morphology -->
          ${renderGroup('Morphology', {
      'Normal Forms': 'normalForms', 'Midpiece Abnormalities': 'midpieceAbnormalities',
      'Abnormal Forms': 'abnormalForms', 'Tail Abnormalities': 'tailAbnormalities',
      'Head Abnormalities': 'headAbnormalities', 'Cytoplasmic Droplets': 'cytoplasmicDroplets'
    })}

          <!-- Reference Footer -->
          <div class="section" style="background: #f1f5f9; padding: 10px; font-size: 7.5pt; border: 1px solid #cbd5e0; margin-top: 20px;">
            <strong>WHO reference values 2021 6th Edition</strong>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 5px;">
              <div>Volume: >= 1.4 ml</div> <div>Sperm Conc: >= 16 M/ml</div>
              <div>Total Motility: >= 42%</div> <div>Vitality: >= 54%</div>
              <div>Normal Forms: >= 4%</div>   <div>pH: >= 7.2</div>
            </div>
          </div>

          <div class="footer" style="margin-top: 40px; display: flex; justify-content: space-between;">
            <div class="signature">
              <div class="signature-line">Andrologist</div>
            </div>
            <div class="signature">
              <div class="signature-line">Consultant</div>
            </div>
          </div>
        </div>
      </body>
    </html>
`;
  }

  generateAdvice(data) {
    if (!data.advice || (Array.isArray(data.advice) && data.advice.length === 0)) return '';

    // Ensure array
    const adviceList = Array.isArray(data.advice)
      ? data.advice
      : (typeof data.advice === 'string' ? data.advice.split('\n').filter(Boolean) : [data.advice]);

    if (adviceList.length === 0) return '';

    return `
      <div class="section">
        <div class="section-title">Advice</div>
        <ul class="advice-list">
          ${adviceList.map(adv => `<li>${adv}</li>`).join('')}
        </ul>
      </div>
  `;
  }

  generateFollowUp(data) {
    if (!data.followUp) return '';

    return `
      <div class="section">
        <div class="section-title">Follow-up</div>
        <p>Please visit on: <strong>${new Date(data.followUp).toLocaleDateString()}</strong></p>
      </div>
  `;
  }

  generateFooter(data) {
    return `
      <div class="footer">
        <div class="notes">
          ${data.notes ? `<p><em>${data.notes}</em></p>` : ''}
        </div>
        <div class="signature">
          <div class="signature-line">
            ${data.doctor.name}
          </div>
        </div>
      </div>
  `;
  }

  getDefaultStyles() {
    return {
      primaryColor: '#1976d2',
      secondaryColor: '#666',
      fontFamily: 'Arial, sans-serif',
      headerFontSize: '18pt',
      bodyFontSize: '12pt',
      lineHeight: '1.5',
    };
  }

  // Open print dialog
  print(data, template = null) {
    const html = this.generatePrintHTML(data, template);
    this.triggerPrint(html);
  }

  // Print Report (Case Sheet)
  printReport(data, template = null) {
    const html = this.generateReportHTML(data, template);
    this.triggerPrint(html);
  }

  // Helper to trigger print using iframe to avoid popup blockers
  triggerPrint(html) {
    // Create hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '0';
    iframe.style.top = '0';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';

    // Ensure it's part of the document
    document.body.appendChild(iframe);

    // Get the iframe's document
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    // Wait for content to render then print
    setTimeout(() => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (e) {
        console.error('Print failed:', e);
        alert('Printing failed. Please check your browser settings.');
      } finally {
        // Cleanup after a delay to allow print dialog to function
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 5000);
      }
    }, 500);
  }

  // Download as PDF (using browser print to PDF)
  // Note: For actual file download we might need a library like html2pdf or jsPDF, 
  // but "Print to PDF" is often what is intended by browser-based apps without heavy deps.
  downloadPDF(data, template = null, filename = 'prescription.pdf') {
    const html = this.generatePrintHTML(data, template);
    this.triggerPrint(html);
  }
}

// Singleton instance
export const pdfEngine = new PDFEngine();

// Factory function
export const createPDFEngine = () => new PDFEngine();

export default PDFEngine;