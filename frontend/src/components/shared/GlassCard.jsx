// src/components/shared/GlassCard.jsx
import React from 'react';
import { Card, CardContent, Box } from '@mui/material';

/**
 * GlassCard - Reusable glassmorphism card component
 * 
 * @param {Object} props
 * @param {number} blur - Blur intensity (default: 12)
 * @param {string} tint - Glass tint color (default: based on theme)
 * @param {boolean} glow - Enable glow effect (default: false)
 * @param {string} glowColor - Glow color (default: primary.main)
 * @param {Object} sx - Additional MUI sx props
 * @param {React.ReactNode} children - Card content
 */
const GlassCard = ({
    blur = 12,
    tint,
    glow = false,
    glowColor,
    sx = {},
    children,
    ...props
}) => {
    return (
        <Card
            {...props}
            sx={{
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                backgroundColor: (theme) =>
                    tint || (theme.palette.mode === 'dark'
                        ? 'rgba(10, 10, 10, 0.6)'
                        : 'rgba(255, 255, 255, 0.7)'),
                border: (theme) => theme.palette.mode === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: (theme) => glow
                    ? theme.palette.mode === 'dark'
                        ? `0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 0 30px ${glowColor || theme.palette.primary.main}40`
                        : `0 8px 32px 0 rgba(31, 38, 135, 0.25), 0 0 30px ${glowColor || theme.palette.primary.main}30`
                    : theme.palette.mode === 'dark'
                        ? '0 8px 24px 0 rgba(0, 0, 0, 0.5)'
                        : '0 8px 24px 0 rgba(31, 38, 135, 0.2)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': glow ? {
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                        ? `0 12px 40px 0 rgba(0, 0, 0, 0.6), 0 0 50px ${glowColor || theme.palette.primary.main}60`
                        : `0 12px 40px 0 rgba(31, 38, 135, 0.3), 0 0 50px ${glowColor || theme.palette.primary.main}40`,
                } : {},
                ...sx,
            }}
        >
            {children}
        </Card>
    );
};

export default GlassCard;
