import React from 'react'
import { Card as MuiCard, CardContent, CardHeader, CardActions, Box } from '@mui/material'

function Card({ 
  title, 
  subtitle, 
  action, 
  children, 
  footer, 
  sx = {},
  contentSx = {},
  ...props 
}) {
  return (
    <MuiCard sx={{ ...sx }} {...props}>
      {(title || subtitle || action) && (
        <CardHeader
          title={title}
          subheader={subtitle}
          action={action}
          titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
          subheaderTypographyProps={{ variant: 'body2' }}
          sx={{ pb: 0 }}
        />
      )}
      <CardContent sx={{ ...contentSx }}>
        {children}
      </CardContent>
      {footer && (
        <CardActions sx={{ px: 2, pb: 2 }}>
          {footer}
        </CardActions>
      )}
    </MuiCard>
  )
}

export default Card