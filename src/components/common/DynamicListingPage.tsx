'use client';
import React, { ReactNode } from 'react';
import { Container, Grid, Box } from '@mui/material';
import { useTheme } from '@/context/ThemeContext';
import NavBar from '../layout/navbar/NavBar';
import DynamicFilterSidebar, { FilterOptions } from './DynamicFilterSidebar';
import DynamicSearchSection from './DynamicSearchSection';
import DynamicPagination from './DynamicPagination';
import DynamicBreadcrumb, { BreadcrumbItem } from './DynamicBreadcrumb';
import DynamicFilterSidebarSkeleton from './skeletons/DynamicFilterSidebarSkeleton';
import DynamicCardSkeleton from './skeletons/DynamicCardSkeleton';
import LoadingIndicators from './LoadingIndicators';
import ErrorDisplay from './ErrorMessage';

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
  retryCount?: number;
  isRetrying?: boolean;
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
  retryCount = 0,
  isRetrying = false,
}) => {
  const theme = useTheme();

  const handleEnquiryClick = () => {
    console.log(`Enquiry clicked for ${type}`);
  };

  const handleReload = () => {
    window.location.reload();
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

  const showLoadingState = loading && !isFiltering && !isRetrying;
  const showContent = !error || isRetrying;

  return (
    <Box sx={{ backgroundColor: theme.colors.milkWhite, minHeight: '100vh' }}>
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

        {breadcrumbs && breadcrumbs.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <DynamicBreadcrumb items={breadcrumbs} />
          </Box>
        )}


        <LoadingIndicators
          isRetrying={isRetrying}
          isSearching={isSearching}
          isFiltering={isFiltering}
          loading={loading}
          retryCount={retryCount}
        />


        {error && !isRetrying ? (
          <ErrorDisplay error={error} onReload={handleReload} />
        ) : (
          /* Main Content Grid */
          <Grid container spacing={3}>

            <Grid item xs={12} md={3}>
              {isFiltering || loading ? (
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
              {showLoadingState ? (
                renderSkeletonCards()
              ) : (
                <>
                  {children}
                  {totalPages > 1 && (
                    <DynamicPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onChange={onPageChange}
                      showFirstButton
                      showLastButton
                    />
                  )}
                </>
              )}
            </Grid>
          </Grid>
        )}
      </Container>


      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </Box>
  );
};

export default DynamicListingPage;