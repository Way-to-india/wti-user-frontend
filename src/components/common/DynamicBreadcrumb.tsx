'use client';
import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

export interface BreadcrumbItem {
  href: string;
  text: string;
  isLast?: boolean;
}

export interface DynamicBreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

const DynamicBreadcrumb: React.FC<DynamicBreadcrumbProps> = ({
  items,
  separator = <ChevronRightIcon fontSize="small" />,
  className
}) => {
  const theme = useTheme();
  const router = useRouter();

  const breadcrumbItems = items.map((item, index) => ({
    ...item,
    isLast: item.isLast !== undefined ? item.isLast : index === items.length - 1
  }));

  return (
    <Box className={className}>
      <Breadcrumbs
        separator={separator}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            mx: 0.5,
            color: theme.colors.heavyMetal,
          },
        }}
      >
        {breadcrumbItems.map((item, index) => {
          const { href, text, isLast } = item;

          return isLast ? (
            <Typography
              key={index}
              sx={{
                color: theme.colors.carrotOrange,
                fontSize: theme.typography.fontSize.body,
              }}
            >
              {text}
            </Typography>
          ) : (
            <Link
              key={index}
              underline="hover"
              sx={{
                color: theme.colors.heavyMetal,
                fontSize: theme.typography.fontSize.body,
                cursor: 'pointer',
                '&:hover': {
                  color: theme.colors.carrotOrange,
                },
              }}
              onClick={() => router.push(href)}
            >
              {text}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default DynamicBreadcrumb;