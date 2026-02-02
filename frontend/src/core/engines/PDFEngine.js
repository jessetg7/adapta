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
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Inter', sans-serif;
        font-size: 11pt;
        line-height: 1.6;
        color: #1a202c;
        background: white;
      }
      
      .prescription {
        max-width: 850px;
        margin: 0 auto;
        padding: 40px;
        position: relative;
        min-height: 1100px;
      }

      /* Watermark */
      .prescription::before {
        content: 'Prescription';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 100pt;
        color: #f7fafc;
        z-index: -1;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 10px;
        pointer-events: none;
      }
      
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-bottom: 30px;
        margin-bottom: 30px;
        border-bottom: 3px solid ${styles.primaryColor || '#1976d2'};
      }
      
      .clinic-info {
        max-width: 60%;
      }

      .clinic-info h1 {
        color: ${styles.primaryColor || '#1976d2'};
        font-size: 24pt;
        font-weight: 700;
        margin-bottom: 8px;
        letter-spacing: -1px;
      }
      
      .clinic-info p {
        font-size: 9.5pt;
        color: #4a5568;
        line-height: 1.4;
      }
      
      .doctor-info {
        text-align: right;
      }
      
      .doctor-info h2 {
        color: #2d3748;
        font-size: 16pt;
        font-weight: 700;
        margin-bottom: 4px;
      }

      .doctor-info p {
        font-size: 9pt;
        color: #718096;
      }
      
      .patient-info {
        background: #f8fafc;
        padding: 20px 25px;
        border-radius: 12px;
        margin-bottom: 30px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
        border: 1px solid #e2e8f0;
      }
      
      .info-item {
        display: flex;
        flex-direction: column;
      }

      .info-label {
        font-size: 8pt;
        text-transform: uppercase;
        color: #a0aec0;
        font-weight: 700;
        letter-spacing: 0.5px;
      }

      .info-value {
        font-size: 10.5pt;
        color: #1a202c;
        font-weight: 600;
      }
      
      .section {
        margin-bottom: 25px;
      }
      
      .section-title {
        font-weight: 700;
        color: ${styles.primaryColor || '#1976d2'};
        font-size: 11pt;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
      }

      .section-title::after {
        content: '';
        flex-grow: 1;
        height: 1px;
        background: #edf2f7;
        margin-left: 15px;
      }
      
      .vitals-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 15px;
      }
      
      .vital-item {
        padding: 12px;
        background: #fff;
        border: 1px solid #edf2f7;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
      }

      .vital-label { font-size: 8pt; color: #718096; }
      .vital-value { font-size: 11pt; font-weight: 700; color: #1a202c; }
      
      .rx-container {
        display: flex;
        align-items: flex-start;
      }

      .rx-symbol {
        font-size: 40pt;
        font-weight: 800;
        color: ${styles.primaryColor || '#1976d2'};
        margin-right: 25px;
        font-family: 'Times New Roman', serif;
        opacity: 0.15;
        line-height: 1;
      }

      .medications-list {
        list-style: none;
        flex-grow: 1;
      }
      
      .medication-item {
        padding: 12px 0;
        border-bottom: 1px solid #f7fafc;
      }
      
      .med-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
      }

      .med-name { font-weight: 700; font-size: 11.5pt; }
      .med-freq { color: ${styles.primaryColor || '#1976d2'}; font-weight: 600; font-size: 10pt; }
      .med-details { font-size: 9.5pt; color: #718096; }
      
      .footer {
        margin-top: auto;
        padding-top: 40px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }

      .qr-code {
        width: 80px;
        height: 80px;
        background: #f7fafc;
        border: 1px solid #edf2f7;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8pt;
        color: #cbd5e0;
        border-radius: 4px;
      }
      
      .signature {
        text-align: right;
        min-width: 250px;
      }
      
      .signature-img {
         max-height: 60px;
         margin-bottom: 10px;
         filter: grayscale(1) contrast(1.5);
      }

      .signature-line {
        border-top: 1px solid #2d3748;
        padding-top: 8px;
        font-weight: 700;
        color: #2d3748;
      }
      
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .prescription { padding: 0.5in; }
      }
    `;
  }

  generateHeader(data) {
    return `
      <div class="header">
        <div class="clinic-info">
          ${data.clinic.logo ? `<img src="${data.clinic.logo}" alt="Logo" style="max-height: 60px;">` : ''}
          <h1>${data.clinic.name}</h1>
          <p>${data.clinic.address}</p>
          <p>Phone: ${data.clinic.phone} ${data.clinic.email ? `| Email: ${data.clinic.email}` : ''}</p>
        </div>
        <div class="doctor-info">
          <h2>${data.doctor.name}</h2>
          <p>${data.doctor.qualification}</p>
          <p>${data.doctor.specialization}</p>
          <p>Reg. No: ${data.doctor.registrationNo}</p>
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
          ${invs.map(inv => `<li>${typeof inv === 'object' ? inv.name : inv}</li>`).join('')}
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
    const dynamicSections = this.generateDynamicSections(data);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Medical Report - ${data.patient.name}</title>
        <style>
          ${this.generateCSS(styles)}
          .rx-symbol { display: none; }
          .prescription::before { content: 'REPORT'; } 
          .section-title { border-bottom: 2px solid #2d3748; padding-bottom: 5px; margin-bottom: 10px; }
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
        <div class="section" style="border: 1px solid #cbd5e0; margin-bottom: 15px; border-radius: 4px; overflow: hidden;">
          <div class="section-title" style="background: #e2e8f0; padding: 5px 10px; margin: 0; border-bottom: 1px solid #cbd5e0; font-size: 10pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
            ${title}
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 10pt;">
            <tbody>
              ${rows.map(row => `
                <tr style="border-bottom: 1px solid #edf2f7;">
                  <td style="width: 25%; padding: 6px 10px; font-weight: 600; color: #4a5568;">${row[0].k}</td>
                  <td style="width: 25%; padding: 6px 10px; border-right: 1px solid #edf2f7;">: ${data[row[0].v] || '-'}</td>
                  
                  <td style="width: 25%; padding: 6px 10px; font-weight: 600; color: #4a5568;">${row[1] ? row[1].k : ''}</td>
                  <td style="width: 25%; padding: 6px 10px;">${row[1] ? ': ' + (data[row[1].v] || '-') : ''}</td>
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
          .prescription { max-width: 900px; padding: 40px; }
          .prescription::before { content: 'ANALYSIS'; opacity: 0.05; }
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
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }

  // Print Report (Case Sheet)
  printReport(data, template = null) {
    const html = this.generateReportHTML(data, template);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  }

  // Download as PDF (using browser print to PDF)
  downloadPDF(data, template = null, filename = 'prescription.pdf') {
    const html = this.generatePrintHTML(data, template);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();

    // Trigger print dialog for PDF save
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}

// Singleton instance
export const pdfEngine = new PDFEngine();

// Factory function
export const createPDFEngine = () => new PDFEngine();

export default PDFEngine;