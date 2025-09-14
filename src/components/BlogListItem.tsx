import React from 'react';

interface BlogListItemProps {
    title: string;
    date?: string;
    onClick?: () => void;
}

const BlogListItem: React.FC<BlogListItemProps> = ({ title, date, onClick }) => {
    // Format date if provided
    const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }) : null;

    return (
        <div className="flex items-center space-x-2 w-full">
            {/* Bullet Point */}
            <div className="text-carrot-orange font-bold text-xl flex-none">▮</div>

            {/* Title and Lines */}
            <div className="flex-grow flex flex-col">
                {/* Line above */}
                <span className="w-full h-px bg-gray-300 mb-2"></span>

                {/* Title */}
                <div className="flex flex-col py-2">
                    <a 
                        className="hover:underline text-lg font-semibold cursor-pointer"
                        onClick={onClick}
                    >
                        {title}
                    </a>
                    {formattedDate && (
                        <span className="text-xs text-gray-500 mt-1">{formattedDate}</span>
                    )}
                </div>

                {/* Line below */}
                <span className="w-full h-px bg-gray-300 mt-2"></span>
            </div>
        </div>
    );
};

export default BlogListItem;
