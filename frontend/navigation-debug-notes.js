// Alternative navigation approaches for debugging

// Approach 1: Store state in sessionStorage and use window.location
const handleEditTemplate = (templateId, consultationState) => {
    // Save state to sessionStorage for restoration
    sessionStorage.setItem('consultationReturnState', JSON.stringify({
        returnTo: '/consultation',
        returnState: consultationState
    }));

    // Use window.location for guaranteed navigation
    window.location.href = `/form-builder/${templateId}`;
};

// Approach 2: Use navigate with explicit options
const handleEditTemplate2 = (navigate, templateId, consultationState) => {
    const targetPath = `/form-builder/${templateId}`;
    const navState = {
        returnTo: '/consultation',
        returnState: consultationState
    };

    // Try with various options
    navigate(targetPath, {
        state: navState,
        replace: false,
        preventScrollReset: false
    });
};

// Approach 3: Use Link component instead of button onClick
// In JSX:
// <Link
//   to={`/form-builder/${consultationTemplate.id}`}
//   state={{ returnTo: '/consultation', returnState: {...} }}
// >
//   <Button>Edit</Button>
// </Link>
