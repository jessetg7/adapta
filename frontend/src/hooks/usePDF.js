// src/hooks/usePDF.js
import { useCallback } from 'react';
import PDFEngine from '../core/engines/PDFEngine';

/**
 * Hook for PDF generation
 */
export const usePDF = () => {
  const pdfEngine = new PDFEngine();

  // Generate prescription data
  const generatePrescriptionData = useCallback((prescription, patient, doctor, clinicInfo) => {
    return pdfEngine.generatePrescriptionData(prescription, patient, doctor, clinicInfo);
  }, []);

  // Print prescription
  const printPrescription = useCallback((prescription, patient, doctor, clinicInfo, template = null) => {
    const data = pdfEngine.generatePrescriptionData(prescription, patient, doctor, clinicInfo);
    pdfEngine.print(data, template);
  }, []);

  // Download prescription as PDF
  const downloadPrescription = useCallback((prescription, patient, doctor, clinicInfo, template = null) => {
    const data = pdfEngine.generatePrescriptionData(prescription, patient, doctor, clinicInfo);
    const filename = `prescription_${patient?.lastName || 'patient'}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdfEngine.downloadPDF(data, template, filename);
  }, []);

  // Generate HTML preview
  const generatePreviewHTML = useCallback((prescription, patient, doctor, clinicInfo, template = null) => {
    const data = pdfEngine.generatePrescriptionData(prescription, patient, doctor, clinicInfo);
    return pdfEngine.generatePrintHTML(data, template);
  }, []);

  return {
    generatePrescriptionData,
    printPrescription,
    downloadPrescription,
    generatePreviewHTML,
  };
};

export default usePDF;