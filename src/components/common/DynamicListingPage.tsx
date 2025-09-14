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
import NavBar from '../navbar/NavBar';

export interface DynamicListingPageProps {
  // Page type
  type: 'tour' | 'hotel' | 'transport';
  
  // Page title
  title?: string;
  
  // Search section
  searchComponent: ReactNode;
  totalItems?: number;
  
  // Filter sidebar
  filterOptions: FilterOptions;
  onFilterChange: (filters: any) => void;
  initialFilterState?: any;
  
  // Breadcrumb
  breadcrumbs?: BreadcrumbItem[];
  
  // Pagination
  currentPage: number;
  totalPages: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  
  // Content
  children: ReactNode;
  
  // Loading states
  loading?: boolean;
  isSearching?: boolean;
  isFiltering?: boolean;
  error?: string;
}

/**
 * A unified layout component for listing pages (tours, hotels, transport)
 * that combines all common components with a consistent structure.
 * Includes improved loading states for better user experience.
 */
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
  error
}) => {
  const theme = useTheme();

  const handleEnquiryClick = () => {
    console.log(`Enquiry clicked for ${type}`);
    // Handle enquiry - could navigate to contact page or open a modal
  };

  // Create skeleton cards grid for content loading
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
      
      {/* Dynamic Search Section - always shown */}
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

            {/* Main Content Area */}
            <Grid item xs={12} md={9}>
              {/* Content - Show skeleton during loading, otherwise actual content */}
              {loading ? renderSkeletonCards() : children}

              {/* Pagination - Only show if not loading */}
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