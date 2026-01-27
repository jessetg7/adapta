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
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: ${styles.fontFamily || 'Arial, sans-serif'};
        font-size: ${styles.bodyFontSize || '12pt'};
        line-height: ${styles.lineHeight || '1.5'};
        color: #333;
      }
      
      .prescription {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      
      .header {
        border-bottom: 2px solid ${styles.primaryColor || '#1976d2'};
        padding-bottom: 15px;
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;
      }
      
      .clinic-info h1 {
        color: ${styles.primaryColor || '#1976d2'};
        font-size: ${styles.headerFontSize || '18pt'};
        margin-bottom: 5px;
      }
      
      .clinic-info p {
        font-size: 10pt;
        color: #666;
      }
      
      .doctor-info {
        text-align: right;
      }
      
      .doctor-info h2 {
        color: ${styles.primaryColor || '#1976d2'};
        font-size: 14pt;
      }
      
      .patient-info {
        background: #f5f5f5;
        padding: 10px 15px;
        border-radius: 5px;
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
      }
      
      .patient-info p {
        margin: 3px 15px 3px 0;
      }
      
      .section {
        margin-bottom: 15px;
      }
      
      .section-title {
        font-weight: bold;
        color: ${styles.primaryColor || '#1976d2'};
        border-bottom: 1px solid #ddd;
        padding-bottom: 5px;
        margin-bottom: 10px;
        font-size: 12pt;
      }
      
      .vitals-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        background: #fff;
      }
      
      .vital-item {
        padding: 5px;
        background: #f9f9f9;
        border-radius: 3px;
        font-size: 10pt;
      }
      
      .medications-list {
        list-style: none;
      }
      
      .medication-item {
        padding: 8px 0;
        border-bottom: 1px dashed #ddd;
      }
      
      .medication-item:last-child {
        border-bottom: none;
      }
      
      .rx-symbol {
        font-size: 18pt;
        color: ${styles.primaryColor || '#1976d2'};
        margin-right: 10px;
      }
      
      .advice-list, .investigation-list {
        list-style: disc;
        margin-left: 20px;
      }
      
      .footer {
        margin-top: 30px;
        border-top: 1px solid #ddd;
        padding-top: 15px;
        display: flex;
        justify-content: space-between;
      }
      
      .signature {
        text-align: right;
      }
      
      .signature-line {
        width: 200px;
        border-top: 1px solid #333;
        margin-top: 50px;
        padding-top: 5px;
      }
      
      @media print {
        body {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        
        .prescription {
          padding: 0;
        }
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