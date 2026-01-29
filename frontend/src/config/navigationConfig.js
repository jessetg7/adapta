// src/config/navigationConfig.js
export const navigationConfig = {
  menuItems: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'DashboardIcon',
      path: '/',
      permission: null, // Accessible to all
    },
    {
      id: 'consultation',
      label: 'Patient Consultation',
      icon: 'LocalHospitalIcon',
      path: '/consultation',
      permission: 'consultation.view',
    },
    {
      id: 'create-prescription',
      label: 'Prescription',
      icon: 'MedicationIcon',
      path: '/prescription/create',
      permission: 'prescriptions.create',
    },
    {
      id: 'form-builder',
      label: 'Form Builder',
      icon: 'BuildIcon',
      path: '/form-builder',
      permission: 'forms.create',
    },
    {
      id: 'templates',
      label: 'Template Manager',
      icon: 'ArticleIcon',
      path: '/templates',
      permission: 'templates.view',
    },
    {
      id: 'rules',
      label: 'Rule Manager',
      icon: 'RuleIcon',
      path: '/rules',
      permission: 'rules.manage',
    },
    {
      id: 'workflows',
      label: 'Workflow Manager',
      icon: 'AccountTreeIcon',
      path: '/workflows',
      permission: 'workflows.manage',
    },
    {
      id: 'admin',
      label: 'Admin Panel',
      icon: 'AdminPanelSettingsIcon',
      path: '/admin',
      permission: 'admin.access',
    },
  ],
};