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

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Prescription - ${data.patient.name}</title>
        <style>
          ${this.generateCSS(styles)}
        </style>
      </head>
      <body>
        <div class="prescription">
          ${this.generateHeader(data)}
          ${this.generatePatientInfo(data)}
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
    if (!data.medications || data.medications.length === 0) return '';

    return `
      <div class="section">
        <div class="section-title"><span class="rx-symbol">℞</span> Medications</div>
        <ul class="medications-list">
          ${data.medications.map((med, i) => `
            <li class="medication-item">${this.formatMedication(med, i)}</li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  generateInvestigations(data) {
    if (!data.investigations || data.investigations.length === 0) return '';

    return `
      <div class="section">
        <div class="section-title">Investigations</div>
        <ul class="investigation-list">
          ${data.investigations.map(inv => `<li>${typeof inv === 'object' ? inv.name : inv}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  generateAdvice(data) {
    if (!data.advice || data.advice.length === 0) return '';

    return `
      <div class="section">
        <div class="section-title">Advice</div>
        <ul class="advice-list">
          ${data.advice.map(adv => `<li>${adv}</li>`).join('')}
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