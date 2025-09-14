// components/details-page/Breadcrumb-Nav.tsx
import React from 'react';
import Link from 'next/link';

interface Breadcrumb {
    href: string;
    text: string;
}

interface BreadcrumbNavProps {
    breadcrumbs: Breadcrumb[];
    currentTitle: string;
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ breadcrumbs, currentTitle }) => {
    return (
        <nav className="text-md text-gray-500 mb-4">
            {breadcrumbs.map((breadcrumb, index) => (
                <span key={index}>
                    <Link href={breadcrumb.href} className="hover:text-blue-600">
                        {breadcrumb.text}
                    </Link>
                    {index < breadcrumbs.length - 1 ? " --> " : " --> "}
                </span>
            ))}
            <span className="text-carrot-orange font-bold"> {currentTitle}</span>
        </nav>
    );
};

export default BreadcrumbNav;
