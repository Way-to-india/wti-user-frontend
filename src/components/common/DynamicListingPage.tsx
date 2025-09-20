'use client';
import React, { ReactNode } from 'react';
import { Container, Grid, Box } from '@mui/material';
import { useTheme } from '@/context/ThemeContext';
import DynamicFilterSidebar, { FilterOptions } from './DynamicFilterSidebar';
import DynamicSearchSection from './DynamicSearchSection';
import DynamicPagination from './DynamicPagination';
import DynamicBreadcrumb, { BreadcrumbItem } from './DynamicBreadcrumb';
import DynamicFilterSidebarSkeleton from './DynamicFilterSidebarSkeleton';
import DynamicCardSkeleton from './DynamicCardSkeleton';
import NavBar from '../layout/navbar/NavBar';

export interface DynamicListingPageProps {
  type: 'tour' | 'hotel' | 'transport';
  title?: string;
  searchComponent: ReactNode;
  totalItems?: number;
  filterOptions: FilterOptions;
  onFilterChange: (filters: any) => void;
  initialFilterState?: any;
  breadcrumbs?: BreadcrumbItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  children: ReactNode;
  loading?: boolean;
  isSearching?: boolean;
  isFiltering?: boolean;
  error?: string;
}

const DynamicListingPage: React.FC<DynamicListingPageProps> = ({
  type,
  title,
  searchComponent,
  totalItems = 0,
  filterOptions,
  onFilterChange,
  initialFilterState,
  breadcrumbs,
  currentPage,
  totalPages,
  onPageChange,
  children,
  loading = false,
  isSearching = false,
  isFiltering = false,
  error,
}) => {
  const theme = useTheme();

  const handleEnquiryClick = () => {
    console.log(`Enquiry clicked for ${type}`);
  };

  const renderSkeletonCards = () => (
    <Grid container spacing={3}>
      {[...Array(9)].map((_, index) => (
        <Grid item xs={12} sm={6} lg={4} key={index}>
          <DynamicCardSkeleton type={type} />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <div style={{ backgroundColor: theme.colors.milkWhite, minHeight: '100vh' }}>
      <NavBar />

      <DynamicSearchSection
        type={type}
        title={title}
        searchComponent={searchComponent}
        totalItems={totalItems}
        loading={isSearching}
        onEnquiryClick={handleEnquiryClick}
      />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumb Navigation (if provided) - always shown */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <DynamicBreadcrumb items={breadcrumbs} />
          </Box>
        )}

        {/* Error handling */}
        {error ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <p style={{ color: theme.colors.heavyMetal }}>{error}</p>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Filter Sidebar - Show skeleton during filtering, otherwise actual component */}
            <Grid item xs={12} md={3}>
              {isFiltering ? (
                <DynamicFilterSidebarSkeleton />
              ) : (
                <DynamicFilterSidebar
                  type={type}
                  options={filterOptions}
                  onFilterChange={onFilterChange}
                  initialState={initialFilterState}
                />
              )}
            </Grid>

            <Grid item xs={12} md={9}>
              {loading ? renderSkeletonCards() : children}
              {!loading && (
                <DynamicPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onChange={onPageChange}
                  showFirstButton
                  showLastButton
                />
              )}
            </Grid>
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default DynamicListingPage;
