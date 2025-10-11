'use client';
import React, { ReactNode } from 'react';
import { Container, Grid, Box, CircularProgress, Alert, AlertTitle } from '@mui/material';
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

  const renderSkeletonCards = () => (
    <Grid container spacing={3}>
      {[...Array(9)].map((_, index) => (
        <Grid item xs={12} sm={6} lg={4} key={index}>
          <DynamicCardSkeleton type={type} />
        </Grid>
      ))}
    </Grid>
  );

  const renderRetryIndicator = () => (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        backgroundColor: theme.colors.carrotOrange,
        color: 'white',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <CircularProgress size={20} sx={{ color: 'white' }} />
      <div>
        <div style={{ fontWeight: 600, fontSize: '14px' }}>Retrying connection...</div>
        <div style={{ fontSize: '12px', opacity: 0.9 }}>Attempt {retryCount} of 3</div>
      </div>
    </Box>
  );

  const renderLoadingIndicator = (message: string) => (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        backgroundColor: theme.colors.carrotOrange,
        color: 'white',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <CircularProgress size={20} sx={{ color: 'white' }} />
      <div style={{ fontWeight: 600, fontSize: '14px' }}>{message}</div>
    </Box>
  );

  const renderFilteringIndicator = () => (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        color: 'white',
        padding: '24px 32px',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        minWidth: '250px',
      }}
    >
      <CircularProgress size={40} sx={{ color: theme.colors.carrotOrange }} />
      <div style={{ fontWeight: 600, fontSize: '16px', marginTop: '12px' }}>Applying Filters</div>
      <div style={{ fontSize: '13px', opacity: 0.9, textAlign: 'center' }}>
        Finding the best tours for you...
      </div>
    </Box>
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
        {/* Breadcrumb Navigation */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <DynamicBreadcrumb items={breadcrumbs} />
          </Box>
        )}

        {/* Retry Indicator */}
        {isRetrying && renderRetryIndicator()}

        {/* Loading Indicator for initial load or searching */}
        {(loading || isSearching) &&
          !isFiltering &&
          !isRetrying &&
          renderLoadingIndicator(loading ? 'Fetching tours...' : 'Searching tours...')}

        {/* Filtering Indicator - Center Modal */}
        {isFiltering && renderFilteringIndicator()}

        {/* Error handling with improved UI */}
        {error && !isRetrying ? (
          <Box sx={{ maxWidth: '600px', mx: 'auto', mt: 4 }}>
            <Alert
              severity="error"
              sx={{
                borderRadius: '12px',
                '& .MuiAlert-icon': {
                  fontSize: '28px',
                },
              }}
            >
              <AlertTitle sx={{ fontWeight: 600, fontSize: '16px' }}>
                Unable to Load Tours
              </AlertTitle>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>
                {error.includes('timeout') || error.includes('exceeded')
                  ? "The request is taking longer than expected. We've tried multiple times but couldn't connect. Please check your internet connection and try again."
                  : error}
              </div>
              <Box sx={{ mt: 2 }}>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    backgroundColor: theme.colors.carrotOrange,
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                >
                  Reload Page
                </button>
              </Box>
            </Alert>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Filter Sidebar */}
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

            {/* Main Content */}
            <Grid item xs={12} md={9}>
              {loading ? (
                <>{renderSkeletonCards()}</>
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

      {/* Add CSS for animations */}
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
    </div>
  );
};

export default DynamicListingPage;
