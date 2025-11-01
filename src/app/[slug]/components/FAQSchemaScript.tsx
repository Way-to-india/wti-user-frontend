import React from 'react';

interface FAQSchemaScriptProps {
    faqSchema: any;
}

const FAQSchemaScript: React.FC<FAQSchemaScriptProps> = ({ faqSchema }) => {
    if (!faqSchema || !faqSchema.mainEntity || faqSchema.mainEntity.length === 0) {
        return null;
    }
    return (
        <script
            id="faq-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(faqSchema),
            }}
        />
    );
};

export default FAQSchemaScript;