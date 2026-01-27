// src/components/PDFRenderer/PrescriptionPDF.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#333',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#1976d2',
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clinicName: {
    fontSize: 24,
    color: '#1976d2',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clinicInfo: {
    fontSize: 9,
    color: '#666',
  },
  doctorInfo: {
    textAlign: 'right',
  },
  doctorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  patientInfoBox: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 4,
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  patientText: {
    width: '50%',
    marginBottom: 4,
    fontSize: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1976d2',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 8,
    marginTop: 10,
    paddingBottom: 2,
  },
  vitalsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  vitalItem: {
    width: '25%',
    fontSize: 10,
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  rxSymbol: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginRight: 5,
  },
  medicationRow: {
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  medName: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  medDetails: {
    fontSize: 10,
    color: '#444',
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureLine: {
    width: 150,
    borderTopWidth: 1,
    borderTopColor: '#000',
    marginTop: 40,
    textAlign: 'center',
    fontSize: 10,
  },
});

/**
 * PDF Document Component
 */
const PrescriptionPDF = ({ data, template }) => {
  const { patient, visit, doctor, clinic, vitals, medications, diagnosis, investigations, advice } = data;

  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'N/A';

  return (
    <Document>
      <Page size={template?.pageSize || 'A4'} style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.clinicName}>{clinic.name}</Text>
            <Text style={styles.clinicInfo}>{clinic.address}</Text>
            <Text style={styles.clinicInfo}>{clinic.phone} | {clinic.email}</Text>
          </View>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.clinicInfo}>{doctor.qualification}</Text>
            <Text style={styles.clinicInfo}>{doctor.specialization}</Text>
            <Text style={styles.clinicInfo}>Reg: {doctor.registrationNo}</Text>
          </View>
        </View>

        {/* Patient Info */}
        <View style={styles.patientInfoBox}>
          <Text style={styles.patientText}>Name: {patient.name}</Text>
          <Text style={styles.patientText}>Date: {formatDate(visit.date)}</Text>
          <Text style={styles.patientText}>Age/Sex: {patient.age} / {patient.gender}</Text>
          <Text style={styles.patientText}>ID: {patient.patientId}</Text>
        </View>

        {/* Vitals */}
        {vitals && Object.keys(vitals).length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Vitals</Text>
            <View style={styles.vitalsRow}>
              {vitals.temperature && <Text style={styles.vitalItem}>Temp: {vitals.temperature}</Text>}
              {vitals.bloodPressureSystolic && <Text style={styles.vitalItem}>BP: {vitals.bloodPressureSystolic}/{vitals.bloodPressureDiastolic}</Text>}
              {vitals.heartRate && <Text style={styles.vitalItem}>HR: {vitals.heartRate}</Text>}
              {vitals.weight && <Text style={styles.vitalItem}>Wt: {vitals.weight}</Text>}
            </View>
          </View>
        )}

        {/* Diagnosis */}
        {diagnosis && diagnosis.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Diagnosis</Text>
            <Text style={{ fontSize: 10 }}>{Array.isArray(diagnosis) ? diagnosis.join(', ') : diagnosis}</Text>
          </View>
        )}

        {/* Medications */}
        {medications && medications.length > 0 && (
          <View style={{ marginTop: 15 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
              <Text style={styles.rxSymbol}>Rx</Text>
              <Text style={styles.sectionTitle}>Medications</Text>
            </View>
            {medications.map((med, index) => (
              <View key={index} style={styles.medicationRow}>
                <Text style={styles.medName}>
                  {index + 1}. {med.name} {med.dose && `- ${med.dose}`}
                </Text>
                <Text style={styles.medDetails}>
                  {med.frequency} | {med.duration} | {med.route}
                  {med.instructions ? ` | [${med.instructions}]` : ''}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Investigations */}
        {investigations && investigations.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.sectionTitle}>Investigations</Text>
            {investigations.map((inv, i) => (
              <Text key={i} style={{ fontSize: 10, marginBottom: 2 }}>• {inv}</Text>
            ))}
          </View>
        )}

        {/* Advice */}
        {advice && advice.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.sectionTitle}>Advice</Text>
            {advice.map((adv, i) => (
              <Text key={i} style={{ fontSize: 10, marginBottom: 2 }}>• {adv}</Text>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View>
            <Text style={{ fontSize: 8, color: '#999' }}>Generated by ADAPTA</Text>
            <Text style={{ fontSize: 8, color: '#999' }}>{new Date().toLocaleString()}</Text>
          </View>
          <View>
            <Text style={styles.signatureLine}>{doctor.name}</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
};

export default PrescriptionPDF;