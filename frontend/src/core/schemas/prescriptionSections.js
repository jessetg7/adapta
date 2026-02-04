// src/core/schemas/prescriptionSections.js
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import MedicationIcon from '@mui/icons-material/Medication';
import ScienceIcon from '@mui/icons-material/Science';
import EventIcon from '@mui/icons-material/Event';
import NotesIcon from '@mui/icons-material/Notes';
import DrawIcon from '@mui/icons-material/Draw';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

export const SECTION_TYPES = {
    HEADER: 'header',
    PATIENT_INFO: 'patient-info',
    VITALS: 'vitals',
    DIAGNOSIS: 'diagnosis',
    MEDICATIONS: 'medications',
    INVESTIGATIONS: 'investigations',
    ADVICE: 'advice',
    FOLLOW_UP: 'follow-up',
    SIGNATURE: 'signature',
    TABLE: 'table',
};

export const DEFAULT_PRESCRIPTION_SECTIONS = [
    { id: 'header', type: SECTION_TYPES.HEADER, title: 'Clinic Header', enabled: true, order: 0, icon: 'LocalHospital' },
    { id: 'patient-info', type: SECTION_TYPES.PATIENT_INFO, title: 'Patient Information', enabled: true, order: 1, icon: 'Person' },
    { id: 'vitals', type: SECTION_TYPES.VITALS, title: 'Vitals', enabled: true, order: 2, icon: 'MonitorHeart' },
    { id: 'diagnosis', type: SECTION_TYPES.DIAGNOSIS, title: 'Diagnosis', enabled: true, order: 3, icon: 'MedicalServices' },
    { id: 'medications', type: SECTION_TYPES.MEDICATIONS, title: 'Medications', enabled: true, order: 4, icon: 'Medication' },
    { id: 'investigations', type: SECTION_TYPES.INVESTIGATIONS, title: 'Investigations', enabled: false, order: 5, icon: 'Science' },
    { id: 'advice', type: SECTION_TYPES.ADVICE, title: 'Advice', enabled: true, order: 6, icon: 'Notes' },
    { id: 'follow-up', type: SECTION_TYPES.FOLLOW_UP, title: 'Follow-up', enabled: true, order: 7, icon: 'Event' },
    { id: 'signature', type: SECTION_TYPES.SIGNATURE, title: 'Signature', enabled: true, order: 8, icon: 'Draw' },
];

export const SECTION_ICONS = {
    LocalHospital: LocalHospitalIcon,
    Person: PersonIcon,
    Medication: MedicationIcon,
    Science: ScienceIcon,
    Event: EventIcon,
    Notes: NotesIcon,
    Draw: DrawIcon,
    MonitorHeart: MonitorHeartIcon,
    MedicalServices: MedicalServicesIcon,
};
