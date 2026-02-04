// src/components/PDFRenderer/PrescriptionPDF.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatDate, formatVitals, shouldRenderSection } from '../PrescriptionBuilder/prescriptionUtils';

// Define styles dynamically based on template settings
const createStyles = (styling) => StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: styling.bodyFontSize ? parseInt(styling.bodyFontSize) : 11,
    color: '#333',
    lineHeight: styling.lineHeight || 1.4,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: styling.primaryColor || '#1976d2',
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clinicName: {
    fontSize: styling.headerFontSize ? parseInt(styling.headerFontSize) + 4 : 22,
    color: styling.primaryColor || '#1976d2',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clinicInfo: {
    fontSize: 9,
    color: '#666',
    marginBottom: 2,
  },
  doctorInfo: {
    textAlign: 'right',
  },
  doctorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: styling.primaryColor || '#1976d2',
    marginBottom: 2,
  },
  patientInfoBox: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 4,
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 0.5,
    borderColor: '#eee',
  },
  patientText: {
    width: '50%',
    marginBottom: 6,
    fontSize: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: styling.primaryColor || '#1976d2',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
    marginTop: 5,
    paddingBottom: 3,
    textTransform: 'uppercase',
  },
  vitalsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  vitalItem: {
    width: '33%',
    fontSize: 10,
    marginBottom: 6,
  },
  rxSymbol: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    marginRight: 8,
    color: styling.primaryColor || '#1976d2',
  },
  medicationRow: {
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  medName: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  medDetails: {
    fontSize: 10,
    color: '#555',
    marginTop: 3,
    paddingLeft: 12,
  },
  bulletItem: {
    fontSize: 10,
    marginBottom: 4,
    paddingLeft: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#eee',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
  },
  tableCell: {
    padding: 5,
    fontSize: 8,
    borderRightWidth: 0.5,
    borderRightColor: '#eee',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureLine: {
    width: 180,
    borderTopWidth: 1,
    borderTopColor: '#333',
    marginTop: 30,
    textAlign: 'center',
    fontSize: 10,
    paddingTop: 5,
  },
});

/**
 * PDF Document Component
 */
const PrescriptionPDF = ({ data, template }) => {
  const styling = template?.styling || {};
  const styles = createStyles(styling);
  const sections = template?.sections || [];
  const enabledSections = sections
    .filter(s => shouldRenderSection(s, data))
    .sort((a, b) => a.order - b.order);

  const renderSectionContent = (section) => {
    switch (section.type) {
      case 'header':
        return (
          <View style={styles.header} key={section.id}>
            <View>
              <Text style={styles.clinicName}>{data.clinic?.name || 'Medical Center'}</Text>
              <Text style={styles.clinicInfo}>{data.clinic?.address}</Text>
              <Text style={styles.clinicInfo}>{data.clinic?.phone} | {data.clinic?.email}</Text>
            </View>
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{data.doctor?.name}</Text>
              <Text style={styles.clinicInfo}>{data.doctor?.qualification}</Text>
              <Text style={styles.clinicInfo}>{data.doctor?.specialization}</Text>
              <Text style={styles.clinicInfo}>Reg. No: {data.doctor?.registrationNo}</Text>
            </View>
          </View>
        );

      case 'patient-info':
        return (
          <View style={styles.patientInfoBox} key={section.id}>
            <Text style={styles.patientText}>
              <Text style={styles.bold}>Patient: </Text>{data.patient?.name || 'N/A'}
            </Text>
            <Text style={styles.patientText}>
              <Text style={styles.bold}>Date: </Text>{formatDate(data.visit?.date || data.date)}
            </Text>
            <Text style={styles.patientText}>
              <Text style={styles.bold}>Age/Sex: </Text>{data.patient?.age || 'N/A'} / {data.patient?.gender || 'N/A'}
            </Text>
            <Text style={styles.patientText}>
              <Text style={styles.bold}>Patient ID: </Text>{data.patient?.patientId || 'N/A'}
            </Text>
          </View>
        );

      case 'vitals':
        const vitals = formatVitals(data.vitals);
        return (
          <View style={styles.section} key={section.id}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.vitalsRow}>
              {vitals.map((vital, i) => (
                <Text key={i} style={styles.vitalItem}>{vital}</Text>
              ))}
            </View>
          </View>
        );

      case 'diagnosis':
        const diagnosis = Array.isArray(data.diagnosis) ? data.diagnosis : (data.diagnosis ? [data.diagnosis] : []);
        return (
          <View style={styles.section} key={section.id}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={{ fontSize: 10 }}>
              {diagnosis.join(', ')}
            </Text>
          </View>
        );

      case 'medications':
        const medications = data.medications || [];
        return (
          <View style={styles.section} key={section.id}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.rxSymbol}>Rx</Text>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            {medications.map((med, index) => (
              <View key={index} style={styles.medicationRow}>
                <Text style={styles.medName}>
                  {index + 1}. {med.name} {med.dose && `- ${med.dose}`}
                </Text>
                <Text style={styles.medDetails}>
                  {med.route} | {med.frequency} | {med.duration}
                  {med.instructions ? ` | [${med.instructions}]` : ''}
                </Text>
              </View>
            ))}
          </View>
        );

      case 'investigations':
        const investigations = data.investigations || [];
        return (
          <View style={styles.section} key={section.id}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {investigations.map((inv, i) => (
              <Text key={i} style={styles.bulletItem}>• {typeof inv === 'object' ? inv.name : inv}</Text>
            ))}
          </View>
        );

      case 'advice':
        const adviceArray = Array.isArray(data.advice) ? data.advice : (data.advice ? data.advice.split('\n') : []);
        return (
          <View style={styles.section} key={section.id}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {adviceArray.map((adv, i) => (
              <Text key={i} style={styles.bulletItem}>• {adv}</Text>
            ))}
          </View>
        );

      case 'follow-up':
        const fuDate = data.followUp || data.followUpDate;
        return (
          <View style={styles.section} key={section.id}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={{ fontSize: 10 }}>
              Please visit on: <Text style={styles.bold}>{formatDate(fuDate)}</Text>
            </Text>
          </View>
        );

      case 'signature':
        return (
          <View style={styles.footer} key={section.id}>
            <View>
              <Text style={{ fontSize: 8, color: '#999' }}>Generated by ADAPTA Smart Systems</Text>
              <Text style={{ fontSize: 8, color: '#999' }}>{new Date().toLocaleString()}</Text>
            </View>
            <View>
              <View style={styles.signatureLine}>
                <Text style={styles.bold}>{data.doctor?.name}</Text>
                <Text style={{ fontSize: 8 }}>{data.doctor?.qualification}</Text>
              </View>
            </View>
          </View>
        );

      case 'table':
        const tableData = data[section.id] || [];
        const columns = section.config?.columns || [];
        return (
          <View style={styles.section} key={section.id}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                {columns.map(col => (
                  <View key={col.id} style={[styles.tableCell, { width: col.width || 'auto' }]}>
                    <Text style={styles.bold}>{col.header}</Text>
                  </View>
                ))}
              </View>
              {tableData.map((row, i) => (
                <View key={i} style={styles.tableRow}>
                  {columns.map(col => (
                    <View key={col.id} style={[styles.tableCell, { width: col.width || 'auto' }]}>
                      <Text>{row[col.id] || '-'}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size={template?.pageSize || 'A4'} style={styles.page}>
        {enabledSections.map(renderSectionContent)}
      </Page>
    </Document>
  );
};

export default PrescriptionPDF;